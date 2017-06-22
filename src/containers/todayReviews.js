import { connect } from 'react-redux';
import React from 'react';
import ReviewList from '../screens/ReviewList';

class TodayReviewsContainer extends React.Component {
  getAuth() {
    return this.props.auth;
  }

  render() {
    return (
      <ReviewList
        auth={() => this.getAuth()}
        navigator={this.props.navigator}
      />
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

TodayReviewsContainer.propTypes = {
  auth: React.PropTypes.object,
  navigator: React.PropTypes.object,
};

export default connect(mapStateToProps, null)(TodayReviewsContainer);
