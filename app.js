const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const dotenv = require('dotenv');
dotenv.config();

const orderRoute = require('./routes/order-route')
const productRoute = require('./routes/product-route')
const teacherRoute = require('./routes/teacher-route');
const studentRoute = require('./routes/student-route');

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Header', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).send({});
    }
    next();
});

app.use('/products', productRoute);
app.use('/orders', orderRoute);
app.use('/student', studentRoute);
app.use('/teacher', teacherRoute);

app.use((req, res, next) => {
    const error = new Error('Não encontrado');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        error: {
            mensagem: error.message
        }
    });
});

module.exports = app;