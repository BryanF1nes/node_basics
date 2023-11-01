// dotenv
require('dotenv').config({path:__dirname+'/.env'})

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const blogRoutes = require('./routes/blogRoutes');

// express app
const app = express();
const PORT = 3000;

// mongo connection
mongoose.set("strictQuery", false)
const mongoDB = process.env.URL;

main().catch((err) => console.log(err))
async function main() {
    await mongoose.connect(mongoDB);
    await console.log('Database connected...')
}

// Variables
const name = "Bryans Blog"

// register view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// listen for requests
app.listen(PORT) // 3000;

// middleware & static files
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(morgan('dev'));

// routes
app.get('/', (req, res) => {
    res.redirect('/blogs');
})

app.get('/about', (req, res) => {
    res.render('about', { title: name });
})

// blog routes
app.use('/blogs', blogRoutes)

// 404 *MIDDLEWARE*
app.use((req, res) => {
    res.status(404).render('404', { title: name });
})