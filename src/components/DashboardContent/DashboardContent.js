import React from "react";
import { BsFillCaretUpFill, BsFillCaretDownFill } from "react-icons/bs";

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
          setData(json.result);
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
        {data.map((content) => {
          let date = new Date(content.releasedDate);
          let shortDate = date.toLocaleDateString("en-US", {
            year: "numeric",
            day: "2-digit",
            month: "short",
          });

          return (
            <div key={content._id} className="py-4 ">
              <div className="border border-1 rounded-3 bg-white shadow-lg">
                <div className="d-flex flex-column flex-md-row justify-content-start ">
                  <div className="p-3 d-flex flex-md-column gap-5 gap-sm-2 justify-content-between align-items-center">
                    <div className="py-4 d-flex flex-md-column  justify-content-between align-items-center flex-fill text-center">
                      <BsFillCaretUpFill size={70} />
                      <h3>{content.totalVoted}</h3>
                      <BsFillCaretDownFill size={70} />
                    </div>
                    <div>
                      <p className="m-0 px-3 text-center">Votes</p>
                    </div>
                  </div>
                  <div className="py-3 text-center">
                    <img
                      src={content.poster}
                      alt="Movie Poster"
                      width="190px"
                      height="100%"
                    />
                  </div>
                  <div className="p-3 d-flex flex-column justify-content-between flex-fill bd-highlight">
                    <h3>{content.title} </h3>
                    <hr />
                    <div>
                      <p>
                        <strong>Genre:</strong>&nbsp;{content.genre}
                      </p>
                      <p>
                        <strong>Director:</strong>&nbsp;
                        {content.director.map((dir) => dir)}
                      </p>
                      <p>
                        <strong>Starring:</strong>&nbsp;
                        {content.stars.map((star) => star)}
                      </p>
                      <p>
                        <strong>Movie Info:</strong>&nbsp;{content.runTime}
                        &nbsp;{content.runTime || "mins"}&nbsp;|&nbsp;
                        {content.language}&nbsp;|&nbsp;
                        {shortDate}
                      </p>
                    </div>
                    <p className="m-0 text-success">
                      {content.pageViews}&nbsp;views&nbsp;|&nbsp;Voted by&nbsp;
                      {content.totalVoted}&nbsp;People
                    </p>
                  </div>
                </div>
                <div className="p-3">
                  <button className="btn btn-primary w-100">
                    Watch Trailer
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
