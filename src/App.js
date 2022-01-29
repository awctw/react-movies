import React, { useState, useEffect, useCallback } from "react";

import AddMovie from "./components/AddMovie";
import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [moviesState, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(() => {
    setIsLoading(true);
    fetch("https://react-movie-ecb0a-default-rtdb.firebaseio.com/movies.json")
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        const transformedMovies = [];

        for (const key in responseData) {
          transformedMovies.push({
            id: key,
            title: responseData[key].title,
            openingText: responseData[key].openingText,
            releaseDate: responseData[key].releaseDate,
          });
        }

        setMovies(transformedMovies);
      })
      .catch((error) => {
        setError(error.message);
      });
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  let content = <p>Found no movies.</p>;

  if (moviesState.length > 0) {
    content = <MoviesList movies={moviesState} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  const addMovieHandler = (movie) => {
    fetch("https://react-movie-ecb0a-default-rtdb.firebaseio.com/movies.json", {
      method: "POST",
      body: JSON.stringify(movie),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      return response.json();
    });
  };

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
