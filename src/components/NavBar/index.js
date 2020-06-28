import React from "react";
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to="#">
        Filecoin Network Explorer
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/chain">
              Chain
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/miners">
              Miners
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/market">
              Markets
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/deals">
              Deals
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
