import { connect } from 'react-redux';
import React from 'react';
import CreateVehicleFull from '../screens/CreateVehicleFull';
import * as AuthActions from '../actions/authActions';

class CreateVehicleContainer extends React.Component {
  getAuth() {
    return this.props.auth;
  }

  render() {
    return (
      <CreateVehicleFull
        {...this.props}
        auth={() => this.getAuth()}
      />
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

CreateVehicleContainer.propTypes = {
  auth: React.PropTypes.object,
  insideReview: React.PropTypes.bool,
  navigator: React.PropTypes.object,
  review: React.PropTypes.object,
};

export default connect(mapStateToProps, null)(CreateVehicleContainer);
