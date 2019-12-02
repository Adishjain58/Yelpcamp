import React, { Component, Fragment } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

class show extends Component {
  constructor(props) {
    super(props);
    this.state = {
      camp: {},
      likes: 0
    };
  }

  componentDidMount = props => {
    axios
      .get(`/campgrounds/${this.props.match.params.id}`)
      .then(camp => {
        this.setState({
          camp: camp.data,
          likes: camp.data.likes
        });
      })
      .catch(err => console.log(err));
  };

  render() {
    return (
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
                    src={this.state.camp.image}
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

                  <div className="d-flex my-3">
                    <button
                      className="btn <%=likeFinder(camp.likes)%>"
                      type="submit"
                    >
                      <i className="fa fa-thumbs-up"></i>
                    </button>

                    <h3 className="text-muted">{this.state.likes.length}</h3>

                    <button
                      className="btn <%=unlikeFinder(camp.likes)%>"
                      type="submit"
                    >
                      <i className="fa fa-thumbs-down"></i>
                    </button>
                  </div>

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
                  <div className="jumbotron">
                    <div className="text-right">
                      <Link
                        className="btn btn-outline-success ml-3"
                        to={`/campgrounds/${this.state.camp._id}/comments/new`}
                      >
                        <i className="fa fa-paper-plane"></i> Add new Comment
                      </Link>
                    </div>
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
