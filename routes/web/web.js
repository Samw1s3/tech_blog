const router = require('express').Router();
const withAuth = require('../../utils/auth');
const { User, Post, Comment} = require('./../../models')



// GET all posts for homepage
router.get('/', async (req, res) => {
    try {
        const postData = await Post.findAll({
            include:[User],
        });

        const posts = postData.map((post) =>
            post.get({ plain: true })    
        );

        res.render('home', {
            posts,
            loggedin: req.session.loggedin,
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
    if (req.session.loggedIn) {
      res.redirect('/');
      return;
    }
    res.render('login');
  });
  
  // SIGNUP
  router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
      res.redirect('/');
      return;
    }
    res.render('signup');
  });
  
  router.get('/dashboard', withAuth, async (req,res) => {

    const posts = (await Post.findAll());

    console.log(posts);

    res.render('dashboard', {
        logged_in: req.session.logged_in,
        posts
    })

  });

  router.get('/create-post', withAuth, async (req,res) => {

      
    res.render('create-post', {
        logged_in: req.session.logged_in,
        
    })

  });
  router.get('/Post/:id', async (req, res) => {
    try {
      const postData = await Post.findOne({
        where: {
          id: req.params.id,
        },
        attributes: ['id', 'title', 'createdAt', 'body', 'user_id'],
  
        include: [
          {
            model: Comment,
            attributes: [
              'id',
              'body',
              'post_id',
              'user_id',
              'date_created',
            ],
            include: {
              model: User,
              attributes: ['user_name', 'email'],
            },
          },
          {
            model: User,
            attributes: ['user_name'],
          },
        ],
      });
      if (!postData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
  
      // serialize the data
      const post = postData.get({ plain: true });
  
      // pass data to template
      res.render('single-comment', {
        post,
        logged_in: req.session.logged_in,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });
module.exports = router;