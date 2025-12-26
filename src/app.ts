import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { corsOptions } from '@/config/cors';
import monitoring from '@/middlewares/monitoring';
import errorHandler from '@/middlewares/error-handler';
import routes from '@/routes';

const app = express();

app.use(helmet());
app.use(cors(corsOptions));

app.use(monitoring());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', routes.root());
app.get('/metrics', routes.metrics);
app.use('/v1', routes.v1);

app.use(errorHandler());

export default app;
