import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import productRoutes from './routes/productRoutes.js';
import { sql } from './config/db.js';
import { aj } from './lib/arcjet.js';


dotenv.config();

const app = express();
app.use(helmet());

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

console.log('Environment Variables:', process.env.PORT);

app.use('/api/products', productRoutes);

async function initDB(){
    try{
      await sql `
      CREATE TABLE IF NOT EXISTS products(
      id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        IMAGE VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT current_timestamp
      )`

      console.log('Database initialized successfully');
    }
    catch(error){
        console.error('Error initializing database:', error);
    }
}


app.use(async (req, res, next) => {
    try{
   const decision=await aj.protect(req,{
    requested:1
   });

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      res.status(429).end(JSON.stringify({ error: "Too Many Requests" }));

    } else if (decision.reason.isBot()) {
      res.status(403).end(JSON.stringify({ error: "No bots allowed" }));
    }
    else{
        res.status(403).end(JSON.stringify({ error: "Forbidden" }));
    }
    return;
}

if(decision.results.some((result)=>result.reason.isBot() && result.reason.isSpoofed())){
    res.status(403).end(JSON.stringify({ error: "Spoofed bot detected" }));
    return;
}

next();

    }
    catch(error){
        console.error('Error in Arcjet middleware:', error);
        next(error);
    }
})

initDB().then(()=>{
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
})





