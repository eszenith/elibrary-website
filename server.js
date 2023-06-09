
const express = require('express');
var path = require('path');

//cookie parser is used for managing cookies in http request and response
var cookieParser = require('cookie-parser');
const app = express()

// routes/index files contains all the functions handling different routes on the website which are then imported here
const indexRouter = require('./routes/index');
const bookAction = require('./routes/books');
const starAction = require('./routes/starAction');

//server uses port 3000
const port = 3000

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//all routes are added in the middleware chain
app.use('/', indexRouter);
app.use('/books', bookAction);
app.use('/star', starAction);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})