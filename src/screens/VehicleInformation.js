/**
 * Vehicle Information Screen
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
} from 'react-native';
import t from 'tcomb-form-native';

// Local Imports
import AppStyles from '../styles';
import AppConfig from '../config';
import UpdateMileage from '../screens/UpdateMileage';
import Button from '../components/button';
import CustomerService from '../services/CustomerService';
import ListObject from '../components/ListObject';
import Loading from '../components/loading';

class VehicleInformation extends Component {
  constructor(props) {
    super(props);
    const currentVehicleData = { ...props.vehicle.vehicleData };
    delete currentVehicleData.owner;

    this.getCustomer = this.getCustomer.bind(this);

    this.state = {
      currentMessage: 'Actualice el kilometraje para continuar',
      mileageEdited: false,
      vehicleForm: t.struct({
        mileage: t.Number,
        model: t.Number,
        brand: t.String,
        cyl: t.Number,
        color: t.String,
        service: t.String,
        class: t.String,
        line: t.String,
        chassis: t.String,
        vin: t.String,
        capacity: t.Number,
        serie: t.String,
        motor: t.String,
        fuel: t.String,
        bodyWork: t.maybe(t.String),
        linea: t.String,
      }),
      options: {
        fields: {
          model:     { editable: false, label: 'Modelo' },
          brand:     { editable: false, label: 'Marca' },
          cyl:       { editable: false, label: 'Cilindraje' },
          color:     { editable: false, label: 'Color' },
          service:   { editable: false, label: 'Servicio' },
          class:     { editable: false, label: 'Clase' },
          line:      { editable: false, label: 'Linea' },
          chassis:   { editable: false, label: 'Chasis' },
          vin:       { editable: false, label: 'Numero VIN' },
          capacity:  { editable: false, label: 'Capacidad' },
          serie:     { editable: false, label: 'Serie' },
          motor:     { editable: false, label: 'Motor' },
          fuel:      { editable: false, label: 'Combustible' },
          bodyWork:  { editable: false, label: 'Carrocería' },
          linea:     { editable: false, label: 'Linea' },
          mileage:   { editable: true, label: 'Kilometraje' },
        },
      },
      vehicleValues: currentVehicleData,
      loading: false,
    };
  }

  /*
    TODO:
    * Create a function to generate the form structure based in the object definition
  */

  /* VehicleInformation() {
    const originalVehicle = {
      ...this.props.vehicle,
      vehicleData: {
        ...this.state.vehicleValues,
        owner: this.props.vehicle.vehicleData.owner
      },
    };
    const token = this.props.auth().token;

    VehicleService.update(originalVehicle, token)
      .then(res => res.json())
      .then(vehicle => CustomerService.findById(vehicle.customer.localId, token))
      .then(res => res.json())
      .then(customer => this.setState({ customer }))
      .catch(err => console.log('Error updating vehicle', err));
  }

  validateMileage() {
    const value = this.form.getValue();
    if (value) {
      const currentMileage = value.mileage;
      const originalMileage = this.props.vehicle.vehicleData.mileage; 

      const validMileage = currentMileage >= originalMileage;

      this.setState({
        mileageEdited: validMileage,
      });

      if (validMileage) {
        this.state.vehicleValues.mileage = currentMileage;
        this.VehicleInformation();
      }
    }
  }
  */

  getCustomer() {
    const token = this.props.auth().token;
    const { vehicle } = this.props;
    this.setState({ loading: true });

    CustomerService.findById(vehicle.customer.localId, token)
      .then(res => res.json())
      .then((customer) => {
        this.setState({ loading: false });
        this.nextScreen(customer);
      })
      .catch(err => console.log('[Error] - getCustomer:', err));
  }

  nextScreen(customer) {
    const { review, vehicle } = this.props;

    this.props.navigator.push({
      title: 'Actualizar Kilometraje',
      component: UpdateMileage,
      passProps: {
        ...this.props,
        review: {
          ...review,
          /*vehicle: {
            localId: vehicle._id,
            plate: vehicle.plate.number,
          },*/
          customer: vehicle.customer,
          cost: customer.payment.cost,
        },
      },
      index: 4,
    });
  }

  render() {
    const { loading } = this.state;
    return (
        !loading
        ? <View>
          <ScrollView
            style={styles.scroll}
            keyboardShouldPersistTaps
          >
            <Text style={[AppStyles.h1, AppStyles.centered, styles.vPad]}>Validar Vehículo</Text>
            <ListObject
              object={this.state.vehicleValues}
              fields={this.state.options.fields}
            />
            <View style={styles.button}>
              <Button
                text="Siguiente"
                onPress={this.getCustomer}
              />
            </View>
          </ScrollView>
        </View>
      : <Loading
        text="Procesando..."
      />
    );
    /*const Form = t.form.Form;
    return (
      <View>
        <ScrollView
          style={[styles.scrollView]}
          keyboardShouldPersistTaps
        >
          <View style={[AppStyles.paddingHorizontal, styles.formStyle]}>
            <Text style={[AppStyles.h4]}>{this.state.currentMessage}</Text>
            {this.generateButton()}
            <Form
              ref={(form) => { this.form = form; }}
              type={this.state.vehicleForm}
              options={this.state.options}
              value={this.state.vehicleValues}
            />
          </View>
        </ScrollView>
      </View>
    );*/
  }
}

export default VehicleInformation;

const styles = StyleSheet.create({
  scroll: {
    height: AppConfig.windowHeight - 65,
  },
  button: {
    alignSelf: 'stretch',
    paddingHorizontal: 10,
  },
  vPad: {
    paddingVertical: 10,
  },
});
