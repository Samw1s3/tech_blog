const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth');

// GET ALL USERS POSTS AND COMMENTS
router.get('/', async (req, res) => {
  try {
    console.log('===+++=====');
    const postData = await Post.findAll({
      attributes: ['id', 'title', 'createdAt','body'],
      order: [['createdAt', 'DESC']],
      // The comment model will attach a user_name to comment
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
            attributes: ['user_name'],
          },
        },
        {
          model: User,
          attributes: ['user_name'],
        },
      ],
    });
    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET A USER POST AND COMMENT
router.get('/:id', async (req, res) => {
  try {
    console.log('===xoxoxox=====');
    const postData = await Post.findOne({
      where: {
        id: req.params.id,
      },
      attributes: ['id', 'title', 'body', 'createdAt'],
      include: [
        {
          model: User,
          attributes: ['user_name'],
        },
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
            attributes: ['user_name'],
          },
        },
      ],
    });
    res.status(200).json(PostData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE THE Post
router.post('/', withAuth, async (req, res) => {
  try {
    const newPost = await Post.create( {
      title: req.body.title,
      body: req.body.body,
      user_id: req.session.user_id
    });

    res.status(200).json(newPost);
  } catch (err) {
    res.status(400).json(err);
  }
});

// UPDATE THE Post
router.put('/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.update(
      req.body,
      {
        title: req.body.title,
        body: req.body.body,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    if (!postData) {
      res.status(404).json({ message: 'No post found with this id' });
    }
    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE THE Post
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!postData) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }

    res.status(200).json(PostData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;