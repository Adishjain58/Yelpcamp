import React, { Component, Fragment } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import spinner from "../../lg.rotating-balls-spinner.gif";
import { Container, TextField, Button } from "@material-ui/core";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import CloseIcon from "@material-ui/icons/Close";
import AddIcon from "@material-ui/icons/Add";

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
      show: false,
      text: "",
      comments: [],
      comment: {
        commentId: "",
        text: "",
      },
      commentLoading: false,
      likeLoading: false,
    };
  }

  componentDidMount = (props) => {
    this.setState({
      loading: true,
    });
    axios
      .get(`/campgrounds/${this.props.match.params.id}`)
      .then((camp) => {
        let likes;
        let owner;
        let authUser;
        if (localStorage.getItem("user")) {
          authUser = JSON.parse(localStorage.getItem("user"));
          likes = camp.data.likes.filter(
            (val) => val.author === authUser._id.toString(),
          ).length;
          owner =
            authUser._id.toString() === camp.data.author.id ? true : false;
        }
        this.setState({
          camp: camp.data,
          comments: camp.data.comments,
          likes: camp.data.likes,
          liked: likes > 0 ? true : false,
          owner,
          authUser,
          hidden: camp.data.image,
          loading: false,
        });
      })
      .catch((err) => console.log(err));
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({
      commentLoading: true,
    });
    const comment = {
      text: this.state.text,
    };
    axios
      .post(`/campgrounds/${this.state.camp._id}/comments`, comment)
      .then((comment) => {
        this.props.noty.success("Comment added successfully");
        axios.get(`/campgrounds/${this.props.match.params.id}`).then((camp) => {
          this.setState({
            camp: camp.data,
            commentLoading: false,
            comments: camp.data.comments,
            show: false,
            text: "",
          });
        });
        this.props.history.push(`/campgrounds/${this.state.camp._id}`);
      })
      .catch((err) => console.log(err));
  };

  handleLike = () => {
    if (this.state.authUser) {
      this.setState({
        likeLoading: true,
      });
      axios
        .post(`/campgrounds/${this.props.match.params.id}/like`)
        .then((camp) => {
          let likes = camp.data.likes.filter(
            (val) => val.author === this.state.authUser._id.toString(),
          ).length;
          this.setState({
            likes: camp.data.likes,
            liked: likes > 0 ? true : false,
            likeLoading: false,
          });
          this.props.noty.success("Camp liked successfully");
        })
        .catch((err) => console.log(err));
    } else {
      this.props.noty.error("You need to be logged in to do that");
    }
  };

  handleUnlike = () => {
    if (this.state.authUser) {
      this.setState({
        likeLoading: true,
      });
      axios
        .post(`/campgrounds/${this.props.match.params.id}/unlike`)
        .then((camp) => {
          let likes = camp.data.likes.filter(
            (val) => val.author === this.state.authUser._id.toString(),
          ).length;
          this.setState({
            likes: camp.data.likes,
            liked: likes > 0 ? true : false,
            likeLoading: false,
          });
          this.props.noty.success("Camp unliked successfully");
        })
        .catch((err) => console.log(err));
    } else {
      this.props.noty.error("You need to be logged in to do that");
    }
  };

  deleteComment = (commentId) => {
    if (this.state.authUser) {
      this.setState({
        commentLoading: true,
      });
      axios
        .delete(
          `/campgrounds/${this.props.match.params.id}/comments/${commentId}`,
        )
        .then(() => {
          this.props.noty.success("Comment deleted successfully");
          axios
            .get(`/campgrounds/${this.props.match.params.id}`)
            .then((camp) => {
              this.setState({
                camp: camp.data,
                commentLoading: false,
                comments: camp.data.comments,
              });
            });
        })
        .catch((err) => console.log(err));
    } else {
      this.props.noty.error("You need to be logged in to do that");
    }
  };

  deleteCamp = (campId) => {
    this.setState({
      loading: true,
    });
    axios
      .delete(`/campgrounds/${campId}`)
      .then(() => {
        this.setState({
          loading: false,
        });
        this.props.noty.success("Campground deleted successfully");
        this.props.history.push("/campgrounds");
      })
      .catch((err) => {
        this.setState({
          loading: false,
        });
      });
  };

  commentShow = () => {
    if (this.state.show) {
      this.setState({
        show: false,
      });
    } else {
      this.setState({
        show: true,
      });
    }
  };

  editCommentShow = (commentId, text) => {
    this.setState({
      comment: {
        commentId,
        text,
      },
    });
  };

  editCommentHide = () => {
    this.setState({
      comment: {
        commentId: "",
        text: "",
      },
    });
  };

  handleEditComment = (e, commentId) => {
    this.setState({
      comment: {
        commentId,
        text: e.target.value,
      },
    });
  };

  editComment = (e, commentId) => {
    e.preventDefault();
    this.setState({
      commentLoading: true,
    });
    const comment = {
      text: this.state.comment.text,
    };
    axios
      .put(
        `/campgrounds/${this.props.match.params.id}/comments/${commentId}`,
        comment,
      )
      .then((comment) => {
        axios.get(`/campgrounds/${this.props.match.params.id}`).then((camp) => {
          this.setState({
            camp: camp.data,
            commentLoading: false,
            comments: camp.data.comments,
            comment: {
              commentId: "",
              text: "",
            },
          });
        });

        this.props.noty.success("Comment updated successfully");
        this.props.history.push(`/campgrounds/${this.props.match.params.id}`);
      })
      .catch((err) => console.log(err));
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

    const dateCalculator = (comment) => {
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
                        src={this.state.camp.imageUrl}
                        alt={this.state.camp.imageAlt}
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
                      {this.state.likeLoading ? (
                        <div className="ml-2">
                          <img
                            src={spinner}
                            alt=""
                            style={{ height: "50px" }}
                          />
                        </div>
                      ) : (
                        <div className="d-flex my-3 mx-2">
                          <Button
                            variant={
                              this.state.liked ? "contained" : "outlined"
                            }
                            color="primary"
                            onClick={
                              this.state.liked
                                ? this.handleUnlike
                                : this.handleLike
                            }
                          >
                            <ThumbUpIcon fontSize="small"></ThumbUpIcon>
                          </Button>

                          <h3 className="text-muted">
                            &nbsp;{this.state.likes.length}
                          </h3>
                        </div>
                      )}

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
                      {this.state.commentLoading ? (
                        <div className="text-center mt-5">
                          <img src={spinner} alt="" />
                        </div>
                      ) : (
                        <div>
                          {(this.state.comments.length > 0 ||
                            this.state.authUser) && (
                            <div className="jumbotron">
                              {this.state.authUser && (
                                <Fragment>
                                  <div className="text-right">
                                    <Button
                                      type="submit"
                                      variant="outlined"
                                      color="secondary"
                                      onClick={this.commentShow}
                                    >
                                      {this.state.show ? (
                                        <Fragment>
                                          <CloseIcon></CloseIcon>&nbsp;Cancel
                                        </Fragment>
                                      ) : (
                                        <Fragment>
                                          <AddIcon></AddIcon> &nbsp;Add new
                                          Comment
                                        </Fragment>
                                      )}
                                    </Button>
                                  </div>
                                  {this.state.show && (
                                    <Container maxWidth="sm">
                                      <form
                                        className="col-12 mb-3"
                                        onSubmit={this.handleSubmit}
                                      >
                                        <TextField
                                          className="mt-5 mb-4"
                                          id="outlined-basic"
                                          label="Enter Text for comment"
                                          variant="outlined"
                                          name="text"
                                          value={this.state.text}
                                          onChange={this.handleChange}
                                          fullWidth
                                          required
                                        />
                                        <Button
                                          fullWidth
                                          type="submit"
                                          variant="outlined"
                                          color="primary"
                                        >
                                          <i className="fa fa-paper-plane" />{" "}
                                          &nbsp;Submit
                                        </Button>
                                      </form>
                                    </Container>
                                  )}
                                </Fragment>
                              )}
                              <hr />
                              <div className="row">
                                {this.state.comments.map((comment, index) => {
                                  return (
                                    <div className="col-sm-12 mb-2" key={index}>
                                      <div className="d-flex justify-content-between">
                                        <strong>
                                          {comment.author.username}
                                        </strong>
                                        <span className="text-right" id="date">
                                          {dateCalculator(comment.createdAt)}
                                        </span>
                                      </div>

                                      <Fragment>
                                        {this.state.comment.commentId ===
                                        comment._id ? (
                                          <Fragment>
                                            <TextField
                                              border={0}
                                              className="mt-1 mb-4 "
                                              id="outlined-basic"
                                              // variant="outlined"
                                              name="text"
                                              value={this.state.comment.text}
                                              onKeyPress={(e) => {
                                                e.key === "Enter" &&
                                                  this.editComment(
                                                    e,
                                                    comment._id,
                                                  );
                                              }}
                                              onChange={(e) =>
                                                this.handleEditComment(
                                                  e,
                                                  comment._id,
                                                )
                                              }
                                              fullWidth
                                              required
                                            />
                                            <Button
                                              type="submit"
                                              variant="outlined"
                                              color="secondary"
                                              onClick={this.editCommentHide}
                                            >
                                              <CloseIcon></CloseIcon>
                                              &nbsp;Cancel
                                            </Button>
                                          </Fragment>
                                        ) : (
                                          <Fragment>
                                            <p>{comment.text}</p>
                                            {this.state.authUser
                                              ? this.state.authUser._id.toString() ===
                                                  comment.author.id && (
                                                  <div className="d-flex mt-2">
                                                    {/* <Link
                                          style={{ textDecoration: "none" }}
                                          to={`/campgrounds/${this.state.camp._id}/comments/${comment._id}/edit`}
                                        >
                                          <Button
                                            variant="outlined"
                                            color="primary"
                                            className="m-3"
                                          >
                                            Edit Comment
                                          </Button>
                                        </Link> */}
                                                    <Button
                                                      variant="outlined"
                                                      color="primary"
                                                      className=" ml-0 "
                                                      onClick={() =>
                                                        this.editCommentShow(
                                                          comment._id,
                                                          comment.text,
                                                        )
                                                      }
                                                    >
                                                      Edit Comment
                                                    </Button>
                                                    <Button
                                                      variant="outlined"
                                                      color="secondary"
                                                      style={{ height: "36px" }}
                                                      className=" ml-3"
                                                      onClick={() =>
                                                        this.deleteComment(
                                                          comment._id,
                                                        )
                                                      }
                                                    >
                                                      Delete Comment
                                                    </Button>
                                                  </div>
                                                )
                                              : ""}
                                          </Fragment>
                                        )}
                                      </Fragment>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
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
