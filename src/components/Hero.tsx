import { useEffect, useState } from "react";
import { Bookmark, Play } from "lucide-react";
import HeroBg from "../assets/herobg2.jpg";
import { Link } from "react-router";

import type { Movie, UpcomingMoviesResponse } from "../types";

// export interface Movie {
//   adult: boolean;
//   backdrop_path: string;
//   genre_ids: number[];
//   id: number;
//   original_language: string;
//   original_title: string;
//   overview: string;
//   popularity: number;
//   poster_path: string;
//   release_date: string;
//   title: string;
//   video: boolean;
//   vote_average: number;
//   vote_count: number;
// }

// // Define the type for the complete API response.
// interface UpcomingMoviesResponse {
//   dates: {
//     maximum: string;
//     minimum: string;
//   };
//   page: number;
//   results: Movie[]; // The results array contains an array of Movie objects.
// }


const Hero = () => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  };

  useEffect(() => {
    fetch(
      "https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1",
      options
    )
      .then((res) => res.json())
      .then((res: UpcomingMoviesResponse) => { // Cast the response to the new type
        if (res.results && res.results.length > 0) {
          const randomIndex = Math.floor(Math.random() * res.results.length);
          setMovie(res.results[randomIndex]);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  if (!movie) {
    return <p>Loading...</p>;
  }
  return (
    <div className="text-white relative h-[480px] lg:h-[80vh]">
      <img
        src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
        alt="bg-img"
        className="w-full h-full object-center object-cover rounded-2xl"
      />

      <div className="flex space-x-2 md:space-x-4 absolute bottom-3 left-4 md:bottom-8 md:left-10 font-medium">
        {/* <button className="flex justify-center items-center bg-white  hover:bg-gray-200 text-[#e50914] py-3 px-4 rounded-full cursor-pointer text-sm md:text-base">
          <Bookmark className="mr-2 w-4 h-5 md:w-5 md:h-5" /> Save for Later
        </button> */}
        <div className="relative z-10 flex items-end p-8 gap-8">
          {/* <img
            src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
            className="rounded-lg shadow-lg w-48 hidden md:block"
          /> */}

          <div>
            <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
            <div className="flex items-center gap-4 mb-2">
              <span>⭐ {movie.vote_average?.toFixed(1)}</span>
              <span>{movie.release_date}</span>
              {/* <span>{movie.runtime} min</span> */}
            </div>
            {/* <div className="flex flex-wrap gap-2 mb-4">
              {movie.genres.map((genre) => (
                <span className="bg-gray-800 px-3 py-1 rounded-full text-sm">
                  {genre.name}
                </span>
              ))}
            </div> */}
            <p className="max-w-2xl text-gray-200">{movie.overview}</p>
            <Link to={`/movie/${movie.id}`}>
              <button className="flex justify-center items-center bg-[#e50914]  text-white py-3 px-4 rounded-full cursor-pointer text-sm md:text-base mt-2 md:mt-4">
                <Play className="mr-2 w-4 h-5 md:w-5 md:h-5" /> Watch Now
              </button>
            </Link>
          </div>
        </div>
        {/* <Link to={`/movie/${movie.id}`}>
          <button className="flex justify-center items-center bg-[#e50914]  text-white py-3 px-4 rounded-full cursor-pointer text-sm md:text-base">
            <Play className="mr-2 w-4 h-5 md:w-5 md:h-5" /> Watch Now
          </button>
        </Link> */}
      </div>
    </div>
  );
};

export default Hero;
