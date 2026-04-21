
import { Client } from 'pg';


export const databaseProvider = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async () => {
      const client = new Client({
        host: 'localhost',
        port: 5432, 
        user: 'postgres',
        password: '1234',
        database: 'mi_base',
      });
      await client.connect();
      return client;
    }
  }
]