const express= require("express")
require("dotenv").config()
const app = express()
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
const {initializeDatabase} = require("./db/db.connect")
const Movie = require("./models/movie.models")

app.use(express.json())

initializeDatabase() // this means calling the database..


async function createMovie(newMovie){
    try {
        const movie = new Movie(newMovie)
        const saveMovie = await movie.save()
        return saveMovie
    } catch (error) {
        throw error
    }
}

// write API for POST. POST means create a new movie's database...Ans above newMovie object send to database through postman.And then save it in the database.

app.post("/movies", async (req, res) => {
    try {
        const savedMovie = await createMovie(req.body)
        res.status(201).json({message: "Movie added successfully.", movie: savedMovie})
    } catch (error) {
        res.status(500).json({error: "Failed to add movie."})
    }
})

// find a movie with a particular title

async function readMovieByTitle(movieTitle){
    try {
        const movie = await Movie.findOne({title: movieTitle})
        console.log(movie)
        return movie
    } catch(error){
        throw error
    }
}

// this is called rouths 

app.get("/movies/:title", async (req, res) => {
    try {
        const movie = await readMovieByTitle(req.params.title)
        if(movie){
            res.json(movie)
        } else {
            res.status(404).json({error: "Movie not found."})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to fetch movie."})
    }
})

// to get all the movie in the database..

async function readAllMovies(){
    try{
        const allMovies = await Movie.find()
        return allMovies
    } catch(error){
        throw error
    }
}

app.get("/movies", async (req, res) => {
    try {
        const movies = await readAllMovies()
        if(movies.length != 0){
            res.json(movies)
        } else {
            res.status(404).json({error: "No movies found."})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to fetch movies."})
    }
})

// get movie by director name..

async function readMovieByDirector(directorName){
    try{
        const movieByDirector = await Movie.find({director: directorName})
        return movieByDirector
    } catch(error){
        throw error
    }
}

app.get("/movies/director/:directorName", async (req, res) => {
    try {
        const movies = await readMovieByDirector(req.params.directorName)
        if(movies.length != 0){
            res.json(movies)
        } else {
            res.status(404).json({error: "No movie found."})
        }
    } catch(error) {
        res.status(500).json({error: "Failed to fetch movies."})
    }
})


// read movies by genre: 

async function readMovieByGenre(genreName){
    try {
        const movieByGenre = await Movie.find({genre: genreName})
        return movieByGenre 
    } catch(error) {
        throw error
    }
}


app.get("/movies/genre/:genreName", async (req, res) => {
    try {
        const movies = await readMovieByGenre(req.params.genreName)
        if(movies.length != 0){
            res.json(movies)
        } else {
            res.status(404).json({error: "No movie found."})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to fetch movies."})
    }
})

// create API route to deleted movie: 

async function deletedMovies(movieId){
    try {
        const deletedMovie = await Movie.findOneAndDelete(movieId)
        return deletedMovie
    } catch (error){
        throw error
    }
}


app.delete("/movies/:movieId", async (req, res) => {
    try {
        const deletedMovie = await deletedMovies(req.params.movieId)
        if(deletedMovie){
            res.status(200).json({message: "Movie deleted successfully."})
        }
    } catch (error){
        res.status(500).json({error: "Failed to deleted movie."})
    }
})


async function updateMovie(movieId, dataToUpdate){
    try {
        const updatedMovie = await Movie.findByIdAndUpdate(movieId, dataToUpdate, {new: true}) // this pass from the postman...
        return updatedMovie
    } catch (error){
        throw error
    }
}

// Update document in the database through postman :

app.post("/movies/:movieId", async (req, res) => {
    try {
        const updatedMovie = await updateMovie(req.params.movieId, req.body)
        if(updatedMovie){
            res.status(200).json({message: "Movie updated successfully.", movie: updatedMovie})
        } else {
            res.status(404).json({error: "Movie not found."})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to update movie."})
    }
})

// this is express environment required to connect with your database.

const PORT = 3000
app.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`)
})