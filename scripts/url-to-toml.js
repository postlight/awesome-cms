const compact = require('lodash/compact');
const Xray = require('x-ray');
const x = Xray();

function scrape(url) {
  var githubRepo;
  var githubOrg;
  if (/https:\/\/github.com/.test(url)) {
    const parts = url.split('/');
    githubOrg = parts[3];
    githubRepo = parts[4];
  }

  x(url, {
    title: 'title',
    description: 'meta[name="description"]@content',
    metaUrl: 'span[itemprop="url"]',
    languages: [ '.lang' ],
    // Fetch the title from the actual site, which will be more accurate.
    githubSite: x('span[itemprop="url"]@text', {
      title: 'title',
    })
  })(function (err, data) {
    if (!data) {
      return console.error(`Failed to scrape ${url}`);
    }
    var title = data.title;
    const metaUrl = data.metaUrl;
    var description = data.description;
    const firstLanguage = data.languages[0];

    // Handle special case where github duplicates the repo name in the
    // description.
    if (githubRepo) {
      description = description.split(' - ')[1];
    }

    var tomlArray = [
      '[[cms]]',
      `name = "${(data.githubSite.title || githubRepo || title || '').trim()}"`,
      `description = "${(description || title || '').trim()}"`,
      `url = "${metaUrl || url}"`,
      githubRepo && `github_repo = "${githubOrg}/${githubRepo}"`,
      firstLanguage && `language = "${firstLanguage.toLowerCase()}"`,
    ];

    console.log(compact(tomlArray).join('\n'));
  });
}

var url = process.argv[2];

if (!url) {
  console.error('No URL provided');
  process.exit();
}

scrape(url);
