const express = require('express');
const router = express.Router();
const {
  check,
  validationResult
} = require('express-validator/check');
const auth = require('../../middleware/auth');
//All required models
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

//route: GET api/posts
//description:
//acces: private
router.post(
  '/',
  [
    auth,
    [
      //requires that a post has content
      check('text', 'Text is required')
      .not()
      .isEmpty()
    ]
  ],
  async (req, res) => {
    //sends an error if no content is entered
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    try {
      //finds the user
      //'-password' makes sure that everything but the password is sent back...keeps it private
      const user = await User.findById(req.user.id).select('-password');
      //sets up a variable for the new post with all the user info
      //pulling the user info from the database
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });
      //creates a variable for the new post object
      const post = await newPost.save();
      //returns the new post
      res.json(post);
      //runs error if anything is wrong
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//route: GET api/posts
//description: Get all the posts
//acces: private
router.get('/', auth, async (req, res) => {
  try {
    //creates post variable
    //finds posts and sorts by date, newest first
    const posts = await Post.find().sort({
      date: -1
    });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//route: GET api/posts/:id
//description: Get all the posts by their ID
//acces: private
router.get('/:id', auth, async (req, res) => {
  try {
    //gets the ID from the URL (req.params.id)
    const post = await Post.findById(req.params.id);
    //if there isn't a post of that ID
    if (!post) {
      return res.status(404).json({
        msg: 'Post not found'
      });
    }
    //if post exists then display
    res.json(post);
  } catch (err) {
    console.error(err.message);
    //if the ID is not a valid ID
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        msg: 'Post not found'
      });
    }
    res.status(500).send('Server Error');
  }
});

//route: DELETE api/posts/:id
//description: Delete all the posts by their ID
//acces: private
router.delete('/:id', auth, async (req, res) => {
  try {
    //gets the ID from the URL (req.params.id)
    const post = await Post.findById(req.params.id);
    //if there isn't a post of that ID
    if (!post) {
      return res.status(404).json({
        msg: 'Post not found'
      });
    }

    //Check to make sure that user deleting the post is the one who created it
    //req.user.id is the logged in user
    if (post.user.toString() !== req.user.id) {
      //if the user didn't create this post
      return res.status(401).json({
        msg: 'User not authorized'
      });
    }
    //remove post if the user is the owner
    await post.remove();
    res.json({
      msg: 'Post removed'
    });
  } catch (err) {
    console.error(err.message);
    //if the ID is not a valid ID
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        msg: 'Post not found'
      });
    }
    res.status(500).send('Server Error');
  }
});

//route: PUT api/posts/like/:id
//description: Like a post by ID
//acces: private
router.put('/like/:id', auth, async (req, res) => {
  try {
    //finds the post by the ID from the URL
    const post = await Post.findById(req.params.id);
    //Check if the post has already been liked by the logged in user
    if (
      //filter = a high order array method
      //if length is greather than 0, then the post has already been like by the logged in user
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      return res.status(400).json({
        msg: 'Post already liked'
      });
    }
    //unshift: puts the like to the beginning
    post.likes.unshift({
      user: req.user.id
    });
    //saves the like to the database
    await post.save();
    //returns likes
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//route: PUT api/posts/unlike/:id
//description: Unlike a post by ID
//acces: private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    //check if the post has already been liked by that users
    //each user can only like a post once
    if (
      //if length is equal to 0, then the post hasn't been like yet
      post.likes.filter(like => like.user.toString() === req.user.id).length ===
      0
    ) {
      return res.status(400).json({
        msg: 'Post has not yet been liked'
      });
    }
    //will get the correct like to remove
    const removeIndex = post.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);
    //splice the like out of the array
    post.likes.splice(removeIndex, 1);
    //saves the like to the database
    await post.save();
    //sends back likes
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//route: POST api/posts/comment/:id
//description: Comment/respond to another user's post by ID
//acces: private
router.post(
  '/comment/:id',
  [
    //use authenticaiton because it's private
    auth,
    [
      //checks to make sure a comment is entered
      check('text', 'Text is required')
      .not()
      .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);
      //new comment object
      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };
      //adds this new comment to the post, newest first
      post.comments.unshift(newComment);
      //saves comments to database
      await post.save();
      //sends back all the comments
      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//route: Delete api/posts/comment/:id/:comment_id
//description: Delete/update your comment
//acces: private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    //gets the post by ID
    const post = await Post.findById(req.params.id);
    //Finds the comment that is being updated/deleted
    //checks to see if the requested comment is equal to the comment being deleted
    const comment = post.comments.find(
      comment => comment.id === req.params.comment_id
    );
    //Checks to make sure the comment exists
    if (!comment) {
      return res.status(404).json({
        msg: 'Comment does not exist'
      });
    }
    //Checks to make sure that the user updating/deleting the post is authorized
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({
        msg: 'User not authorized'
      });
    }
    //Removes the comment if the requested commen
    const removeIndex = post.comments
      .map(comment => comment.id)
      .indexOf(req.params.comment_id);

    post.comments.splice(removeIndex, 1);

    await post.save();
    //returns all the comments
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
