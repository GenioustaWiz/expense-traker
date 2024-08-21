require('dotenv').config();

const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const indexRoutes = require('./routes/index');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const expenseRoutes = require('./routes/expense');
const budgetRoutes = require('./routes/budget');
const payMethodRoutes = require('./routes/paymentMethod');
const authMiddleware = require('./middleware/authMiddleware');
const errorMiddleware = require('./middleware/errorMiddleware');


const app = express();
// Middleware to parse JSON bodies
app.use(express.json());

// // Security middleware
app.use(helmet());
app.use(cookieParser());

// // Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs

  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to `true` if using HTTPS
  }));
  
const location = path.join(__dirname, "./public");
app.use(express.static(location));

// For Test Purposes
// app.use((req, res, next) => {
//   console.log('Request Headers:', req.headers);
//   console.log('Request Body:', req.body);
//   next();
// });
//  === End Test ====
// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/api/user', userRoutes); 
app.use('/categories', authMiddleware.isAuthenticated, categoryRoutes);
app.use('/expenses', authMiddleware.isAuthenticated, expenseRoutes);
app.use('/budgets', authMiddleware.isAuthenticated, budgetRoutes);
app.use('/payMethods', authMiddleware.isAuthenticated, payMethodRoutes);
app.use('/', authMiddleware.isAuthenticated, indexRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });

const PORT = 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });


module.exports = app;