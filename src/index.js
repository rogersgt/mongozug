import dotenv from 'dotenv';
import fs from 'fs';
import up from './controllers/ctrl.up';
import down from './controllers/ctrl.down';

const defaultFile = `${__dirname}/${process.env.NODE_ENV}.env`;
const namedEnvFilesExists = fs.existsSync(defaultFile);
const envFile = namedEnvFilesExists ? defaultFile : `${__dirname}/.env`;

if (!!fs.existsSync(envFile)) dotenv.config({ path: envFile });

export default {
  up,
  down,
}
