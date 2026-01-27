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
    const lines = text.split(/\r?\n/).filter(Boolean);

    // Skip header
    movies = lines.slice(1).map(line => {
      const parts = line.split(",");

      // Date = parts[0]
      // Year = second last
      // URL = last
      // Name = EVERYTHING in between
      if (parts.length < 4) return null;

      const nameParts = parts.slice(1, parts.length - 2);
      const name = nameParts.join(",").trim();

      return name || null;
    }).filter(Boolean);

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
