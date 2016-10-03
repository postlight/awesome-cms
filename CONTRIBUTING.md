# How to Add a CMS to Awesome CMS

_Note: **Do not** generate README.md. That will happen after your pull request
is accepted._

## On GitHub

1. Open [/data.toml](/data.toml).
1. Click the edit button (pencil icon).
1. Add your new CMS.
1. Submit a pull request.

## On Your Computer

1. Fork the repo on GitHub.
1. Clone the project.
1. Commit changes to your own branch.
1. Push your work back up to your fork.
1. Submit a pull request.

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

# How README.md is Generated

_All scripts require **Node 6** or greater. Use [NVM][] to easily install it._

### [data.toml](/data.toml) and [meta.toml](/meta.toml)

[data.toml](/data.toml) and [meta.toml](/meta.toml) use the human-friendly [TOML]
markup language. Together, they are used to generate the README.

### Generating the README.

_Note, don't generate the README for your Pull Request. Otherwise it will
conflict._

The [README.md](/) for this project is generated from the data in
[`data.toml`](data.toml).

```
# Edit data.toml
npm install
npm run generate-readme
```

[NVM]: https://github.com/creationix/nvm
[TOML]: (https://github.com/toml-lang/toml)

