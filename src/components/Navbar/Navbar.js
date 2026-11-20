import React from "react";
import { Link } from "react-router-dom";

const showDetails = (
  <div
    id="company-details"
    className="company-details d-flex flex-column text-light position-absolute bg-white text-dark shadow-lg me-1 p-3 my-2 rounded-3 "
    style={{ zIndex: 1, right: "1rem" }}
  >
    <p className="m-0">
      <strong>Company :</strong>&nbsp;Geeksynergy Technologies Pvt Ltd
    </p>
    <hr />
    <p className="m-0">
      <strong>Address :</strong>&nbsp;Sanjayanagar, Bengaluru-56
    </p>
    <hr />
    <p className="m-0">
      <strong>Phone no. :</strong>&nbsp;XXXXXXXXX09
    </p>
    <hr />
    <p className="m-0">
      <strong>Email :</strong>&nbsp;XXXXXX@gmail.com
    </p>
  </div>
);

export default function Navbar() {
  const [state, setState] = React.useState(false);

  return (
    <nav aria-label="Main navigation" className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <div className=" container d-flex justify-content-between w-100">
          <Link className="navbar-brand" to="/">
            <span className="h2 m-0">
              GeekSynergy
            </span>
          </Link>
          <div >
            <button
              aria-expanded={state}
              aria-controls="company-details"
              onKeyDown={(event) => { if (event.key === "Escape") setState(false); }}
              className="btn btn-lg btn-primary dropdown-toggle"
              onClick={() => setState(!state)}
            >
              Company Info
            </button>
            <div hidden={!state}>{showDetails}</div>
          </div>
        </div>
      </div>
    </nav>
  );
}
