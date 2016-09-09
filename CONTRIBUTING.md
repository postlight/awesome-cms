# How to Contribute to Awesome CMS

_All scripts require **Node 6** or greater. Use [NVM][] to easily install it._

## Generate the README.md

The [README.md](/) for this project is generated from the data in
[`data.toml`](data.toml).

```
# Edit data.toml
npm install
npm run generate-readme
```

## Convert a URL to [TOML](https://github.com/toml-lang/toml)

The [`scripts`](/scripts) folder contains `url-to-toml.js`, a script
to easily convert a URL into TOML. E.g.


```
node scripts/url-to-toml.js https://github.com/keystonejs/keystone

[[cms]]
name = "KeystoneJS · Node.js cms and web application platform built on Express and MongoDB"
description = "node.js cms and web app framework"
url = "http://www.keystonejs.com"
github_repo = "keystonejs/keystone"
language = "javascript"
```

Data is scraped using [X-Ray](https://github.com/lapwinglabs/x-ray). Some hand
editing is normally needed.

[NVM]: https://github.com/creationix/nvm
