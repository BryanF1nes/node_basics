const express = require('express');
const Blog = require('../models/blog');

const router = express.Router();
const name = "Bryans Blog"

router.get('/', (req, res) => {
    Blog.find().sort({ createdAt: -1 })
    .then((result) => {
        res.render('index', { title: name, blogs: result })
    })
    .catch((err) => console.log(err))
})

router.get('/create', (req, res) => {
    res.render('create', { title: name })
})

router.post('/', (req, res) => {
    const blog = new Blog(req.body);

    blog.save().then((result) => {
        res.redirect('/')
    }).catch((err) => {
        console.log(err);
    });
})

router.get('/:id', (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
        .then((result) => {
            res.render('details', { blog: result, title: 'Blog Details' })
        })
        .catch((err) => console.log(err))
})

router.delete('/:id', (req, res) => {
    const id = req.params.id;

    Blog.findByIdAndDelete(id)
    .then((result) => {
        res.json({ redirect: '/blogs' })
    })
    .catch((err) => console.log(err))
})

module.exports = router;