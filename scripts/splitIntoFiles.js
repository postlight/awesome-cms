const fs = require('fs');
const toml = require('toml');
const { camelizeKeys, decamelize } = require('humps');

function splitIntoFiles() {
  const dataContents = fs.readFileSync('./data.toml');
  const data = camelizeKeys(toml.parse(dataContents));
  data.cms.forEach((cms) => {
    const { githubRepo, name } = cms;

    let fileName;
    if (githubRepo) {
      fileName = githubRepo.replace('/', '#');
    } else {
      fileName = name;
    }
    const fileContents = Object.keys(cms).map((key) => (
      `${decamelize(key)} = "${cms[key]}"`
    )).join('\n');

    fs.writeFileSync(`./data/${fileName.toLowerCase()}.toml`, fileContents);
  });
}

splitIntoFiles();
