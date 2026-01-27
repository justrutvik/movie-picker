const params = new URLSearchParams(window.location.search);
const user = params.get("user");

const title = document.getElementById("title");
const movieDiv = document.getElementById("movie");
const button = document.getElementById("pickBtn");

title.innerText = `🎬 ${user}'s Watchlist`;

let movies = [];

fetch(`data/${user}.csv`)
  .then(res => {
    if (!res.ok) throw new Error("CSV not found");
    return res.text();
  })
  .then(text => {
    movies = text
      .split(/\r?\n/)
      .slice(1) // skip header
      .map(row => {
        const cols = row.split(",");
        return {
          name: cols[1]?.trim(),   // movie name
          year: cols[2]?.trim(),   // year
          url: cols[3]?.trim()     // letterboxd url
        };
      })
      .filter(m => m.name);
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

  movieDiv.innerHTML = `
    <div>${random.name} (${random.year})</div>
    <a href="${random.url}" target="_blank" style="color:#22c55e;font-size:14px;">
      View on Letterboxd
    </a>
  `;
};
