import { connect } from 'react-redux';
import React from 'react';
import Logout from '../screens/Logout';
import * as AuthActions from '../actions/authActions';

class ConfigContainer extends React.Component {
  getAuth() {
    return this.props.auth;
  }

  render() {
    return (
      <Logout
        auth={() => this.getAuth()}
        navigator={this.props.navigator}
        userLogout={this.props.userLogout}
      />
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
  userLogout: () => dispatch(AuthActions.userLogout()),
});

ConfigContainer.propTypes = {
  auth: React.PropTypes.object,
  userLogout: React.PropTypes.func,
  navigator: React.PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfigContainer);
