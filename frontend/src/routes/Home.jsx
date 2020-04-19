import React, { Component } from "react";
import NavBar from "../components/navBar";
import RecommendationForm from "../components/recommendationForm";
import RecommendationsList from "../components/recommendationsList";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
  return {
    session: state.session,
    isLoggedIn: state.isLoggedIn,
  };
};

class Home extends Component {
  render() {
    return (
      <React.Fragment>
        <NavBar />
        {this.props.isLoggedIn ? (
          <React.Fragment>
            <RecommendationForm />
            <RecommendationsList />
          </React.Fragment>
        ) : null}
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps)(Home);
