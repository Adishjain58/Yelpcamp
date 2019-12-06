import React, { Component } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import spinner from "../../lg.rotating-balls-spinner.gif";

class commentEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      loading: false
    };
  }

  componentDidMount = () => {
    this.setState({
      loading: true
    });
    Axios.get(
      `/campgrounds/${this.props.match.params.id}/comments/${this.props.match.params.commentId}/edit`
    )
      .then(comment => {
        this.setState({
          text: comment.data.text,
          loading: false
        });
      })
      .catch(err => {
        console.log(err.reponse);
      });
  };

  handleChange = e => {
    this.setState({
      text: e.target.value
    });
  };

  editComment = e => {
    e.preventDefault();
    this.setState({
      loading: true
    });
    const comment = {
      text: this.state.text
    };
    Axios.put(
      `/campgrounds/${this.props.match.params.id}/comments/${this.props.match.params.commentId}`,
      comment
    )
      .then(comment => {
        this.setState({
          loading: false
        });
        this.props.noty.success("Comment updated successfully");
        this.props.history.push(`/campgrounds/${this.props.match.params.id}`);
      })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <div className="container">
        {this.state.loading ? (
          <div className="text-center mt-5">
            <img src={spinner} alt="" />
          </div>
        ) : (
          <div className="row">
            <h1 className="col-12 text-center mt-5">Edit Comment</h1>
            <div style={{ width: "30%", margin: "20px auto" }}>
              <form className="col-12" action="" onSubmit={this.editComment}>
                <div className="form-group">
                  <label htmlFor="name">Enter Text for comment</label>
                  <input
                    type="text"
                    name="comment[text]"
                    id="name"
                    className="form-control"
                    placeholder="Text"
                    defaultValue={this.state.text}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <button
                    type="submit"
                    className="btn btn-outline-primary btn-block"
                  >
                    <i className="fa fa-paper-plane" /> Submit
                  </button>
                </div>
              </form>
              <Link to={`/campgrounds/${this.props.match.params.id}`}>
                Go Back
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default commentEdit;
