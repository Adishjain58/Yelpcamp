import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar/navbar";
import Login from "./components/Login/login";
import CampGround from "./components/Campground/campground";

function App() {
  return (
    <Router>
      <Navbar />
      <Route path="/campground/new" component={CampGround} />

      <Route path="/login" component={Login}></Route>
    </Router>
  );
}

export default App;
