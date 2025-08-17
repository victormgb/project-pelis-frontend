interface Genre {
    name: string
}

interface ProductionCompany {
    id: number,
    logo_path: string,
    name: string,
    origin_country: string;
}

interface ProductionCountry {
    iso_3166_1: string;
    name: string
}

interface SpokenLanguage {
    english_name: string;
    iso_639_1: string;
    name: string
}

export interface Movie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  runtime?: string;
  genres: Genre[];
  status: string;
  budget: string;
  revenue: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
  tagline: string;
}

export interface UpcomingMoviesResponse {
  dates?: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: Movie[];
}

// {
//     "id": 755898,
//     "results": [
//         {
//             "iso_639_1": "en",
//             "iso_3166_1": "US",
//             "name": "Official Trailer",
//             "key": "d9erkpdh5o0",
//             "site": "YouTube",
//             "size": 1080,
//             "type": "Trailer",
//             "official": true,
//             "published_at": "2025-07-24T18:40:00.000Z",
//             "id": "6882cabfdaa869ed6516b8a5"
//         }
//     ]
// }


interface Video {
    iso_639_1: string;
    iso_3166_1: string;
    name: string;
    key: string;
    site: string;
    size: number;
    type: string;
    official: Boolean;
    published_at: string;
    id: string
}

export interface MovieVideoResponse {
    id: string;
    results: Video[]
}

