//import 3rd package
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
//import my package
const {mongoURI} = require('./config/key');
//connect database
const {MONGO_URI} = process.env;
//cmt link url : 'mongodb+srv://admin123:admin123@cluster0-ctwbb.mongodb.net/test?retryWrites=true'
mongoose.connect(MONGO_URI, {useNewUrlParser: true})
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
// enable cors 
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  
//routes
app.use('/api/users', require('./routes/api/api_user'));
app.use('/api/trips', require('./routes/api/api_trip'));
//port
const PORT = process.env.PORT || 5000;



app.listen(PORT, () => {
    console.log(`server is running at port ${PORT}`);
})