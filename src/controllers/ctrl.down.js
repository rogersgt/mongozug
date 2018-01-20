import Log from '../models/log.model';

export default function down(...args) {
  return Promise.resolve(...args)
  .catch((e) => {
    new Log('Error on down', 'Error on down', true);
  });
}
