import React, { Component, Fragment } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

class show extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authUser: {},
      camp: {},
      likes: 0,
      liked: false,
      owner: false,
      error: {}
    };
  }

  componentDidMount = props => {
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
          console.log(authUser);
        }
        this.setState({
          camp: camp.data,
          likes: camp.data.likes,
          liked: likes > 0 ? true : false,
          owner,
          authUser
        });
      })
      .catch(err => console.log(err));
  };

  handleLike = () => {
    if (this.state.authUser) {
      axios
        .post(`/campgrounds/${this.props.match.params.id}/like`)
        .then(camp => {
          let likes = camp.data.likes.filter(
            val => val.author === this.state.authUser._id.toString()
          ).length;
          this.setState({
            likes: camp.data.likes,
            liked: likes > 0 ? true : false
          });
        })
        .catch(err => console.log(err));
    } else {
      let error = { err: "You need to be logged in to do that" };
      this.setState({
        error
      });
    }
  };

  handleUnlike = () => {
    if (this.state.authUser) {
      axios
        .post(`/campgrounds/${this.props.match.params.id}/unlike`)
        .then(camp => {
          let likes = camp.data.likes.filter(
            val => val.author === this.state.authUser._id.toString()
          ).length;
          this.setState({
            likes: camp.data.likes,
            liked: likes > 0 ? true : false
          });
        })
        .catch(err => console.log(err));
    } else {
      let error = { err: "You need to be logged in to do that" };
      this.setState({
        error
      });
    }
  };

  render() {
    return (
      <Fragment>
        {this.state.camp.author && (
          <div className="container mt-5">
            {this.state.error.hasOwnProperty("err") && (
              <div class="alert alert-danger" role="alert">
                {this.state.error.err}
              </div>
            )}
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
                        this.state.liked ? "btn-primary" : "btn-outline-primary"
                      }`}
                      type="submit"
                      onClick={
                        this.state.liked ? this.handleUnlike : this.handleLike
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

                    {/* <button
                      className="btn <%=unlikeFinder(camp.likes)%>"
                      type="submit"
                    >
                      <i className="fa fa-thumbs-down"></i>
                    </button> */}
                  </div>

                  {this.state.owner && (
                    <div className="d-flex">
                      <Link
                        to={`/campgrounds/${this.state.camp._id}/edit`}
                        className="btn btn-outline-warning m-3"
                      >
                        Edit Camp
                      </Link>
                      <form
                        //   action={`/campgrounds/${this.state.camp._id}?_method=DELETE`}
                        method="post"
                      >
                        <input
                          type="hidden"
                          name="hidden"
                          value={this.state.camp.image}
                        />
                        <button
                          type="submit"
                          className="btn btn-outline-danger mt-3"
                        >
                          Delete Camp
                        </button>
                      </form>
                    </div>
                  )}
                  <div className="jumbotron">
                    {this.state.authUser && (
                      <div className="text-right">
                        <Link
                          className="btn btn-outline-success ml-3"
                          to={`/campgrounds/${this.state.camp._id}/comments/new`}
                        >
                          <i className="fa fa-paper-plane"></i> Add new Comment
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
                              <span className="text-right" id="date"></span>
                            </div>
                            <p>{comment.text}</p>

                            {this.state.authUser
                              ? this.state.authUser._id.toString() ===
                                  comment.author.id && (
                                  <div className="d-flex">
                                    <Link
                                      to={`/campgrounds/${this.state.camp._id}/comments/${comment._id}/edit`}
                                      className="btn btn-outline-warning m-3 btn-sm"
                                    >
                                      Edit Comment
                                    </Link>
                                    <form
                                      action="/campgrounds/<%=camp._id%>/comments/<%=comment._id%>?_method=DELETE"
                                      method="post"
                                    >
                                      <button
                                        type="submit"
                                        className="btn btn-sm btn-outline-danger mt-3"
                                      >
                                        Delete Comment
                                      </button>
                                    </form>
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
    );
  }
}

export default show;
