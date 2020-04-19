import React, { Component } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { getCognitoSignInUri } from "../lib/cognitoUtils";
import { connect } from "react-redux";
import { clearSession } from "../state/actions";

const mapStateToProps = (state) => {
  return {
    session: state.session,
    isLoggedIn: state.isLoggedIn,
  };
};

const mapDispatchToProps = { clearSession };

class NavBar extends Component {
  render() {
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            {this.props.isLoggedIn ? (
              <Button
                color="inherit"
                href="/"
                onClick={() => this.props.clearSession}
              >
                Sign Out
              </Button>
            ) : (
              <Button color="inherit" href={getCognitoSignInUri()}>
                Sign In
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
