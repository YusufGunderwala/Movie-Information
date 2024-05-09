document.addEventListener("DOMContentLoaded", () => {
  let resultBox = document.querySelector(".container .result-box");
  let inputValue = document.querySelector(".container .search-box input");
  let searchBtn = document.querySelector(".container .search-box button");

  let tmdbApiKey = "f888e07a33315d628beb281b403f4f53";

  // Event listener for search button click
  searchBtn.addEventListener("click", () => {
    if (inputValue.value !== "") {
      getMovie();
    }
  });

  // Function to get movie details
  let getMovie = async () => {
    let movieName = inputValue.value;
    let tmdbUrl = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&query=${movieName}`;

    try {
      let tmdbResponse = await fetch(tmdbUrl);
      let tmdbData = await tmdbResponse.json();

      if (tmdbData.results.length > 0) {
        let movie = tmdbData.results[0];

        let detailsUrl = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${tmdbApiKey}`;
        let creditsUrl = `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${tmdbApiKey}`;

        let [detailsResponse, creditsResponse] = await Promise.all([
          fetch(detailsUrl),
          fetch(creditsUrl),
        ]);

        let [detailsData, creditsData] = await Promise.all([
          detailsResponse.json(),
          creditsResponse.json(),
        ]);

        const duration = convertMinutesToHours(detailsData.runtime);

        resultBox.innerHTML = `<div class="card">
                                    <img src="https://image.tmdb.org/t/p/w500${
                                      movie.poster_path
                                    }" alt="${
          movie.title
        }" class="card-img-top">
                                    <div class="card-body">
                                      <h3 class="card-title">${movie.title}</h3>
                                      <div class="rating">
                                          <i class="fa-solid fa-star"></i>    
                                          <h2>${movie.vote_average}</h2> 
                                      </div>
                                      <div class="details">
                                          <span>Release Date: ${
                                            detailsData.release_date
                                          }</span>
                                          <span>|</span>
                                          <span>Duration: ${duration}</span>
                                      </div>
                                      <div class="genre">
                                          <h2>Genre</h2>
                                          <span>${detailsData.genres
                                            .map((genre) => genre.name)
                                            .join(" , ")}</span>
                                      </div>
                                      <div class="plot">
                                          <h2>Plot</h2>
                                          <span>${detailsData.overview}</span>
                                      </div>
                                      <div class="cast">
                                          <h2>Cast</h2>
                                        
                                          <span>${creditsData.cast
                                            .map(
                                              (actor) =>
                                                `<span><a href="https://www.google.com/search?q=${actor.name}&tbm=isch" target="_blank">${actor.name}</a></span>`
                                            )
                                            .join(" , ")}</span>
                                      </div>
                                    </div>
                                  </div>`;
      } else {
        resultBox.innerHTML = `<div class="alert alert-warning" role="alert">
                                                  Movie not found
                                                </div>`;
      }
    } catch (error) {
      console.error(error);
      resultBox.innerHTML = `<div class="alert alert-danger" role="alert">
                                                Error Occurred! Please try again.
                                              </div>`;
    }
  };

  // Function to convert minutes to hours, minutes, and seconds
  function convertMinutesToHours(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  }
});
