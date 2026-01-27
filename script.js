const params = new URLSearchParams(window.location.search);
const user = params.get("user");

const title = document.getElementById("title");
const movieDiv = document.getElementById("movie");
const button = document.getElementById("pickBtn");

title.innerText = `🎬 ${user}'s Watchlist`;

let movies = [];

fetch(`data/${user}.csv?v=${Date.now()}`)
  .then(res => {
    if (!res.ok) throw new Error("CSV not found");
    return res.text();
  })
  .then(text => {
    movies = text
      .split(/\r?\n/)
      .slice(1)          // skip header
      .map(line => line.trim())
      .filter(Boolean);

    if (!movies.length) {
      movieDiv.innerText = "❌ No movies found";
    }
  })
  .catch(() => {
    movieDiv.innerText = "❌ Watchlist not found";
  });

button.onclick = () => {
  if (!movies.length) {
    movieDiv.innerText = "Loading movies...";
    return;
  }
  const random = movies[Math.floor(Math.random() * movies.length)];
  movieDiv.innerText = random;
};
