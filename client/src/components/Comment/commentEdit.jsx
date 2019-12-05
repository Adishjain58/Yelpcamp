import React, { Component } from "react";
import Axios from "axios";

class commentEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: {
        text: ""
      }
    };
  }

  componentDidMount = () => {
    Axios.get();
  };

  render() {
    console.log(this.props.match);
    return (
      <div className="container">
        <div className="row">
          <h1 className="col-12 text-center mt-5">Edit Comment</h1>
          <div style={{ width: "30%", margin: "20px auto" }}>
            <form
              className="col-12"
              action="/campgrounds/<%= campId%>/comments/<%=comment._id%>?_method=PUT"
              method="post"
            >
              <div className="form-group">
                <label htmlFor="name">Enter Text for comment</label>
                <input
                  type="text"
                  name="comment[text]"
                  id="name"
                  className="form-control"
                  placeholder="Text"
                  defaultValue="<%=comment.text%>"
                />
              </div>
              <div className="form-group">
                <button className="btn btn-outline-primary btn-block">
                  <i className="fa fa-paper-plane" /> Submit
                </button>
              </div>
            </form>
            <a href="/campgrounds/<%= campId%>">Go Back</a>
          </div>
        </div>
      </div>
    );
  }
}

export default commentEdit;
