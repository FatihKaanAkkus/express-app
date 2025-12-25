import env from '@/config/env';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import monitoring from '@/middlewares/monitoring';
import errorHandler from '@/middlewares/error-handler';
import routes from '@/routes';

const app = express();

app.use(helmet());
app.use(cors());

app.use(monitoring());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', routes.root());
app.get('/metrics', routes.metrics);
app.use('/v1', routes.v1);

app.use(errorHandler());

app.listen(env.get<number>('PORT', 3001), (error) => {
  if (error) {
    console.error('Error starting server:', error);
  } else {
    if (env.get<string>('NODE_ENV', 'development') !== 'test') {
      console.log(`Server is running at http://localhost:${env.get<number>('PORT', 3001)}`);
    }
  }
});

export default app;
