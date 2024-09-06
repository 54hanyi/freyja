import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import 'dotenv/config';
import '@/app/connection';
import Routes from '@/routes';
import * as Exception from '@/app/exception';

const app = express();

const VALID_ORIGIN = 'http://localhost:5173';

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', VALID_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // 新增這行來允許憑證
  next();
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