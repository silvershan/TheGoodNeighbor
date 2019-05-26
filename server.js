const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const app = express();

//Connect the database
connectDB();

//Initialize middleware
app.use(express.json({ extended: false }));

//Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

//Serve static assets in production
//check for production
if (process.env.NODE_ENV === 'production') {
  //set the static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    //cleaner way to load the page
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
