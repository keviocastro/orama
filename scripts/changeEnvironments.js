const fs = require('fs');
const path = require('path');
const env = require('node-env-file');

const args = process.argv.slice(2);
const envFile = path.join(__filename, '..', '..', '.env');

env(envFile);
fs.readFile(envFile, 'utf8', (err, data) => {
  if (err) {
    return console.log(`Error: File ${envFile} was not found!`);
  }

  const contentChanged = data.replace(new RegExp(process.env.API_URL, 'g'), '192.168.0.15');
  fs.writeFile(envFile, contentChanged, 'utf8', (err) => {
    if (err) return console.log(err);
  });
});
