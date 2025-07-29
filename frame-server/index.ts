import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import frameRouter from './frame.js';
import frameImageRouter from './frame-image.js';

const app = express();

// 📂 مسیر سرو تصاویر ثابت مثل active.png یا success.png
app.use('/images', express.static('public/images'));

// 🧠 مسیر فریم اصلی
app.use(frameRouter);

// 🕒 مسیر تصویر تایمر زنده
app.use(frameImageRouter);

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`✅ Frame server ready at http://localhost:${PORT}`);
});
