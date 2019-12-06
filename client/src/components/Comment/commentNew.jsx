import React, { Component } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import spinner from "../../lg.rotating-balls-spinner.gif";

class commentNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      camp: {},
      text: "",
      loading: false
    };
  }

  componentDidMount = () => {
    this.setState({
      loading: true
    });
    Axios.get(`/campgrounds/${this.props.match.params.id}`).then(camp => {
      this.setState({
        camp: camp.data,
        loading: false
      });
    });
  };

  handleChange = e => {
    this.setState({
      text: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.setState({
      loading: true
    });
    const comment = {
      text: this.state.text
    };
    Axios.post(`/campgrounds/${this.state.camp._id}/comments`, comment)
      .then(comment => {
        this.setState({
          loading: false
        });
        this.props.noty.success("Comment added successfully");
        this.props.history.push(`/campgrounds/${this.state.camp._id}`);
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
            <h1 className="col-12 text-center mt-5">
              ADD new Comment to {this.state.camp.name}
            </h1>
            <div style={{ width: "30%", margin: "20px auto" }}>
              <form className="col-12" onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Enter Text for comment</label>
                  <input
                    type="text"
                    name="text"
                    id="name"
                    className="form-control"
                    placeholder="Text"
                    onChange={this.handleChange}
                    value={this.state.text}
                    required
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
              <Link to={`/campgrounds/${this.state.camp._id}`}>Go Back</Link>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default commentNew;
