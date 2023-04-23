require('dotenv').config()
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const express = require('express');
const Movie = require('./Models/Movie')
const multer = require('multer');
const cors = require('cors')
const AWS = require('aws-sdk');
const fs = require('fs');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

mongoose.connect('mongodb+srv://m001-student:m001-mongodb-basics@sandbox.uzifnvb.mongodb.net/test', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));


cloudinary.config({
  cloud_name: 'dec6gy3wy',
  api_key: '355514238263871',
  api_secret: 'fkxhW0wjFM1XciQrJGl6kZk-Qn0'
});


const app = express();
const port = 5000;

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cors())


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
});
const upload = multer({ storage });



app.post('/api/movies', upload.single('poster'), async (req, res) => {
  try {
    const fileContent = fs.readFileSync(req.file.path);

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `${Date.now()}-${req.file.originalname}`,
      Body: fileContent,
      ContentType: req.file.mimetype,
      ACL: 'public-read',
    };

    const s3Data = await s3.upload(params).promise();

    const movie = new Movie({
      title: req.body.title,
      director: req.body.director,
      releaseYear: req.body.releaseYear,
      poster: s3Data.Location,
    });

    await movie.save(); 

    res.send(movie);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong');
  }
});

app.get('/api/movies', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.send(movies);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong');
  }
});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
});
