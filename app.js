const cors = require('cors');
const express = require('express');
require('express-async-errors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const config = require('./utils/config');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');
const blog_router = require('./controllers/blogs');
const login_router = require('./controllers/login');
const user_router = require('./controllers/users');

const app = express();

mongoose.connect(config.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology:true} )
        .then( () => {
            logger.info("connected to mongoDB")
        })
        .catch((err) => {
            logger.error("error connecting to mongoDB...", err.message); 
        });

app.use(cors());
app.use(express.static('build'));
app.use(express.json());

app.use(morgan('dev'));

app.use(middleware.token_extractor);  ///remember that this should run before the routes. ORDER IS VERY IMPORTANT

app.use('/api/blogs', blog_router);
app.use('/api/login', login_router);
app.use('/api/users', user_router);

if(process.env.NODE_ENV === 'test'){
    const testing_router = require('./controllers/testing');
    app.use('api/testing', testing_router);
}

app.use(middleware.error_handler);
app.use(middleware.unknown_endpoint);

module.exports = app;