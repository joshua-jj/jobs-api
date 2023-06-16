import dotenv from 'dotenv';
dotenv.config();
import 'express-async-errors';
import express from 'express';
import fs from 'fs';

// extra security packages
import helmet from 'helmet';
import cors from 'cors';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';

// Swagger
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';

const file = fs.readFileSync('./swagger.yaml', 'utf8');
const swaggerDocument = YAML.parse(file)

const app = express();

// connectDB
import connectDB from './db/connect.js';

import authenticateUser from './middleware/authentication.js';

// routers
import authRouter from './routes/auth.js';
import jobsRouter from './routes/jobs.js';

// error handler
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply the rate limiting middleware to all requests
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(xss());

app.get('/', (req, res) => {
  res.send('<h1>Welcome to jobs api</h1><a href="/api-docs">Documentation</a>');
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
