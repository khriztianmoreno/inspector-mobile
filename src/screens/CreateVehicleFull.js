import React from 'react';
import {
  Alert,
} from 'react-native';

import AddVehicle from './AddVehicle';
import ChooseInspection from '../screens/ChooseInspection';
import ReviewContainer from '../containers/review';

class CreateVehicleFull extends React.Component {

  onCreatedFinished(car) {
    const vehicle = { ...car };
    const review = { ...this.props.review };
    review.vehicle = {
      localId: vehicle._id,
      plate: vehicle.plate.number,
      class: vehicle.vehicleData.class,
    };
    review.customer = { ...vehicle.customer };

    if (this.props.insideReview) {
      this.props.navigator.push({
        title: 'Elegir Inspección',
        component: ChooseInspection,
        passProps: {
          ...this.props,
          vehicle,
          review,
        },
        index: 2,
      });
    } else {
      Alert.alert('Vehículo creado exitosamente');
      this.props.navigator.resetTo({
        title: 'Buscar placa',
        component: ReviewContainer,
        passProps: {
          // auth: this.props.auth,
          // userLogin: this.props.userLogin,
          // review: { userReview: { ...this.props.review.userReview } },
        },
      });
    }
  }

  render() {
    return (
      <AddVehicle
        {...this.props}
        onSuccess={car => this.onCreatedFinished(car)}
        plate={this.props.plate}
      />
    );
  }
}

CreateVehicleFull.propTypes = {
  insideReview: React.PropTypes.bool,
  plate: React.PropTypes.string,
  auth: React.PropTypes.func,
  userLogin: React.PropTypes.func,
  navigator: React.PropTypes.object,
  review: React.PropTypes.object,
};

export default CreateVehicleFull;
