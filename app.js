const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const historyFallback = require('connect-history-api-fallback');
const logger = require('morgan');
const open = require('open');

const app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'dist/templates'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(historyFallback());
app.use(express.static(path.join(__dirname, 'dist/static')));
app.use(express.static(path.join(__dirname, 'dist/templates')));

app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

app.listen(4000, () => {
    console.log('server start at http://localhost:4000/web');
    open('http://localhost:4000/web');
})
