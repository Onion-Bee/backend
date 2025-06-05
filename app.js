const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load env variables
dotenv.config();

// Connect to MongoDB and Redis
require('./config/db');
const { redisClient } = require('./config/redisClient');

const chapterRoutes = require('./routes/chapterRoutes');
const { errorHandler } = require('./middleware/errorHandler');
const { rateLimiter } = require('./middleware/rateLimiter');

const app = express();

//We are temporary allowing the user admin role to be abe to upload the files
// app.use((req, res, next) => {
//   req.user = { role: 'admin' };
//   next();
// });

// Global Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(morgan('dev'));

// Rate Limiting middleware applied globally
app.use(rateLimiter);

// Routes
app.use('/api/v1/chapters', chapterRoutes);

// Error Handler (should be after routes)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});