import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import 'dotenv/config';
import '@/app/connection';
import Routes from '@/routes';
import * as Exception from '@/app/exception';

const app = express();

const corsOptions = {
  origin: ['http://localhost:5173', 'https://freyja-yr52.onrender.com'],
  credentials: true,  
};


app.use(cors(corsOptions));

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