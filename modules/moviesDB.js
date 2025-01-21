const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("dotenv").config(); 

// Define the schema for a movie
const movieSchema = new Schema({
  plot: String,
  genres: [String],
  runtime: Number,
  cast: [String],
  num_mflix_comments: Number,
  poster: String,
  title: String,
  fullplot: String,
  languages: [String],
  released: Date,
  directors: [String],
  rated: String,
  awards: {
    wins: Number,
    nominations: Number,
    text: String
  },
  lastupdated: Date,
  year: Number,
  imdb: {
    rating: Number,
    votes: Number,
    id: Number
  },
  countries: [String],
  type: String,
  tomatoes: {
    viewer: {
      rating: Number,
      numReviews: Number,
      meter: Number
    },
    dvd: Date,
    lastUpdated: Date
  }
});

// Define the MoviesDB class
module.exports = class MoviesDB {
  constructor() {
    // The Movie model is not available until initialize() completes
    this.Movie = null;
  }

  // Initialize the database connection and the Movie model
  initialize(connectionString) {
    return new Promise((resolve, reject) => {
      const db = mongoose.createConnection(process.env.MONGODB_CONN_STRING);
      

      db.once('error', (err) => {
        reject(err);
      });

      db.once('open', () => {
        // Once connected, define the Movie model
        this.Movie = db.model("movies", movieSchema);
        resolve();
      });
    });
  }

  // Add a new movie to the collection
  async addNewMovie(data) {
    const newMovie = new this.Movie(data);
    await newMovie.save();
    return newMovie;
  }

  // Retrieve all movies for a specific page, with optional title filtering
  getAllMovies(page, perPage, title) {
    let findBy = title ? { title } : {};

    // Ensure that `page` and `perPage` are valid numbers
    if (+page && +perPage) {
      return this.Movie.find(findBy)
        .sort({ year: 1 })
        .skip((page - 1) * +perPage)
        .limit(+perPage)
        .exec();
    }

    return Promise.reject(new Error('page and perPage query parameters must be valid numbers'));
  }

  // Retrieve a single movie by its ID
  getMovieById(id) {
    return this.Movie.findOne({ _id: id }).exec();
  }

  // Update an existing movie by its ID
  updateMovieById(data, id) {
    return this.Movie.updateOne({ _id: id }, { $set: data }).exec();
  }

  // Delete a movie by its ID
  deleteMovieById(id) {
    return this.Movie.deleteOne({ _id: id }).exec();
  }
};
