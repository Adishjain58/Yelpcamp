import React, { Component, Fragment } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import spinner from "../../lg.rotating-balls-spinner.gif";

class campgrounds extends Component {
  constructor(props) {
    super(props);
    this.state = {
      camps: [],
      loading: false,
    };
  }

  componentDidMount = () => {
    this.setState({
      loading: true,
    });
    axios
      .get("/campgrounds")
      .then((camps) => {
        this.setState({
          camps: camps.data,
          loading: false,
        });
      })
      .catch((err) => console.log(err));
  };
  render() {
    const campsData = () => {
      return (
        <div className="row text-center">
          {this.state.camps.map((camp, index) => {
            return (
              <div key={index} className=" col-lg-3 col-md-6 mb-3">
                <div className="img-thumbnail">
                  <img
                    className="img-fluid mb-2"
                    src={camp.imageUrl}
                    alt={camp.imageAlt}
                  />
                  <div className="card-title pl-2">
                    <h4>{camp.name}</h4>
                  </div>
                  <p>
                    <Link
                      to={`/campgrounds/${camp._id}`}
                      className="btn btn-info"
                    >
                      <i className="fa fa-info-circle"></i> &nbsp;More Info
                    </Link>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      );
    };
    return (
      <div className="container mt-4">
        <header className="jumbotron">
          <h1>Welcome to YelpCamp!</h1>
          <p>View our hand-picked campgrounds from all over the world</p>
          <p>
            <Link
              className="btn btn-primary btn-lg"
              to="/campgrounds/create/new"
            >
              Add new Campground
            </Link>
          </p>
        </header>
        <Fragment>
          {this.state.loading ? (
            <div className="text-center mt-5">
              <img src={spinner} alt="" />
            </div>
          ) : (
            campsData()
          )}
        </Fragment>
      </div>
    );
  }
}

export default campgrounds;
