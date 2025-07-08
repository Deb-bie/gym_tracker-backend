import App from './src/app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT;

async function startServer(): Promise<void> {
  try {
    const app = new App();
    app.listen(parseInt(PORT || '3000'));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
