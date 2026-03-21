const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

//security middlewares
app.use(helmet());
app.use(cors({origin: 'http://localhost:5173', credentials: true}));

//rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max : 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.'
});
app.use('/api/', limiter);

//Body parser
app.use(express.json());

//Health check route
app.get('/api/health', (req, res) => {
    res.json({message: 'RecipeNest API is running'});
});

//routes
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

//404 Handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

//global error handler
app.use((err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Server Error'
    })
});


module.exports = app;