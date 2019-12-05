import React, { Component } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";

class commentNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      camp: {},
      comment: {
        text: ""
      }
    };
  }

  componentDidMount = () => {
    console.log(this.props.match.params.id);
    Axios.get(`/campgrounds/${this.props.match.params.id}`).then(camp => {
      this.setState({
        camp: camp.data
      });
    });
  };

  handleChange = e => {
    this.setState({
      comment: {
        text: e.target.value
      }
    });
  };

  handleSubmit = () => {
    Axios.post(`/campgrounds/${this.state.camp._id}/comments`)
      .then(comment => {
        this.props.location.history.push(`/campgrounds/${this.state.camp._id}`);
      })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <h1 className="col-12 text-center mt-5">
            ADD new Comment to {this.state.camp.name}
          </h1>
          <div style={{ width: "30%", margin: "20px auto" }}>
            <form
              className="col-12"
              action={`/campgrounds/${this.state.camp._id}/comments`}
              method="post"
              onSubmit={this.handleSubmit}
            >
              <div className="form-group">
                <label htmlFor="name">Enter Text for comment</label>
                <input
                  type="text"
                  name="comment[text]"
                  id="name"
                  className="form-control"
                  placeholder="Text"
                  onChange={this.handleChange}
                  value={this.state.comment.text}
                  required
                />
              </div>
              <div className="form-group">
                <button className="btn btn-outline-primary btn-block">
                  <i className="fa fa-paper-plane" /> Submit
                </button>
              </div>
            </form>
            <Link to={`/campgrounds/${this.state.camp._id}`}>Go Back</Link>
          </div>
        </div>
      </div>
    );
  }
}

export default commentNew;
