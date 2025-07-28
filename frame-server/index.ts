import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import frameRouter from './frame.js';

const app = express();
app.use(frameRouter);

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`✅ Frame server ready at http://localhost:${PORT}`);
});
