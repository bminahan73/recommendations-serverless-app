import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import cognitoUtils from "../lib/cognitoUtils";
import { setSession } from "../state/actions";

function initSessionFromCallbackURI(callbackHref) {
  return function (dispatch) {
    return cognitoUtils
      .parseCognitoWebResponse(callbackHref)
      .then(() => cognitoUtils.getCognitoSession())
      .then((session) => {
        dispatch(setSession(session));
      });
  };
}

const mapStateToProps = (state) => ({
  session: state.session,
});

const mapDispatchToProps = (dispatch) => ({
  initSessionFromCallbackURI: (href) =>
    dispatch(initSessionFromCallbackURI(href)),
});

class AuthCallback extends Component {
  render() {
    // if URI contains the code and state, generate a new session from info, then redirect to Home
    if (this.props.location.hash || this.props.location.search) {
      this.props.initSessionFromCallbackURI(window.location.href);
      return <Redirect to="/" />;
    }
    //if already logged in, redirect to home
    if (this.props.session.isLoggedIn) {
      return <Redirect to="/" />;
    }
    return <p>error</p>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthCallback);
