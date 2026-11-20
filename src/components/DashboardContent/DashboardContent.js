import React from "react";
import { normalizeMovie } from "../../movieData";

export default function DashboardContent() {
  const [data, setData] = React.useState([]);

  const [status, setStatus] = React.useState("loading");
  const [attempt, setAttempt] = React.useState(0);

  React.useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const timer = setTimeout(() => controller.abort(), 10000);
    setStatus("loading");
    const fetchData = async () => {
      try {
        const response = await fetch("https://hoblist.com/api/movieList", {
          method: "POST",
          signal: controller.signal,
          body: JSON.stringify({ category: "movies", language: "kannada", genre: "all", sort: "voting" }),
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Request failed");
        const json = await response.json();
        if (!Array.isArray(json.result)) throw new Error("Invalid response");
        if (active) {
          setData(json.result.map(normalizeMovie).filter(Boolean));
          setStatus("ready");
        }
      } catch {
        if (active) setStatus("error");
      } finally {
        clearTimeout(timer);
      }
    };
    fetchData();
    return () => { active = false; clearTimeout(timer); controller.abort(); };
  }, [attempt]);

  if (status === "loading") return <p className="container py-4" role="status">Loading movies…</p>;
  if (status === "error") return <div className="container py-4"><p role="alert">Movies could not be loaded. The provider may be unavailable.</p><button className="btn btn-primary" onClick={() => setAttempt(attempt + 1)}>Try again</button></div>;
  if (!data.length) return <p className="container py-4" role="status">No movies are available right now.</p>;

  return (
    <div className="bg-secondary">
      <div className="container">
        {data.map((movie) => (
          <article key={movie.id} className="movie-card border rounded-3 bg-white shadow-sm my-4 p-3">
            <div className="d-flex flex-column flex-md-row gap-4">
              {movie.poster ? <img className="movie-poster" src={movie.poster} alt={`${movie.title} poster`} width="190" height="285" loading="lazy" referrerPolicy="no-referrer" onError={(event) => { event.currentTarget.hidden = true; }} /> : <p className="movie-poster">Poster not available</p>}
              <div className="movie-details">
                <h2>{movie.title}</h2>
                <p><strong>Genre:</strong> {movie.genre}</p>
                <p><strong>Director:</strong> {movie.director}</p>
                <p><strong>Starring:</strong> {movie.stars}</p>
                <p><strong>Movie info:</strong> {movie.runtime} | {movie.language} | {movie.released}</p>
                <p><strong>Views:</strong> {movie.views} | <strong>Votes:</strong> {movie.votes}</p>
              </div>
            </div>
            <p className="mt-3 mb-0">Trailer unavailable from this provider.</p>
          </article>
        ))}
      </div>
    </div>
  );
}
