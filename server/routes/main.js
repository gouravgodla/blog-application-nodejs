const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');


// GET Home
router.get('', async (req, res) => {

    try {
        const locals = {
            title: "Blogs",
            description: "Simple Blog created with Nodejs, Express & MongoDd"
        }

        let perPage = 10;
        let page = req.query.page || 1;
        const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();

        const count = await Post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);
        res.render('index', {
            locals,
            data,
            Current: page,
            nextPage: hasNextPage ? nextPage : null,
            currentRoute: '/'
        });
    } catch (error) {
        console.log(error);
    }
});



// GET Post: id

router.get('/post/:id', async (req, res) => {


    try {

        let slug = req.params.id;

        const data = await Post.findById({ _id: slug });
        const locals = {
            title: data.title,
            description: "Simple Blog created with Nodejs, Express & MongoDd"
        }
        res.render('post', {
            locals,
            data,
            currentRoute: `/post/${slug}`
        });
    } catch (error) {
        console.log(error);
    }
});

//Post searchTerm
router.post('/search', async (req, res) => {
    try {
        const locals = {
            title: "Search",
            description: "Simple Blog created with Nodejs, Express & MongoDd."
        }
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "")
        const data = await Post.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
                { body: { $regex: new RegExp(searchNoSpecialChar, 'i') } }
            ]
        });


        res.render("search", {
            data,
            locals,
            currentRoute: '/search'

        });
    } catch (error) {
        console.log(error);
    }
});
























router.get('/about', (req, res) => {
    res.render('about', {
        currentRoute: '/about'
    });
});

router.get('/contact', (req, res) => {
    res.render('contact', {
        currentRoute: '/contact'
    });
});

module.exports = router;





// router.get('', async (req, res) => {
//     const locals = {
//         title: "Blogs",
//         description: "Simple Blog created with Nodejs, Express & MongoDd"
//     }
//     try {
//         const data = await Post.find();
//         res.render('index', { locals, data });
//     } catch (error) {
//         console.log(error);
//     }
// });








