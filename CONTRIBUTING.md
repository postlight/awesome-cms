# How to Contribute to Awesome CMS

_All scripts require **Node 6** or greater. Use [NVM][] to easily install it._

## [data.toml](/data.toml) and [meta.toml](/meta.toml)

[data.toml](/data.toml) and [meta.toml](/meta.toml) use the human-friendly [TOML]
markup language. Together, they are used to generate the README.

## Generate the README.md

The [README.md](/) for this project is generated from the data in
[`data.toml`](data.toml).

```
# Edit data.toml
npm install
npm run generate-readme
```

## Convert a URL to [TOML][]

The [`scripts`](/scripts) folder contains `url-to-toml.js`, a script
to easily convert a URL into TOML. E.g.

```
node scripts/url-to-toml.js https://github.com/jekyll/jekyll-admin
```

will generate

```toml

[[cms]]
name = "Jekyll Admin - A Jekyll plugin that provides users with a traditional CMS-style graphical interface to author content and administer Jekyll sites."
description = "A Jekyll plugin that provides users with a traditional CMS-style graphical interface to author content and administer Jekyll sites."
url = "https://jekyll.github.io/jekyll-admin/"
github_repo = "jekyll/jekyll-admin"
language = "javascript"
```

Data is scraped using [X-Ray](https://github.com/lapwinglabs/x-ray). Some hand
editing is normally needed.

[NVM]: https://github.com/creationix/nvm
[TOML]: (https://github.com/toml-lang/toml)
