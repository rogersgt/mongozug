import runPendingMigrations from '../library/action.runPendingMigrations';
import Log from '../models/log.model';

export default function up(...args) {
  return Promise.resolve(...args)
  .then(runPendingMigrations)
  .catch((e) => {
    new Log('Error on up', 'Error on up', true);
  });
}
