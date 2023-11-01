// dotenv
require('dotenv').config({path:__dirname+'/.env'})

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const Blog = require('./models/blog');

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


// mongoose and mongo sandbox routes
app.get('/add-blog', (req, res) => {
    const blog = new Blog({
        title: 'new blog 2',
        snippet: 'about my new blog',
        body: 'more about my new blog'
    });

    blog.save().then((result) => {
        res.send(result)
    }).catch((err) => {
        console.log(err);
    });
});

app.get('/all-blogs', (req, res) => {
    Blog.find().then((result) => {
        res.send(result)
    }).catch((err) => console.log(err));
})


app.get('/single-blog', (req, res) => {
    Blog.findById('65428e147379d44092db85bd')
    .then((result) => {
        res.send(result)
    })
    .catch((err) => console.log(err))
})

// routes
app.get('/', (req, res) => {
    res.redirect('/blogs');
})

app.get('/about', (req, res) => {
    res.render('about', { title: name });
})


// blog routes
app.get('/blogs', (req, res) => {
    Blog.find().sort({ createdAt: -1 })
    .then((result) => {
        res.render('index', { title: name, blogs: result })
    })
    .catch((err) => console.log(err))
})

app.get('/blogs/create', (req, res) => {
    res.render('create', { title: name })
})

app.post('/blogs', (req, res) => {
    const blog = new Blog(req.body);

    blog.save().then((result) => {
        res.redirect('/blogs')
    }).catch((err) => {
        console.log(err);
    });
})

app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
        .then((result) => {
            res.render('details', { blog: result, title: 'Blog Details' })
        })
        .catch((err) => console.log(err))
})

app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;

    Blog.findByIdAndDelete(id)
    .then((result) => {
        res.json({ redirect: '/blogs' })
    })
    .catch((err) => console.log(err))
})

// 404 *MIDDLEWARE*
app.use((req, res) => {
    res.status(404).render('404', { title: name });
})