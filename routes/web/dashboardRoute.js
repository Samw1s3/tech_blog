const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, Comment, User } = require('../../models');
const withAuth = require('../../utils/auth');


// FIND ALL Posts WITH THEIR COMMENTS
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    const postData = await Post.findAll({
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
            'date_created'
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
    });

    // Serialize data in array so the template can read it

    const post = postData.map(post => post.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('dashboard', {
      post,
      loggedIn: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// FIND A PostAND EDIT
router.get('/edit/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.findOne({
      where: {
        id: req.params.id,
      },
      attributes: ['id', 'title', 'createdAt', 'content'],
      include: [
        {
          model: Comment,
          attributes: [
            'id',
            'body',
            'post_id',
            'user_id',
            'createdAt',
          ],
          include: {
            model: User,
            attributes: ['user_name'],
          },
        },
        {
          model: User,
          attributes: ['user_name'],
        },
      ],
    });
    if (!postData) {
      res.status(404).json({ message: 'No Post found with this id' });
      return;
    }
    // serialize
    const post = postData.get({ plain: true });
    res.render('edit-post', {
      post,
      loggedIn: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE post
router.get('/create/', withAuth, async (req, res) => {
  try {
    const postData = await Post.findAll({
      where: {
        // use the ID from the session
        user_id: req.session.user_id,
      },
      attributes: ['id', 'title', 'createdAt', 'content'],
      include: [
        {
          model: Comment,
          attributes: [
            'id',
            'body',
            'post_id',
            'user_id',
            'createdAt',
          ],
          include: {
            model: User,
            attributes: ['user_name'],
          },
        },
        {
          model: User,
          attributes: ['user_name'],
        },
      ],
    });
    const posts = postData.map(post => post.get({ plain: true }));
    res.render('create-post', {
      posts,
      loggedIn: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;