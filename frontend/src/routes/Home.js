import React, { Component } from 'react'
import NavBar from '../components/NavBar';
import { RecommendationForm } from '../components/RecommendationForm'
import { connect } from 'react-redux'

const mapStateToProps = state => {
  return { session: state.session }
}

class Home extends Component {

  render () {
    return (
      <React.Fragment>
        <NavBar/>
        { this.props.session.isLoggedIn ? <RecommendationForm/> : null }
      </React.Fragment>
    )
  }
}

export default connect(mapStateToProps)(Home)