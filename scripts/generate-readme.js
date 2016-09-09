const fs = require('fs');
const toml = require('toml');
const groupBy = require('lodash/groupBy');
const sortBy = require('lodash/sortBy');
const compact = require('lodash/compact');
const { camelizeKeys } = require('humps');
const Xray = require('x-ray');
const Handlebars = require('handlebars');
const moment = require('moment');

const readmeTemplate = Handlebars.compile(
  fs.readFileSync('./README.md.hbs').toString()
);

const x = Xray({
  filters: {
    removeCommas(value) {
      return value && value.replace(',', '');
    },
    trim(value) {
      return value && value.trim();
    },
    toMoment(value) {
      return moment(value);
    },
  },
});

const GITHUB_URL = 'https://github.com';

const numberWithCommas = (n) => (
  n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
);

const fetchGitHubDetails = (githubURL) => (
  new Promise((resolve, reject) => {
    x(githubURL, {
      starCount: '.js-social-count | trim | removeCommas',
      lastCommit: 'relative-time@datetime | trim | toMoment',
    })((err, data) => {
      if (err) {
        console.error(`Error scraping ${githubURL}`, err);
        return reject(err);
      }
      return resolve(data);
    });
  })
);

const generateReadme = () => {
  const metaContents = fs.readFileSync('./meta.toml');
  const meta = camelizeKeys(toml.parse(metaContents));
  const dataContents = fs.readFileSync('./data.toml');
  const data = camelizeKeys(toml.parse(dataContents));

  const { languagesToHuman } = meta;
  const cmsesByLanguage = groupBy(data.cms, 'language');
  const languageKeys = Object.keys(cmsesByLanguage).sort();

  const tocEntries = languageKeys.map((key) => {
    let humanName = languagesToHuman[key];
    if (!humanName) {
      console.error(
        `Human name missing for "${key}" language. Add it to meta.toml`
      );
      humanName = key;
    }
    return {
      text: humanName,
      anchor: humanName.toLowerCase(),
    };
  });

  Promise.all(languageKeys.map((key) => {
    const cmsesForLanguage = cmsesByLanguage[key];
    const sortedCMSES = sortBy(
      cmsesForLanguage, ({ name }) => name.toLowerCase()
    );

    const cmsPromises = sortedCMSES.map(
      ({ name, description, githubRepo, url }) => {
        const githubURL = `${GITHUB_URL}/${githubRepo}`;

        if (githubRepo) {
          return fetchGitHubDetails(githubURL).then(({ starCount, lastCommit }) => ({
            name,
            githubURL,
            starCount: numberWithCommas(starCount),
            lastCommit: lastCommit.format('YYYY/MM/DD'),
            lastCommitISO: lastCommit.toISOString(),
            url,
            description,
          }));
        }

        return {
          name,
          url,
          description,
        };
      }
    );

    return Promise.all(cmsPromises).then((cmses) => ({
      name: languagesToHuman[key],
      headerColumns: compact([
        'Name',
        'Description',
      ]),
      cmses,
    }));
  })).then((cmsGroups) => {
    fs.writeFileSync('README.md', readmeTemplate({
      tocEntries,
      cmsGroups,
      generationTime: moment().format('MMMM Do, YYYY'),
    }));
  }).catch((error) => {
    console.error('Error generating readme', error);
  });
};

generateReadme();
