const params = new URLSearchParams(window.location.search);
const user = params.get("user");

const title = document.getElementById("title");
const movieDiv = document.getElementById("movie");
const button = document.getElementById("pickBtn");

title.innerText = `🎬 ${user}'s Watchlist`;

let movies = [];

// Simple CSV line parser that respects quotes
function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result.map(v => v.replace(/^"|"$/g, "").trim());
}

// Fetch CSV
fetch(`data/${user}.csv?v=${Date.now()}`)
  .then(res => {
    if (!res.ok) throw new Error("CSV not found");
    return res.text();
  })
  .then(text => {
    const lines = text.split(/\r?\n/).filter(Boolean);

    // Parse headers safely
    const headers = parseCSVLine(lines[0]);
    const nameIndex = headers.indexOf("Name");

    movies = lines
      .slice(1)
      .map(line => parseCSVLine(line)[nameIndex])
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
