import handleUp from '../library/action.handleUp';
import Log from '../models/log.model';

export default function up(...args) {
  return Promise.resolve(...args)
  .then(handleUp)
  .catch((e) => {
    new Log('Error on up', 'Error on up', true);
  });
}
