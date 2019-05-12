const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    //references user's model
    //connects a user to a post
    //will show what user created the post
    //allows only for that user to delete their own posts
    ref: 'users'
  },
  //actual post content
  text: {
    type: String,
    required: true
  },
  //shows the name of the user who created the post
  name: {
    type: String
  },
  //shows the user's connected picture
  avatar: {
    type: String
  },
  //Allows for a user to like a post
  likes: [
    {
      //user that is liking
      //links like to user
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      }
    }
  ],
  //Allows for a user to add a comment to a post
  comments: [
    {
      //user that is commenting
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      //body of comment
      text: {
        type: String,
        required: true
      },
      //user name
      name: {
        type: String
      },
      //user image
      avatar: {
        type: String
      },
      //date of comment
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  //date of post
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Post = mongoose.model('post', PostSchema);
