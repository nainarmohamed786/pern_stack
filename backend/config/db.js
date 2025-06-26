import {neon} from '@neondatabase/serverless';
import dotenv from 'dotenv';


dotenv.config();

// # postgresql://neondb_owner:npg_6PlMRdLh3qmw@ep-red-mountain-a8cssj35-pooler.eastus2.azure.neon.tech/neondb?sslmode=require


const {PGUSER,PGPASSWORD,PGHOST,PGDATABASE}=process.env;

export const sql=neon(
    `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`
)