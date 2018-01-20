import fs from 'fs';
import Log from '../models/log.model';

const migrationsFolder = process.env.MZ_MIGRATIONS_FOLDER || `${__dirname}/migrations`;

export default async function runPendingMigrations(migrationsNames=[]) {
  if (!!migrationsNames && migrationsNames.length > 0) {
    const files = await readMigrationsDir();
    const migrationModuleArray = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (isValidMigrationName(file) && migrationsNames.indexOf(file) >= 0) {
        const migrationName = file.replace('.js', '');
        const module = require(`${migrationsFolder}/${migrationName}`);
        migrationModuleArray.push(module.default || module);
      } else {
        new Log('Invalid migration file name', 'ERROR', true);
      }
    }
    return Promise.resolve(migrationModuleArray);
  }
  const text = `Bad parameter. Expected Array. Instead got ${typeof migrationsNames}`;
  new Log(text, 'ERROR', true);
  return Promise.reject(text);
}

function readMigrationsDir() {
  return new Promise((res, rej) => {
    fs.readdir(`${migrationsFolder}`, (err, files) => {
      if (!!files && files.length > 0) {
        const migrationModuleArray = [];
        res(files);
      } 
      const text = files.length === 0 ? 'No Migrations found' : 'No Migrations folder found!';
      new Log(text, 'ERROR', true);
      res([]);
    });
  });
}

function isValidMigrationName(fileName) {
  const name = fileName.replace('.js', '');
  const nameSplitArr = name.split('.');
  const number = nameSplitArr.length > 0 ? nameSplitArr[0] : null;
  if (!number || !parseInt(number)) {
    const text = `
    Invalid Migration File name
    name: ${name} is not allowed.

      example: 001.someCustomMigration.js || 002.anotherOne.js
    `;
    new Stdout(text, true, new Error(text), 'Missing Migrations folder');
  }
  return !!number && (parseInt(number) >= 0);
}

