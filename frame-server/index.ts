import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import frameRoute from './routes/frame';
import frameImageRouter from './routes/frame-image.js';
import txRoute from './routes/tx';

const app = express();

// 📂 مسیر سرو تصاویر ثابت مثل active.png یا success.png
app.use('/images', express.static('public/images'));

// 🧠 مسیر فریم اصلی
app.use(frameRoute);
// 🕒 مسیر تصویر تایمر زنده
app.use(frameImageRouter);
app.use(txRoute);
const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`✅ Frame server ready at http://localhost:${PORT}`);
});
