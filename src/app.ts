import express from 'express';
import bodyParser from 'body-parser';
import env from '@/config/env';
import errorHandler from '@/middlewares/error-handler';
import routes from './routes';

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({ message: 'Express App API', version: '0.1.0' });
});

app.use('/v1', routes.v1);

app.use(errorHandler);

app.listen(env.PORT, (error) => {
  if (error) {
    console.error('Error starting server:', error);
  } else {
    console.log(`Server is running at http://localhost:${env.PORT}`);
  }
});
