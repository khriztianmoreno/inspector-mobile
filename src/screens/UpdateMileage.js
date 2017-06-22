/**
 * Update Mileage Screen
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
} from 'react-native';
import dimissKeyboard from 'react-native-dismiss-keyboard';

// Local Imports
import AppStyles from '../styles';
import AppConfig from '../config';
import VehicleService from '../services/VehicleService';
import FrontPhoto from '../screens/FrontPhoto';
import Inspection from '../screens/Inspection';
import Button from '../components/button';
import Loading from '../components/loading';


class UpdateMileage extends Component {
  constructor(props) {
    super(props);

    this.vehicle = { ...props.vehicle.vehicleData };
    this.validMileage = false;
    this.isValidMileage = this.isValidMileage.bind(this);
    this.nextScreen = this.nextScreen.bind(this);
    this.updateVehicle = this.updateVehicle.bind(this);
    this.message = '';

    this.state = {
      mileage: this.vehicle.mileage.toString(),
      loading: false,
    };
  }

  /*
    TODO:
    * Create a function to generate the form structure based in the object definition
  */

  nextScreen(vehicleUpdated) {
    const isPreventive = this.props.inspection.type === 'PREVENTIVE';
    setTimeout(() => dimissKeyboard(), 200);

    this.setState({ loading: false });
    this.props.navigator.push({
      title: isPreventive ? 'Foto Frontal' : 'Revisión',
      component: isPreventive ? FrontPhoto : Inspection,
      passProps: {
        ...this.props,
        isPreventive,
        vehicleUpdated,
      },
    });
  }

  updateVehicle() {
    this.setState({ loading: true });
    const originalVehicle = {
      ...this.props.vehicle,
      vehicleData: {
        mileage: parseInt(this.state.mileage, 10),
      },
    };
    const token = this.props.auth().token;

    VehicleService.update(originalVehicle, token)
      .then(res => res.json())
      .then((vehicleUpdated) => {
        // dimissKeyboard();
        this.nextScreen(vehicleUpdated);
      })
      .catch((err) => {
        console.log('[Error] - updating vehicle:', err);
        this.setState({ loading: false });
      });
  }

  isValidMileage(mileage) {
    const currentMileage = mileage;
    const originalMileage = this.vehicle.mileage;

    this.validMileage = currentMileage >= originalMileage;

    if (!this.validMileage) {
      this.message = 'Kilometraje inválido';
    }

    this.setState({
      mileage,
    });
  }

  renderResult() {
    if (this.validMileage) {
      return (
        <Button
          text={'Siguiente'}
          onPress={this.updateVehicle}
        />
      );
    }
    return <Text style={styles.message}>{this.message}</Text>;
  }

  render() {
    const { loading } = this.state;
    return (
      !loading
      ? <View style={[styles.container]}>
        <Text style={[AppStyles.h1, AppStyles.centered, styles.vPad]}>Actualizar Kilometraje</Text>
        <View style={[AppStyles.stretchContainer, AppStyles.paddingHorizontal]}>
          <TextInput
            autoFocus
            keyboardType="numeric"
            onChangeText={text => this.isValidMileage(text)}
            returnKeyType="done"
            selectionColor={AppConfig.primaryColor}
            style={[styles.mileageInput]}
            underlineColorAndroid="rgba(0, 0, 0, 0)"
            value={this.state.mileage}
          />
          {this.renderResult()}
        </View>
      </View>
      : <Loading
        text="Procesando..."
      />
    );
  }
}

export default UpdateMileage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  stretchContainer: {
    alignItems: 'stretch',
  },
  mileageInput: {
    fontSize: 30,
    color: '#555',
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'right',
  },
  vPad: {
    paddingTop: 10,
  },
});
