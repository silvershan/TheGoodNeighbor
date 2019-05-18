const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
//for authentication
const auth = require('../../middleware/auth');
//Express validator
const {
  check,
  validationResult
} = require('express-validator/check');
//bring in model method
const Profile = require('../../models/Profile');
const User = require('../../models/User');

//route: GET api/profile/me
//description: get current user profile
//access: private

router.get('/me', auth, async (req, res) => {
  try {
    //find one user by their ID
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate(
      'user',
      ['name', 'avatar']
    );
    //if there is not a user profile
    if (!profile) {
      return res.status(400).json({
        msg: 'There is no profile for this user'
      });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//route: POST api/profile
//description: Create or update user profile
//access: Private
router.post(
  '/',
  [
    //allows for authentication
    auth,
    [
      //checks for the required fields
      check('status', 'Status is required')
      .not()
      .isEmpty(),
      check('school', 'Your school is required')
      .not()
      .isEmpty(),
      check('skills', 'Skills are required')
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

    const {
      company,
      school,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      linkedin,
      facebook,
      twitter,
      instagram,
      youtube
    } = req.body;

    //building the user's profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    //checks to see if these values exist first before setting them in the database
    if (school) profileFields.school = school;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    //Object that holds the social media links
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      //look for profile by user id
      //with a mongoose method, add await so it returns a promise
      let profile = await Profile.findOne({
        user: req.user.id
      });

      if (profile) {
        profile = await Profile.findOneAndUpdate({
          user: req.user.id
        }, {
          $set: profileFields
        }, {
          new: true
        });
        //returns user's entire profile if the profile is found
        //if profile is found, then update it
        return res.json(profile);
      }

      //if no profile is found, create a new profile
      profile = new Profile(profileFields);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//route: GET api/profile
//description: Will get all the user profiles
//access: Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//route: GET api/profile/user/:user_id
//description: Will get the user profiles by id
//access: Public
router.get('/user/:user_id', async (req, res) => {
  try {
    //find a single profile by the above URL
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'avatar']);
    //if there isn't a profile...
    if (!profile) return res.status(400).json({
      msg: 'Profile not found'
    });
    //send profile if user is found
    res.json(profile);
  } catch (err) {
    //if the user_id is longer or shorter than the id number should be
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({
        msg: 'Profile not found'
      });
    }
    //if there is another error
    res.status(500).send('Server Error');
  }
});

//route: DELETE api/profile
//description: Will delete the user, profile and user's posts
//access: Private
router.delete('/', auth, async (req, res) => {
  try {
    // Removes the user posts
    //await Post.deleteMany({ user: req.user.id });
    // Removes the profile
    await Profile.findOneAndRemove({
      user: req.user.id
    });
    // Removes the user
    await User.findOneAndRemove({
      _id: req.user.id
    });

    res.json({
      msg: 'User deleted'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//route: PUT api/profile/experience
//description: Add profile experience
//access: Private
router.put('/experience', [auth, [
  check('title', 'Title is required').not().isEmpty(),
  check('company', 'Company is required').not().isEmpty(),
  check('from', 'From date is required').not().isEmpty(),
]], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty) {
    return res.status(400).json({ errors: errors.array});
  }

  const {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  } = req.body;

  const newExp = {
    title,
    company,
    location,
    from,
    to,
    current,
    description
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//route: PUT api/profile/education
//description: Add school and other education to profile
//access: Private
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School/school is required')
        .not()
        .isEmpty(),
      check('fieldofstudy', 'Field of study is required')
        .not()
        .isEmpty(),
      check('from', 'From date is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      school,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;

    const newEdu = {
      school,
      fieldofstudy,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newEdu);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//route: DELETE api/profile/education/:edu_id
//description: Delete school or other education from profile
//access: Private
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // Get remove index
    const removeIndex = profile.education
      .map(item => item.id)
      .indexOf(req.params.edu_id);

    profile.education.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//route: GET api/profile/github/:username
//description: Get repos from Github
//access: Public
router.get('/github/:username', (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        'githubClientId'
      )}&client_secret=${config.get('githubSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' }
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);

      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: 'No Github profile found' });
      }

      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
