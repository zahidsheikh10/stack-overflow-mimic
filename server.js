const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const passport = require('passport');
const app = express();
const port = process.env.PORT || 3000;

//bring all routes
const auth = require("./routes/api/auth");
const questions = require("./routes/api/questions");
const profile = require("./routes/api/profile");

// Middleware for bodyparser
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json()); 

// mongoDB config
const db = require('./setup/myurl').mongoURL

// Connect to Database
mongoose
    .connect(db)
    .then(() => {
        console.log('Connection Sucessful');
    })
    .catch( (error) => {
        console.log(error);
    })
    
// passport middleware
app.use(passport.initialize());

//config for jwt strategy
require("./strategies/jsonwtStrategy")(passport);


//Routes

// Testing route
app.get('/',(req,res) => {
    res.send('Hey there Mongo db Project');
});

//Actual Route
app.use('/api/auth',auth);
app.use('/api/questions',questions);
app.use('/api/profile',profile);
app.listen(port,() => {
    console.log(`Server is running at Port : ${port}`);
});
