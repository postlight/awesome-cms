const fs = require('fs');
const toml = require('toml');
const groupBy = require('lodash/groupBy');
const sortBy = require('lodash/sortBy');
const { camelizeKeys } = require('humps');

const GITHUB_URL = 'https://github.com';

const mdLink = (text, url) => `[${text}](${url})`;

function generateReadme() {
  const metaContents = fs.readFileSync('./meta.toml');
  const meta = camelizeKeys(toml.parse(metaContents));
  const dataContents = fs.readFileSync('./data.toml');
  const data = camelizeKeys(toml.parse(dataContents));

  const { languagesToHuman } = meta;
  const cmsesByLanguage = groupBy(data.cms, 'language');
  const languageKeys = Object.keys(cmsesByLanguage).sort();

  const tocText = languageKeys.map((key) => (
    `- [${languagesToHuman[key]}](#${languagesToHuman[key].toLowerCase()})`
  )).join('\n');

  const cmsGroupsText = languageKeys.map((key) => {
    const cmsesForLanguage = cmsesByLanguage[key];
    const sortedCMSES = sortBy(
      cmsesForLanguage, ({ name }) => name.toLowerCase()
    );
    const cmsGroupText = sortedCMSES.map(
       ({ name, description, githubRepo, url }) => ([
         '- ',
         githubRepo ?
         mdLink(name, `${GITHUB_URL}/${githubRepo}`)
         :
         mdLink(name, url),
         githubRepo && url && ` [${mdLink('website', url)}]`,
         ' - ',
         description,
       ].join(''))
    ).join('\n');

    return (`
### ${languagesToHuman[key]}

${cmsGroupText}
`);
  }).join('\n');

  // TODO use a template
  fs.writeFileSync('README.md',
`# Awesome CMS [![Awesome][awesome-image]][awesome-repo]

${tocText}

## Content Management Systems
${cmsGroupsText}

[awesome-image]: https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg
[awesome-repo]: https://github.com/sindresorhus/awesome
`
  );
}

generateReadme();
