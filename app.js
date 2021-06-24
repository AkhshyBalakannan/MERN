const express = require('express')
const app = express();
const ejs = require('ejs');
const path = require('path');
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const router = require('./routers/baseroute')
mongoose.connect('mongodb://localhost:27017/bankdetails', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }));
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', router);



app.all('*', (req, res) => {
    const search = req.path;
    res.render('pagenotfound', { search })
})

app.listen(3000, () => {
    console.log('PORT 3000 OPEN');
})