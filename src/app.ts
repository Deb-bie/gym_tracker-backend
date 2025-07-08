import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler, logger, notFound } from "./middleware/index"
import routes from './routes';

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    // Security middleware
    this.app.use(helmet());

    // CORS middleware
    this.app.use(cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
    }));

    // Body parsing middleware
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Request logging
    this.app.use(logger);
  }

  private initializeRoutes(): void {
    // API routes
    this.app.use('/api/v1', routes);

    // Root endpoint
    this.app.get('/', (req, res) => {
      res.json({
        success: true,
        message: 'Gym Tracker',
        version: '1.0.0',
        endpoints: {
          health: '/api/v1/health',
          equipments: '/api/v1/equipments',
          users: '/api/v1/users'
        },
      });
    });
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use(notFound);

    // Global error handler
    this.app.use(errorHandler);
  }

  public listen(port: number): void {
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log(`Environment: ${process.env.ENV || 'development'}`);
      console.log(`API URL: http://localhost:${port}/api/v1`);
    });
  }
}

export default App;