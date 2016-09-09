const fs = require('fs');
const toml = require('toml');
const groupBy = require('lodash/groupBy');
const sortBy = require('lodash/sortBy');
const { camelizeKeys } = require('humps');
const Xray = require('x-ray');

const x = Xray();

const GITHUB_URL = 'https://github.com';

const mdLink = (text, url) => `[${text}](${url})`;

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

  const tocText = languageKeys.map((key) => {
    let humanName = languagesToHuman[key];
    if (!humanName) {
      console.error(
        `Human name missing for "${key}" language. Add it to meta.toml`
      );
      humanName = key;
    }
    return `- [${humanName}](#${humanName.toLowerCase()})`;
  }).join('\n');

  Promise.all(languageKeys.map((key) => {
    const cmsesForLanguage = cmsesByLanguage[key];
    const sortedCMSES = sortBy(
      cmsesForLanguage, ({ name }) => name.toLowerCase()
    );

    const cmsGroupPromises = sortedCMSES.map(
      ({ name, description, githubRepo, url }) => {
        const githubURL = `${GITHUB_URL}/${githubRepo}`;

        if (githubRepo) {
          return fetchStarCount(githubURL).then((starCount) => [
            '- ',
            mdLink(name, githubURL),
            ` ${numberWithCommas(starCount)} ★`,
            githubRepo && url && ` [${mdLink('website', url)}]`,
            ' - ',
            description,
          ].join(''));
        }

        return [
          '- ',
          mdLink(name, url),
          ' - ',
          description,
        ].join('');
      }
    );

    return Promise.all(cmsGroupPromises).then((cmsGroupLines) => (
`
### ${languagesToHuman[key]}

${cmsGroupLines.join('\n')}
`
    ));
  })).then((allGroupsLines) => {
    const cmsGroupsText = allGroupsLines.join('\n');

    // TODO use a template
    fs.writeFileSync('README.md',
`# Awesome CMS [![Awesome][awesome-image]][awesome-repo]

${tocText}

## Content Management Systems
${cmsGroupsText}

_Last generated on ${(new Date()).toString()}_

[awesome-image]: https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg
[awesome-repo]: https://github.com/sindresorhus/awesome
`
  );
  });
};

generateReadme();
