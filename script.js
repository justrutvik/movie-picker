const params = new URLSearchParams(window.location.search);
const user = params.get("user");

const title = document.getElementById("title");
const movieDiv = document.getElementById("movie");
const pickBtn = document.getElementById("pickBtn");
const watchingBtn = document.getElementById("watchingBtn");
const undoBtn = document.getElementById("undoBtn");
const movieCount = document.getElementById("movieCount");

title.innerText = `🎬 ${user}'s Watchlist`;

let allMovies = [];
let remainingMovies = [];
let currentMovie = null;
let lastWatched = null;

// ---- localStorage keys (per user, per device) ----
const STORAGE_KEY = `movie-picker-${user}`;
const WATCHED_KEY = `movie-watched-${user}`;

// ---- Load watched list ----
let watched = JSON.parse(localStorage.getItem(WATCHED_KEY)) || [];

// ---- Fetch CSV (Name-only CSV) ----
fetch(`data/${user}.csv?v=${Date.now()}`)
  .then(res => {
    if (!res.ok) throw new Error("CSV not found");
    return res.text();
  })
  .then(text => {
    allMovies = text
      .split(/\r?\n/)
      .slice(1)
      .map(line =>
        line.replace(/^"|"$/g, "").trim()
      )
      .filter(Boolean);

    // Remove watched movies
    remainingMovies = allMovies.filter(m => !watched.includes(m));
    updateMovieCount();
    
    if (!remainingMovies.length) {
      movieDiv.innerText = "🎉 All movies watched!";
    }
  })
  .catch(() => {
    movieDiv.innerText = "❌ Watchlist not found";
  });


function updateMovieCount() {
  if (!remainingMovies.length) {
    movieCount.innerText = "No movies left 🎉";
  } else {
    movieCount.innerText =
      `${remainingMovies.length} movie${remainingMovies.length !== 1 ? "s" : ""} in this watchlist`;
  }
}

// ---- Shuffle animation ----
function shuffleAnimation(finalMovie) {
  let i = 0;
  const interval = setInterval(() => {
    movieDiv.innerText =
      allMovies[Math.floor(Math.random() * allMovies.length)];
    i++;
    if (i > 15) {
      clearInterval(interval);
      movieDiv.innerText = finalMovie;
    }
  }, 80);
}

// ---- Pick movie (no-repeat) ----
pickBtn.onclick = () => {
  if (!remainingMovies.length) {
    movieDiv.innerText = "🎉 All movies watched!";
    watchedBtn.style.display = "none";
    return;
    watchingBtn.classList.remove("disabled");
    undoBtn.classList.add("disabled");

  }

  const index = Math.floor(Math.random() * remainingMovies.length);
  currentMovie = remainingMovies[index];

  shuffleAnimation(currentMovie);

  watchedBtn.style.display = "block";
};

// ---- Mark as watched ----
watchingBtn.onclick = () => {
  if (!currentMovie) return;

  lastWatched = currentMovie;

  watched.push(currentMovie);
  localStorage.setItem(WATCHED_KEY, JSON.stringify(watched));

  remainingMovies = remainingMovies.filter(m => m !== currentMovie);
  updateMovieCount();
  

  movieDiv.innerText = "Enjoy your movie 🍿";

  // Disable watching, enable undo
  watchingBtn.classList.add("disabled");
  undoBtn.classList.remove("disabled");

  currentMovie = null;
};

undoBtn.onclick = () => {
  if (!lastWatched) return;

  watched = watched.filter(m => m !== lastWatched);
  localStorage.setItem(WATCHED_KEY, JSON.stringify(watched));

  remainingMovies.push(lastWatched);
  
  currentMovie = lastWatched;
  lastWatched = null;
  updateMovieCount();

  movieDiv.innerText = `Restored: ${lastWatched}`;

  // Reset buttons
  watchingBtn.classList.remove("disabled");
  undoBtn.classList.add("disabled");

 
};

