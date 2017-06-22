import { connect } from 'react-redux';
import LoginComponent from '../screens/Login';
import * as AuthActions from '../actions/authActions';

function mapDispatchToProps(dispatch) {
  return {
    userLogin: token => dispatch(AuthActions.userLogin(token)),
    userLogout: () => dispatch(AuthActions.userLogout()),
  };
}

export default connect(null, mapDispatchToProps)(LoginComponent);
