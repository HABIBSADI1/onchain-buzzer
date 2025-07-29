import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import frameRouter from './frame.js';
import frameImageRouter from './frame-image.js';

const app = express();

// سرو فایل‌های استاتیک
app.use('/images', express.static('public/images'));

// تصویر داینامیک
app.use(frameImageRouter);

// روت‌های فریم
app.use(frameRouter);

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`✅ Frame server ready at http://localhost:${PORT}`);
});
