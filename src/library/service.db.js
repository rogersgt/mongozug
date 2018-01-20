import mongoose from 'mongoose';
import colors from 'colors';

export async function establishConnection() {
  const dbHost = process.env.MZ_DB_HOST || 'mongodb://localhost:27017/test';
  mongoose.Promise = global.Promise;

  console.log(dbHost);

  if (!process.env.MZ_DB_HOST) {
      console.log(`
      Default MongoDB host set to: ${dbHost}
      To connect to another MongoDB, set env variable: 
      MZ_DB_HOST = mongodb://<username>:<password>@<host ip or dns name>:<port>/<database>
    `.dim);
  }
  return mongoose.connect(`${dbHost}`, { useMongoClient: true });
}


export async function closeConnection() {
  return mongoose.connection.close();
}
