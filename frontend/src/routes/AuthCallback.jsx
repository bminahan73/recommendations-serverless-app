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

const mapStateToProps = (state) => {
  return {
    session: state.session,
    isLoggedIn: state.isLoggedIn,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    initSessionFromCallbackURI: (href) =>
      dispatch(initSessionFromCallbackURI(href)),
  };
}

class AuthCallback extends Component {
  // If a Cognito auth code is in the URL (could be a hash or query component), init the new session
  componentDidMount() {
    if (this.props.location.hash || this.props.location.search) {
      this.props.initSessionFromCallbackURI(window.location.href);
    }
  }

  render() {
    if (
      (!this.props.location.hash && !this.props.location.search) ||
      this.props.isLoggedIn
    ) {
      return <Redirect to="/" />;
    }

    return <div />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthCallback);
