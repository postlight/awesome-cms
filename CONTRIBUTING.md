# How to Add a CMS to Awesome CMS

Awesome CMS currently accepts open-source CMSes with over **50 stars** on GitHub
and a commit within the last year. Closed-source CMSes will be judged on a
case-by-case basis.

_Note: **Do not** generate README.md. That will happen after your pull request
is accepted._

## On GitHub

### 1. [Create a new file][] in the [data folder](/data) named as follows:

- Open source? Use the _lowercase_ filename `org#repo.toml`.
- Closed source? Use the _lowercase_ product name, with dashes substituded for spaces `product-name.toml`.

### 2. Fill out this template

```toml
name = ""
description = ""
# A URL other than the GitHub URL
url = ""
# If there's an awesome list for this CMS.
awesome_repo = "org/repo"
# Only if it's open source
github_repo = "org/repo"
# Lower case, e.g. javascript, php, c#.
language = ""
```

**Example**

```toml
name = "WordPress"
description = "WordPress is a free and open-source content management system (CMS) based on PHP and MySQL."
url = "https://wordpress.org"
github_repo = "WordPress/WordPress"
awesome_repo = "miziomon/awesome-wordpress"
language = "php"
```

### 3. Submit a pull request.

Be sure to check the boxes in the [pull request
template](/PULL_REQUEST_TEMPLATE.md).

## On Your Computer

1. Fork the repo on GitHub.
1. Clone the project.
1. Follow the steps above.
1. Push your work back up to your fork.
1. Submit a pull request.

# How README.md is Generated

_All scripts require **Node 6** or greater. Use [NVM][] to easily install it._

### The Data Folder

The files in the [`/data`](/data) folder and [meta.toml](/meta.toml) use the
human-friendly [TOML][] markup language. Together, they are used to generate the
README.

```
# Edit something in /data
npm install
npm run generateReadme
```

[NVM]: https://github.com/creationix/nvm
[TOML]: https://github.com/toml-lang/toml
[Create a new file]: https://github.com/postlight/awesome-cms/new/master/data?filename=org%23repo.toml
