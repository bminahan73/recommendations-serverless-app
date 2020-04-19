import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { getCognitoSignInUri } from "../lib/cognitoUtils";
import { clearSession } from "../state/actions";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
}));

const NavBar = ({ isLoggedIn }, clearSession) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          {isLoggedIn ? (
            <Button color="inherit" href="/" onClick={() => clearSession()}>
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
};

const mapStateToProps = (state) => ({
  isLoggedIn: state.session.isLoggedIn,
});

const mapDispatchToProps = (dispatch) => ({
  clearSession: () => dispatch(clearSession()),
});

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
