// const router = require('express').Router();
// const sequelize = require('../config/connection');
// const { Post, Comment, User } = require('../../models');
// const withAuth = require('../utils/auth');

// // FIND ALL post AND JOIN WITH COMMENT & USER ATTRIBUTES
// router.get('/', async (req, res) => {
//   try {
//     console.log(req.session);
//     const postData = await Post.findAll({
//       attributes: ['id', 'title', 'createdAt', 'content'],
//       include: [
//         {
//           model: Comment,
//           attributes: [
//             'id',
//             'body',
//             'post_id',
//             'user_id',
//             'createdAt',
//           ],
//           include: {
//             model: User,
//             attributes: ['user_name'],
//           },
//         },
//         {
//           model: User,
//           attributes: ['user_name'],
//         },
//       ],
//     });

//     // Serialize data in array so the template can read it

//     const posts = postData.map((post) => post.get({ plain: true }));

//     // Pass serialized data and session flag into template
//     res.render('home', {
//       posts,
//       logged_In: req.session.logged_In,
//     });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// // LOGIN
// router.get('/login', (req, res) => {
//   // If the user is already logged in, redirect the request to another route
//   // This is the withAuth spelled out
//   console.log(req.session);
//   if (req.session.logged_in) {
//     res.redirect('/');
//     return;
//   }
//   res.render('login');
// });

// // SIGNUP
// router.get('/signup', (req, res) => {
//   if (req.session.logged_in) {
//     res.redirect('/');
//     return;
//   }
//   res.render('signup');
// });

// router.get('/posts/:id', async (req, res) => {
//   try {
//     const postData = await post.findOne({
//       where: {
//         id: req.params.id,
//       },
//       attributes: ['id', 'title', 'createdAt', 'content', 'user_id'],

//       include: [
//         {
//           model: Comment,
//           attributes: [
//             'id',
//             'body',
//             'post_id',
//             'user_id',
//             'createdAt',
//           ],
//           include: {
//             model: User,
//             attributes: ['user_name'],
//           },
//         },
//         {
//           model: User,
//           attributes: ['user_name'],
//         },
//       ],
//     });
//     if (!postData) {
//       res.status(404).json({ message: 'No post found with this id' });
//       return;
//     }

//     // serialize the data
//     const post = postData.get({ plain: true });

//     // pass data to template
//     res.render('single-comment', {
//       post,
//       logged_in: req.session.logged_in,
//     });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// module.exports = router;