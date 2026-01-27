const params = new URLSearchParams(window.location.search);
const user = params.get("user");

const title = document.getElementById("title");
const movieDiv = document.getElementById("movie");
const button = document.getElementById("pickBtn");

title.innerText = `🎬 ${user}'s Watchlist`;

let movies = [];

// Fetch CSV (cache-busted)
fetch(`data/${user}.csv?v=${Date.now()}`)
  .then(res => {
    if (!res.ok) throw new Error("CSV not found");
    return res.text();
  })
  .then(text => {
    const lines = text.split(/\r?\n/).filter(Boolean);

    // Read header row
    const headers = lines[0].split(",");
    const nameIndex = headers.indexOf("Name");

    movies = lines.slice(1)
      .map(line => line.split(",")[nameIndex])
      .filter(Boolean);

    if (!movies.length) {
      movieDiv.innerText = "❌ No movies found";
    }
  })
  .catch(err => {
    movieDiv.innerText = "❌ Watchlist not found";
    console.error(err);
  });

button.onclick = () => {
  if (!movies.length) {
    movieDiv.innerText = "Loading movies...";
    return;
  }

  const random = movies[Math.floor(Math.random() * movies.length)];
  movieDiv.innerText = random;
};
