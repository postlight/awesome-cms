const fs = require('fs');
const toml = require('toml');
const groupBy = require('lodash/groupBy');
const sortBy = require('lodash/sortBy');
const { camelizeKeys } = require('humps');
const Xray = require('x-ray');
const Handlebars = require('handlebars');

const readmeTemplate = Handlebars.compile(
  fs.readFileSync('./README.md.hbs').toString()
);

const x = Xray();

const GITHUB_URL = 'https://github.com';

const numberWithCommas = (n) => {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const fetchStarCount = (githubURL) => (
  new Promise((resolve, reject) => {
    x(githubURL, '.js-social-count')((err, count) => {
      if (err) {
        return reject(err);
      }
      return resolve(count && count.trim().replace(',', ''));
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
          return fetchStarCount(githubURL).then((starCount) => ({
            name,
            githubURL,
            starCount: numberWithCommas(starCount),
            url: githubRepo && url,
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
      cmses,
    }));
  })).then((cmsGroups) => {
    fs.writeFileSync('README.md', readmeTemplate({
      tocEntries,
      cmsGroups,
      generationTime: (new Date()).toString(),
    }));
  });
};

generateReadme();
