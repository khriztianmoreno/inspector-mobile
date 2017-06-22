import { connect } from 'react-redux';
import React from 'react';
import SearchVehicle from '../screens/SearchVehicle';
import { getTokenPayload } from '../helpers/JwtHelper';

class ReviewContainer extends React.Component {
  getAuth() {
    return this.props.auth;
  }

  getReviewObject() {
    const payload = getTokenPayload(this.props.auth.token);
    return {
      review: {
        userReview: {
          localId: payload._id,
          name: payload.name,
        },
      },
    };
  }

  render() {
    const review = this.getReviewObject();
    return (
      <SearchVehicle
        auth={() => this.getAuth()}
        navigator={this.props.navigator}
        {...review}
      />
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

ReviewContainer.propTypes = {
  auth: React.PropTypes.object,
  navigator: React.PropTypes.object,
};

export default connect(mapStateToProps, null)(ReviewContainer);
