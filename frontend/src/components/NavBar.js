import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import cognitoUtils from '../lib/cognitoUtils';
import { connect } from 'react-redux'

const mapStateToProps = state => {
    return { session: state.session }
}

const onSignOut = (e) => {
    e.preventDefault()
    cognitoUtils.signOutCognitoSession()
}

class NavBar extends Component {

    render() {
        return (
            <div>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="menu">
                            <MenuIcon />
                        </IconButton>
                        {this.props.session.isLoggedIn ? (
                            <Button color="inherit" href ="/" onClick={onSignOut}>Sign Out</Button>
                        ) : 
                        (
                            <Button color="inherit" href={cognitoUtils.getCognitoSignInUri()}>Sign In</Button>
                        )}
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

export default connect(mapStateToProps)(NavBar)