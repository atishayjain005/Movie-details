export function safeMediaUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : null;
  } catch { return null; }
}
const text = (value, fallback = "Not available") => typeof value === "string" && value.trim() ? value.trim() : fallback;
const names = (value) => Array.isArray(value) ? value.filter(item => typeof item === "string" && item.trim()).join(", ") || "Not available" : text(value);
const count = (value) => Number.isFinite(value) && value >= 0 ? String(value) : "Not available";
export function releaseDate(value) {
  if (value === null || value === undefined || value === "") return "Not available";
  const numeric = typeof value === "number" || /^\d+$/.test(value) ? Number(value) : null;
  const date = new Date(numeric === null ? value : numeric < 1e12 ? numeric * 1000 : numeric);
  return Number.isNaN(date.getTime()) ? "Not available" : date.toLocaleDateString("en-US", {year: "numeric", month: "short", day: "2-digit", timeZone: "UTC"});
}
export function normalizeMovie(movie, index) {
  if (!movie || typeof movie !== "object" || Array.isArray(movie)) return null;
  return {
    id: `${typeof movie._id === "string" ? movie._id : "movie"}-${index}`,
    title: text(movie.title, "Untitled movie"), genre: text(movie.genre),
    director: names(movie.director), stars: names(movie.stars), language: text(movie.language),
    runtime: Number.isFinite(Number(movie.runTime)) && Number(movie.runTime) > 0 ? `${Number(movie.runTime)} mins` : "Runtime not available",
    released: releaseDate(movie.releasedDate), poster: safeMediaUrl(movie.poster),
    views: count(movie.pageViews), votes: count(movie.totalVoted),
  };
}
