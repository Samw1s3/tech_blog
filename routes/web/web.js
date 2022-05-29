const router = require('express').Router();
const withAuth = require('../../utils/auth');
const { User, Post, Comment } = require('./../../models')

// GET all posts for homepage
router.get('/', async (req, res) => {
    try {
        const postData = await Post.findAll({
            include: [User],
        });

        const posts = postData.map((post) =>
            post.get({ plain: true })
        );

        res.render('home', {
            posts,
            logged_in: req.session.logged_in,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// LOGIN
router.get('/login', (req, res) => {
    // If the user is already logged in, redirect the request to another route
    // This is the withAuth spelled out
    console.log(req.session);
    if (req.session.logged_in) {
        res.redirect('/');
        return;
    }
    res.render('login');
});

// SIGNUP
router.get('/signup', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/');
        return;
    }
    res.render('/signup');
});

router.get('/dashboard', withAuth, async (req, res) => {

    const models = (await Post.findAll({
        
        where: {
            // use the ID from the session
            user_id: req.session.user_id,
          },
          attributes: ['id', 'title', 'content', 'createdAt'],
          include: [
            {
              model: Comment,
              attributes: [
                'id',
                'body',
                'post_id',
                'user_id',
                'createdAt'
              ],
              order: [
                Comment, 'createdAt', 'ASC'
            ],
              include: {
                model: User,
                attributes: ['user_name']
              }
            },
            {
              model: User,
              attributes: ['user_name']
            },
          ],
    }))

    const posts = models.map((post) => post.get({ plain: true }));

    console.log(posts);
    res.render('dashboard', {
        logged_in: req.session.logged_in,
        posts,

    })

});

// post the data from new post
router.post('/posts', async (req,res) =>{
    
    await Post.create({
        title: req.body.title,
        content: req.body.content,
        user_id: req.session.user_id
    })
    res.redirect('/dashboard')
})

// Create a new post form
router.get('/posts/new', withAuth, async (req, res) => {


    res.render('newpost', {
        logged_in: req.session.logged_in,

    })

});
router.get('/post/:id', async (req, res) => {

        const post = await Post.findByPk(req.params.id,{
            include: [
                {
                    model: Comment,
                    order: [
                        Comment, 'createdAt', 'ASC'
                    ],
                    include: {
                        model:User,
                    }
                },
                {
                    model: User,
                 },
            ],
        });
      
        const payload = post.get({ plain: true });
        console.log(payload);

        
        // pass data to template
        res.render("post", {
            logged_in: req.session.logged_in,
            post: payload,
        });
    
});

//ADD COMMENTS TO POSTS 


router.post('/posts', async (req,res) =>{
    
    await Comment.create({
        body: req.body.body,
        user_id: req.session.user_id,
        post_id: req.body.post_id,
    })
    res.redirect('/post/:id')
})

// Create a new comment
router.get('/comments/new', withAuth, async (req, res) => {


    res.render("newcomment", {
        logged_in: req.session.logged_in,

    })

});





module.exports = router;