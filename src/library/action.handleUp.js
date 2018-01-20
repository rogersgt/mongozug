import parseMigrations from './action.parseMigrationsDir';
import Command from '../models/command.model';
import Log from '../models/log.model';

const cmd = new Command();

export default async function handleUp(...args) {
  if (args.length === 0) {
    // run all migrations because no file name was specified
    new Log('Up - no migrations filter specified', 'Checking for and running all pending migrations');
    const migrations = await parseMigrations();
    for (let i = 0; i < migrations.length; i++) {
      const migration = migrations[i];
      await migration.up();
    }
  } else if (command.childArguments.length === 1) {
    const migration = await parseMigrations(args[0]);
    await migration.up();
  } else {
    return Promise.reject('Incorrect number of migration file name arguments');
  }
  return Promise.resolve({ success: true });
}
