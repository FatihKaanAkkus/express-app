import env from '@/config/env';
import app from '@/app';

app.listen(env.get<number>('PORT', 3001), (error) => {
  if (error) {
    console.error('Error starting server:', error);
  } else {
    if (env.get<string>('NODE_ENV', 'development') !== 'test') {
      console.log(`Server is running at http://localhost:${env.get<number>('PORT', 3001)}`);
    }
  }
});
