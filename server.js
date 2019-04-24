//import 3rd package
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
//import my package
const {mongoURI} = require('./config/key');
//connect database
mongoose.connect("mongodb+srv://admin:admin123@cluster0-ctwbb.mongodb.net/test?retryWrites=true", {useNewUrlParser: true})
        .then(() => console.log("Connect to database successfull."))
        .catch(console.log);

//init server
const app = express();
//middleware: body-parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//middleware: passport
app.use(passport.initialize());
require('./config/passport')(passport);
//middleware: upload image
app.use('/uploads',express.static('uploads'));
//routes
app.use('/api/users', require('./routes/api/api_user'));
app.use('/api/trips', require('./routes/api/api_trip'));
//port
const port = 5000;



app.listen(port, () => {
    console.log(`server is running at port ${port}`);
})