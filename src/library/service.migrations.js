import fs from 'fs';
import colors from 'colors';
import Migration from '../models/migration.model';
import Command from '../models/command.model';
import * as db from './db.service';

const cmd = new Command();

async function handleUpFunction(migObj) {
  if (isValidMigrationObject(migObj)) {
    const name = migObj.name;
    const existingMigration = await Migration.findOne({ name });

    if (!!existingMigration && existingMigration.status === 'COMPLETED') {
      console.log(`${existingMigration.name}`.gray, `${existingMigration.status}`.green);
      return Promise.resolve();
    }

    const migProps = {
      name: migObj.name
    };


    if (!existingMigration || !existingMigration._id) {
      const m = new Migration(migProps);
      await m.save();
    }

    const savedMig = await Migration.findOne({ name: migObj.name });

    console.log(`
      running migration up: ${migObj.name}`.dim
    );

    await migObj.up()
    .catch((err) => {
      console.log(`${err}`.red);
      return Promise.reject(err);
    });

    savedMig.status = 'COMPLETED';
    await Migration.findOneAndUpdate({ name: migObj.name }, savedMig);
    return Promise.resolve(res);
  } else {
    console.log(`Bad Migration object.`.red);
    return Promise.reject(`
      Bad Migration object.

      Example:
      Migration {
        name: String,
        up: <Promise>,
        down: <Promise>
      }
    `)
  }
}

export async function handleAllMigrationObjects(migObjectsArr) {
  await db.establishConnection();

  for (let i = 0; i < migObjectsArr.length; i++) {
    const migObj = migObjectsArr[i].default;
    await handleUpFunction(migObj);
  }

  await db.closeConnection();
  return Promise.resolve();
}


function isValidMigrationObject(migObj) {
  return (migObj && migObj.up && typeof migObj.up === 'function' && migObj.name && migObj.name.length > 0);
}

export function getMigrationObjects(command=cmd) {
  const migrationsFolder = process.env.MZ_MIGRATIONS_FOLDER || `./migrations`;

  return new Promise((res, rej) => {
    if (!fs.existsSync(`${migrationsFolder}`)) {
      console.log(`ERROR: No migrations folder detected`.red);
      rej(`
        No Migrations folder detected.
        No folder exists named: ${migrationsFolder || 'undefined'}

        Set MZ_MIGRATIONS_FOLDER environment variable to define a migrations folder.
      `.gray);
    }

    fs.readdir(`${migrationsFolder}`, (err, files) => {
      if (err) {
        rej(`
         ${ `Error reading dir: ${migrationsFolder}`.red }
        `);
      } else {
        const resultingObjects = [];
          for (let i = 0; i < files.length; i++) {
            const f = files[i];
            const name = f.replace('.js', '');
            const nameSplitArr = name.split('.');
            const number = nameSplitArr.length > 0 ? nameSplitArr[0] : null;

            if (!number || !parseInt(number)) {
              console.log(`Invalid Migration File name`.red);

              return rej(`
                Invalid Migration File name
                name: ${name} is not allowed.

                example: 001.someCustomMigration.js || 002.anotherOne.js


              `.gray);
            }

            const migrationObject = require(`${migrationsFolder}/${name}`);
            resultingObjects.push(migrationObject);
          }
          res(resultingObjects);
      }
    });
  });
}
