require('dotenv').config();
const express = require('express');
const nunjucks = require('nunjucks');
const app = express();
const port = 3000;

const indexRouter = require('./routes/index');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
nunjucks.configure('views', {
    autoescape: true,
    express: app,
});

app.use('/', indexRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

app.use(express.static('public'))