const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, Comment, User } = require('../../models');
const withAuth = require('../utils/auth');

// FIND ALL post AND JOIN WITH COMMENT & USER ATTRIBUTES
router.get('/', async (req, res) => {
  try {
    console.log(req.session);
    const postData = await postData.findAll({
      attributes: ['id', 'title', 'postedAt', 'content'],
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
            attributes: ['username'],
          },
        },
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

    // Serialize data in array so the template can read it

    const posts = postData.map((post) => post.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('home', {
      posts,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
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

router.get('/posts/:id', async (req, res) => {
  try {
    const postData = await post.findOne({
      where: {
        id: req.params.id,
      },
      attributes: ['id', 'title', 'postedAt', 'content', 'user_id'],

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
            attributes: ['username'],
          },
        },
        {
          model: User,
          attributes: ['username'],
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
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;