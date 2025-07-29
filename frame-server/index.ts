import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import frameRouter from './frame.js';

const app = express();

// 👇 این خط رو اضافه کن
app.use('/images', express.static('public/images'));

app.use(frameRouter);

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`✅ Frame server ready at http://localhost:${PORT}`);
});
