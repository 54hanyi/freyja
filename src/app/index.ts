import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import 'dotenv/config';
import '@/app/connection';
import Routes from '@/routes';
import * as Exception from '@/app/exception';

const app = express();

const VALID_ORIGIN = 'http://localhost:5173';

app.use(cors({
  origin: VALID_ORIGIN,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  credentials: true // 確保支持憑證
}));

// 處理 OPTIONS 預檢請求
app.options('/api/v1/rooms', (_, res) => {
  res.header('Access-Control-Allow-Origin', VALID_ORIGIN);
  res.header('Access-Control-Allow-Methods', 'POST, PATCH, OPTIONS'); // 允許的方法
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // 允許的 headers
  res.header('Access-Control-Allow-Credentials', 'true'); // 允許攜帶憑證（如 Cookies）
  res.header('Access-Control-Max-Age', '86400'); // 快取 24 小時 (秒)
  res.sendStatus(204); // 返回 204 表示成功
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.use('/public', express.static('public'));

app.use(Routes);

app.use(Exception.sendNotFoundError);
app.use(Exception.catchCustomError);

Exception.catchGlobalError();

app.listen(process.env.PORT, () => {
    console.log(`listening on http://localhost:${process.env.PORT}`);
});