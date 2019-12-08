import React, { Component, Fragment } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import spinner from "../../lg.rotating-balls-spinner.gif";

class show extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authUser: {},
      camp: {},
      likes: 0,
      liked: false,
      owner: false,
      hidden: "",
      loading: false,
      time: ""
    };
  }

  componentDidMount = props => {
    this.setState({
      loading: true
    });
    axios
      .get(`/campgrounds/${this.props.match.params.id}`)
      .then(camp => {
        let likes;
        let owner;
        let authUser;
        if (localStorage.getItem("user")) {
          authUser = JSON.parse(localStorage.getItem("user"));
          likes = camp.data.likes.filter(
            val => val.author === authUser._id.toString()
          ).length;
          owner =
            authUser._id.toString() === camp.data.author.id ? true : false;
        }
        this.setState({
          camp: camp.data,
          likes: camp.data.likes,
          liked: likes > 0 ? true : false,
          owner,
          authUser,
          hidden: camp.data.image,
          loading: false
        });
      })
      .catch(err => console.log(err));
  };

  handleLike = () => {
    if (this.state.authUser) {
      this.setState({
        loading: true
      });
      axios
        .post(`/campgrounds/${this.props.match.params.id}/like`)
        .then(camp => {
          let likes = camp.data.likes.filter(
            val => val.author === this.state.authUser._id.toString()
          ).length;
          this.setState({
            likes: camp.data.likes,
            liked: likes > 0 ? true : false,
            loading: false
          });
          this.props.noty.success("Camp liked successfully");
        })
        .catch(err => console.log(err));
    } else {
      this.props.noty.error("You need to be logged in to do that");
    }
  };

  handleUnlike = () => {
    if (this.state.authUser) {
      this.setState({
        loading: true
      });
      axios
        .post(`/campgrounds/${this.props.match.params.id}/unlike`)
        .then(camp => {
          let likes = camp.data.likes.filter(
            val => val.author === this.state.authUser._id.toString()
          ).length;
          this.setState({
            likes: camp.data.likes,
            liked: likes > 0 ? true : false,
            loading: false
          });
          this.props.noty.success("Camp unliked successfully");
        })
        .catch(err => console.log(err));
    } else {
      this.props.noty.error("You need to be logged in to do that");
    }
  };

  deleteComment = commentId => {
    if (this.state.authUser) {
      this.setState({
        loading: true
      });
      axios
        .delete(
          `/campgrounds/${this.props.match.params.id}/comments/${commentId}`
        )
        .then(() => {
          this.props.noty.success("Comment deleted successfully");
          axios.get(`/campgrounds/${this.props.match.params.id}`).then(camp => {
            this.setState({
              camp: camp.data,
              loading: false
            });
          });
        })
        .catch(err => console.log(err));
    } else {
      this.props.noty.error("You need to be logged in to do that");
    }
  };

  deleteCamp = campId => {
    this.setState({
      loading: true
    });
    axios
      .delete(`/campgrounds/${campId}`)
      .then(() => {
        this.setState({
          loading: false
        });
        this.props.noty.success("Campground deleted successfully");
        this.props.history.push("/campgrounds");
      })
      .catch(err => console.log(err));
  };

  render() {
    const days = " Days Ago";
    const hours = " Hours Ago";
    const minutes = " Minutes Ago";
    const seconds = " Seconds Ago";

    const dateFinder = (date, divider) => {
      let date1 = new Date(date);
      let date2 = new Date();
      return Math.trunc((date2 - date1) / divider);
    };

    const dateCalculator = comment => {
      const res =
        dateFinder(comment, 86400000) >= 1
          ? dateFinder(comment, 86400000) + days
          : dateFinder(comment, 3600000) >= 1
          ? dateFinder(comment, 3600000) + hours
          : dateFinder(comment, 60000) >= 1
          ? dateFinder(comment, 60000) + minutes
          : dateFinder(comment, 1000) + seconds;
      return res;
    };

    return (
      <Fragment>
        {this.state.loading ? (
          <div className="text-center mt-5">
            <img src={spinner} alt="" />
          </div>
        ) : (
          <Fragment>
            {this.state.camp.author && (
              <div className="container mt-5">
                <div className="row">
                  <div className="col-sm-3 mb-3">
                    <p className="lead">Yelp Camp</p>
                    <div className="list-group">
                      <li className="list-group-item active">Info1</li>
                      <li className="list-group-item">Info2</li>
                      <li className="list-group-item">Info3</li>
                    </div>
                  </div>
                  <div className="col-sm-9">
                    <div className="img-thumbnail mb-3">
                      <img
                        className="img-fluid"
                        src={`../${this.state.camp.image}`}
                        alt=""
                      />
                      <div className="figure-caption px-2 py-2 d-flex justify-content-between">
                        <h4>
                          <Link to={`/campgrounds/${this.state.camp._id}`}>
                            {this.state.camp.name}
                          </Link>
                        </h4>
                        <h4 className="justify-content-end">
                          ${this.state.camp.price}/night
                        </h4>
                      </div>
                      <p className="px-2">{this.state.camp.description}</p>
                      <p className="px-2">
                        <em>Submitted By {this.state.camp.author.username}</em>
                      </p>

                      <div className="d-flex my-3 mx-2">
                        <button
                          className={`btn ${
                            this.state.liked
                              ? "btn-primary"
                              : "btn-outline-primary"
                          }`}
                          onClick={
                            this.state.liked
                              ? this.handleUnlike
                              : this.handleLike
                          }
                        >
                          {this.state.liked ? (
                            <i className="fa fa-thumbs-down"></i>
                          ) : (
                            <i className="fa fa-thumbs-up"></i>
                          )}
                        </button>

                        <h3 className="text-muted">
                          &nbsp;{this.state.likes.length}
                        </h3>
                      </div>

                      {this.state.owner && (
                        <div className="d-flex">
                          <Link
                            to={`/campgrounds/${this.state.camp._id}/edit`}
                            className="btn btn-outline-warning m-3"
                          >
                            Edit Camp
                          </Link>

                          <input
                            type="hidden"
                            name="hidden"
                            value={this.state.camp.image}
                          />

                          <button
                            className="btn btn-outline-danger mt-3"
                            style={{ height: "38px" }}
                            onClick={() => this.deleteCamp(this.state.camp._id)}
                          >
                            Delete Camp
                          </button>
                        </div>
                      )}
                      <div className="jumbotron">
                        {this.state.authUser && (
                          <div className="text-right">
                            <Link
                              className="btn btn-outline-success ml-3"
                              to={`/campgrounds/${this.state.camp._id}/comments/new`}
                            >
                              <i className="fa fa-paper-plane"></i> Add new
                              Comment
                            </Link>
                          </div>
                        )}
                        <hr />
                        <div className="row">
                          {this.state.camp.comments.map((comment, index) => {
                            return (
                              <div className="col-sm-12" key={index}>
                                <div className="d-flex justify-content-between">
                                  <strong>{comment.author.username}</strong>
                                  <span className="text-right" id="date">
                                    {dateCalculator(comment.createdAt)}
                                  </span>
                                </div>
                                <p>{comment.text}</p>

                                {this.state.authUser
                                  ? this.state.authUser._id.toString() ===
                                      comment.author.id && (
                                      <div className="d-flex">
                                        <Link
                                          to={`/campgrounds/${this.state.camp._id}/comments/${comment._id}/edit`}
                                        >
                                          <button className="btn btn-outline-warning m-3 btn-sm">
                                            Edit Comment
                                          </button>
                                        </Link>

                                        <button
                                          className="btn btn-sm btn-outline-danger mt-3"
                                          style={{ height: "33px" }}
                                          onClick={() =>
                                            this.deleteComment(comment._id)
                                          }
                                        >
                                          Delete Comment
                                        </button>
                                      </div>
                                    )
                                  : ""}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Fragment>
        )}
      </Fragment>
    );
  }
}

export default show;
