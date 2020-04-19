import React from "react";
import NavBar from "../components/navBar";
import RecommendationForm from "../components/recommendationForm";
import RecommendationsList from "../components/recommendationsList";
import { connect } from "react-redux";

const mapStateToProps = (state) => ({
  isLoggedIn: state.session.isLoggedIn,
});

const Home = ({ isLoggedIn }) => (
  <React.Fragment>
    <NavBar />
    {isLoggedIn ? (
      <React.Fragment>
        <RecommendationForm />
        <RecommendationsList />
      </React.Fragment>
    ) : null}
  </React.Fragment>
);

export default connect(mapStateToProps)(Home);
