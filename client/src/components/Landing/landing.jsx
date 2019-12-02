import React from "react";
import { Link } from "react-router-dom";
export default function landing() {
  return (
    <div>
      <div id="landing-header">
        <h1>Welcome to YelpCamp!</h1>
        <Link to="/campgrounds" className="btn btn-lg btn-success">
          View All Campgrounds
        </Link>
      </div>

      <ul className="slideshow">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>
  );
}
