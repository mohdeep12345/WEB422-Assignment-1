/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: ___Mohdeep Singh___________________ Student ID: __109600239____________ Date: ___20 Jan 2025_____________
*  Vercel Link: _______________________________________________________________
*
********************************************************************************/ 





require('dotenv').config();
const express = require('express');
const cors = require('cors');
const MoviesDB = require('./modules/moviesDB.js');

const app = express();
const db = new MoviesDB();
const HTTP_PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Database and Start Server
db.initialize("mongodb+srv://rokingmohdeep:passwordmohdeep@cluster1.arjbd.mongodb.net/sample_mflix?retryWrites=true&w=majority")
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`Server listening on: ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });



// Routes
app.get('/', (req, res) => {
  res.json({ message: 'API Listening' });
});

// POST /api/movies
app.post('/api/movies', (req, res) => {
  db.addNewMovie(req.body)
    .then((movie) => res.status(201).json(movie))
    .catch((err) => res.status(500).json({ error: err.message }));
});

// GET /api/movies
app.get('/api/movies', (req, res) => {
  const { page, perPage, title } = req.query;
  db.getAllMovies(Number(page), Number(perPage), title)
    .then((movies) => res.json(movies))
    .catch((err) => res.status(500).json({ error: err.message }));
});

// GET /api/movies/:id
app.get('/api/movies/:id', (req, res) => {
  db.getMovieById(req.params.id)
    .then((movie) => res.json(movie))
    .catch((err) => res.status(500).json({ error: err.message }));
});

// PUT /api/movies/:id
app.put('/api/movies/:id', (req, res) => {
  db.updateMovieById(req.body, req.params.id)
    .then(() => res.status(204).end())
    .catch((err) => res.status(500).json({ error: err.message }));
});

// DELETE /api/movies/:id
app.delete('/api/movies/:id', (req, res) => {
  db.deleteMovieById(req.params.id)
    .then(() => res.status(204).end())
    .catch((err) => res.status(500).json({ error: err.message }));
});
