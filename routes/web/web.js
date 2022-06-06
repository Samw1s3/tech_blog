const router = require('express').Router();
const req = require('express/lib/request');
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
router.get('/api/users/login', (req, res) => {
    // If the user is already logged in, redirect the request to another route
    // This is the withAuth spelled out
    console.log(req.session);
    if (req.session.logged_in) {
        res.redirect('/dashboard');
        return;
    }
    res.render('login');
});

router.get('/api/users/logout', (req, res) => {
    // If the user is already logged in, redirect the request to another route
    // This is the withAuth spelled out
    console.log(req.session);
    if (req.session.logged_in) {
        req.session.destroy(() => {
        return;
        })
        
    }
    res.render('login');
});

// SIGNUP
router.get('/signup', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/');
        return;
    }
    res.render('signup');
});

router.post('/api/users/signup', async (req, res) => {
    try {
      // create new entry in user table
      const userData = await User.create({
        user_name: req.body.user_name,
        email: req.body.email,
        password: req.body.password,
      });
  
      // save user.id and set logged_in status to true
      req.session.save(() => {
        req.session.user_id = userData.id;
        req.session.logged_in = true;
        res.status(200).json(userData);
      });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
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
                Comment, 'createdAt', 'ASC',
                Post, 'createdAt', 'ASC',
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
      
        const payload = post.get({ plain: true });
        console.log(payload);

        
        // pass data to template
        res.render("post", {
            logged_in: req.session.logged_in,
            post: payload,
        });
    
});

// edit post
router.put("/api/post/:id", withAuth, (req, res) => {
    Post.update(req.body, {
      where: {
        id: req.params.id
      }
    })
      .then(affectedRows => {
        if (affectedRows > 0) {
          res.status(200).end();
        } else {
          res.status(404).end();
        }
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });

router.get('/edit-post/:id', withAuth, async (req, res) => {
    try {
        console.log(req)
        const postInfo = await Post.findByPk(req.params.id)
        console.log(postInfo);
        if (postInfo) {
            const post = postInfo.get({ plain: true})
            console.log(post)
            res.render('edit-post',{
                post: post,
            })
        } else {
            res.status(404).end()
        }
    } catch (error) {
        res.redirect('login')
    }
})

// Delete route for a post with a matching post_id
router.delete('api/post/:id', withAuth, (req, res) => {
    // Looks for the post based post/:id given in the request parameters
    Post.destroy({
      where: {
        id: req.params.id,
      },
    })    
      .catch((err) => res.json(err));
  });


// Create a new comment
router.post('/api/comment/new', withAuth,  (req,res) =>{
    console.log(req.body);
    Comment.create({
        body: req.body.body,
        user_id: req.session.user_id,
        post_id: req.params.id
        
    }).then((comment) => {
        res.json(comment)
    })
    res.redirect('/post/:id')
});

//ADD COMMENTS TO POSTS 

router.get('/comment/new',withAuth, (req, res)=> {
    res.render('post/${post_id}');
});
module.exports = router;