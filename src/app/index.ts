import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import 'dotenv/config';
import '@/app/connection';
import Routes from '@/routes';
import * as Exception from '@/app/exception';

const app = express();
const PORT = process.env.PORT || 3000; // 如果沒有設定 PORT，則默認使用 3000

// const VALID_ORIGINS = ['http://localhost:5173', 'https://54hanyi.github.io'];


app.use(cors({
  origin: ['http://localhost:5173', 'https://54hanyi.github.io'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  credentials: true // 確保支持憑證
}));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.use('/public', express.static('public'));

app.use(Routes);

app.use(Exception.sendNotFoundError);
app.use(Exception.catchCustomError);

Exception.catchGlobalError();

app.listen(process.env.PORT, () => {
    console.log(`listening on http://localhost:${PORT}`);
});