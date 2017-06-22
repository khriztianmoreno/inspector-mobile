/**
 * Search Vehicle Screen
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import dimissKeyboard from 'react-native-dismiss-keyboard';

import AppStyles from '../styles';
import Button from '../components/button';
import VehicleService from '../services/VehicleService';
import ChooseInspection from '../screens/ChooseInspection';
import CreateVehicleFull from '../screens/CreateVehicleFull';

const PLATE_LENGTH = 6;
const ZERO = 0;

class SearchPlate extends Component {
  constructor(props) {
    super(props);

    this.handlePlateChange = this.handlePlateChange.bind(this);
    this.handleSubmitPlate = this.handleSubmitPlate.bind(this);
    this.nextScreen = this.nextScreen.bind(this);

    this.invalidMessage = '';
    this.vehicle = null;

    this.state = {
      plate: '',
      lastSubmitedPlate: '',
      foundPlate: false,
      showCreate: false,
      vehicle: {},
    };
  }

  handleSubmitPlate(plate) {
    const token = this.props.auth().token;
    VehicleService.searchByPlate(plate, token)
      .then(res => res.json())
      .then((vehicles) => {
        const found = vehicles.length === 1;
        this.vehicle = vehicles[0];
        if (!found) this.invalidMessage = 'Placa no existe';
        this.setState({
          foundPlate: found,
          showCreate: !found,
        });
      })
      .catch(err => console.log('Error getting vehicle:', err));
  }

  nextScreen() {
    // Add fields needed to review
    const { vehicle } = this;
    const review = { ...this.props.review };
    review.vehicle = {
      localId: vehicle._id,
      plate: vehicle.plate.number,
      class: vehicle.vehicleData.class,
    };
    review.customer = { ...vehicle.customer };

    dimissKeyboard();

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
  }

  handlePlateChange(text) {
    switch (text.length) {
    case PLATE_LENGTH:
      this.invalidMessage = this.invalidMessage || 'Placa inválida';
      this.handleSubmitPlate(text);
      this.setState({
        plate: text,
      });
      break;
    case ZERO:
      this.invalidMessage = '';
      this.setState({
        found: false,
        plate: text,
      });
      break;
    default:
      this.invalidMessage = 'Placa inválida';
      this.setState({
        showCreate: false,
        foundPlate: false,
        plate: text,
      });
    }
  }

  renderResult() {
    if (this.state.foundPlate) {
      return (
        <Button
          text={'Revisar'}
          onPress={this.nextScreen}
        />
      );
    }
    return <Text style={styles.message}>{this.invalidMessage}</Text>;
  }

  goToCreateVehicle() {
    dimissKeyboard();
    this.props.navigator.push({
      component: CreateVehicleFull,
      title: 'Crear vehículo',
      passProps: {
        ...this.props,
        insideReview: true,
        plate: this.state.plate,
      },
    });
  }

  renderAddVehicle() {
    const { showCreate } = this.state;
    if (showCreate) {
      return (
        <View style={styles.createVehicle}>
          <Button 
            text="Crear vehículo"
            size="medium"
            onPress={() => this.goToCreateVehicle()}
          />
        </View>
      );
    }
  }

  render() {
    return (
      <View style={[styles.container]}>
        <View style={[AppStyles.stretchContainer, AppStyles.paddingHorizontal]}>
          <View style={styles.plateBase}>
            <View style={styles.plate}>
              <TextInput
                autoCorrect={false}
                autoCapitalize="characters"
                maxLength={6}
                style={styles.plateInput}
                onChangeText={this.handlePlateChange}
                value={this.state.plate}
                returnKeyType="done"
                placeholder="ABC123"
                placeholderTextColor="#CCC"
                underlineColorAndroid="rgba(0, 0, 0, 0)"
              />
            </View>
          </View>
          {this.renderResult()}
          {this.renderAddVehicle()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  stretchContainer: {
    alignItems: 'stretch',
  },
  plateInput: {
    fontSize: 30,
    color: '#555',
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#AAA',
  },
  createVehicle: {
    marginTop: 10,
    paddingVertical: 20,
  },
  plate: {
    borderColor: '#555',
    borderWidth: 2,
    borderRadius: 10,
    margin: 3,
  },
  plateBase: {
    elevation: 1,
    marginHorizontal: 50,
    marginVertical: 20,
    borderRadius: 10,
  },
});

export default SearchPlate;
