import React, { useState } from 'react';
import axios from 'axios';
import './App.css'
import MovieCard from './Components/MovieCard';
import {toast} from 'react-hot-toast'


const url = "http://localhost:5000"

const App = () => {
  const [movie, setMovie] = useState({
    title: '',
    director: '',
    releaseYear: '',
    poster: null
  });

  const [moviesData, setMoviesData] = useState([]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setMovie({ ...movie, [name]: value });
  };

  const handlePosterChange = (event) => {
    setMovie({ ...movie, poster: event.target.files[0] });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('title', movie.title);
    formData.append('director', movie.director);
    formData.append('releaseYear', movie.releaseYear);
    formData.append('poster', movie.poster);

    try {
      const res = await axios.post(`${url}/api/movies`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      // console.log(res.data)
      setMovie({ title: '',
      director: '',
      releaseYear: '',
      poster: null})
      toast.success("Movie Uploaded Successfully!")
    } catch (error) {
      console.error(error);
    }
  };

  const handleGetMovies = async () => {
    try {
      const res = await axios.get(`${url}/api/movies`);
      setMoviesData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
    <div className='movie-form' >
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input type="text" id="title" name="title" value={movie.title} onChange={handleInputChange} required />
        </div>
        <div>
          <label htmlFor="director">Director:</label>
          <input type="text" id="director" name="director" value={movie.director} onChange={handleInputChange} required />
        </div>
        <div>
          <label htmlFor="releaseYear">Release Year:</label>
          <input type="number" id="releaseYear" name="releaseYear" value={movie.releaseYear} onChange={handleInputChange} required />
        </div>
        <div>
          <label htmlFor="poster">Poster:</label>
          <input type="file" id="poster" name="poster" accept="image/*" onChange={handlePosterChange} required />
        </div>
        <button type="submit">Upload Movie</button>
      </form>
      <button type='button' onClick={handleGetMovies}>Get Movies</button>
    </div>
    <div className="movie-list">
        {moviesData.map((movie) => (
          <MovieCard
            key={movie._id}
            title={movie.title}
            director={movie.director}
            releaseYear={movie.releaseYear}
            poster={movie.poster}
          />
        ))}
      </div>
    </>
  );
};

export default App;

