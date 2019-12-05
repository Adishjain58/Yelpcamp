import React, { Component } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";

class commentEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ""
    };
  }

  componentDidMount = () => {
    Axios.get(
      `/campgrounds/${this.props.match.params.id}/comments/${this.props.match.params.commentId}/edit`
    ).then(comment => {
      this.setState({
        text: comment.data.text
      });
    });
  };

  handleChange = e => {
    this.setState({
      text: e.target.value
    });
  };

  editComment = e => {
    e.preventDefault();
    const comment = {
      text: this.state.text
    };
    Axios.put(
      `/campgrounds/${this.props.match.params.id}/comments/${this.props.match.params.commentId}`,
      comment
    )
      .then(comment => {
        this.props.noty.success("Comment updated successfully");
        this.props.history.push(`/campgrounds/${this.props.match.params.id}`);
      })
      .catch(err => console.log(err));
  };

  render() {
    console.log(this.props.match);
    return (
      <div className="container">
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
      </div>
    );
  }
}

export default commentEdit;
