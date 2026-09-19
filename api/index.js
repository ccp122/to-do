import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { db } from './config/db.js'
import userRouter from './routes/user.js'
import boardRouter from './routes/board.js'

const app = express()
const port = 5000

app.use(cors({origin: "http://localhost:5173" }))
app.use(express.json())
app.use('/api/users', userRouter)
app.use('/api/boards', boardRouter)


db.query('SELECT NOW()')
  .then(() => {
    console.log('Successfully connected to Neon PostgreSQL.');
    app.listen(port, () => {
      console.log(`Server running smoothly on port ${port}.`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });
