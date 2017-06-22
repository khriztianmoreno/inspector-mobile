import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  View,
  ToastAndroid,
} from 'react-native';
import t from 'tcomb-form-native';
import _ from 'lodash';

import VehicleForm from '../components/VehicleForm';
import AddContact from '../screens/AddContact';
import AppConfig from '../config';
import VehicleService from '../services/VehicleService';
import Loading from '../components/loading';

class AddVehicleScreen extends Component {
  constructor(props) {
    super(props);

    this.vehicle = t.struct({
      plate: t.String,
      model: t.Number,
      cyl: t.Number,
      mileage: t.Number,
      vin: t.String,
    });

    this.options = {
      fields: {
        plate: {
          label: 'Placa:',
          placeholder: 'ej. ABC123',
          placeholderTextColor: '#CCC',
          underlineColorAndroid: 'rgba(0, 0, 0, 0)',
          autoCapitalize: 'characters',
        },
        model: {
          label: 'Modelo:',
          placeholder: 'ej. 2016',
          placeholderTextColor: '#CCC',
        },
        cyl: {
          label: 'Cilindraje:',
          placeholder: 'ej. 2500',
          placeholderTextColor: '#CCC',
        },
        mileage: {
          label: 'Kilometraje:',
          placeholder: 'ej. 12000',
          placeholderTextColor: '#CCC',
        },
        vin: {
          label: 'VIN:',
          placeholder: 'ej. 2C3CDZBG9FH715819',
          placeholderTextColor: '#CCC',
          autoCapitalize: 'characters',
        },
      },
    };

    this.state = {
      loading: false,
      formValues: {
        plate: (props.plate && props.plate.toUpperCase()) || null,
        model: null,
        cyl: null,
        mileage: null,
        vin: null,
      },
    };

    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.nextStep = this.nextStep.bind(this);
  }

  generateVehicle(values, others, customer) {
    const vehicleFormat = {
      vehicleData: {
        model: 0,
        brand: null,
        class: null,
        cyl: 0,
        color: null,
        bodyWork: null,
        service: null,
        fuel: null,
        motor: null,
        serie: null,
        mileage: 0,
        line: null,
        capacity: 0,
        vin: null,
        owner: null,
      },
      plate: {
        origin: 'CO', // Harcoded
        number: null,
      },
      active: true,
      customer,
      documents: [],
      reviews: [],
    };

    let vehicleDataValues = _.omit(values, 'plate');
    vehicleDataValues = _.merge(vehicleDataValues, others);
    vehicleDataValues = { vehicleData: vehicleDataValues };
    const plate = {
      plate: { number: values.plate },
    };
    return _.merge(vehicleFormat, vehicleDataValues, plate);
  }

  nextStep(car) {
    this.props.navigator.replace({
      title: 'Agregar contacto',
      component: AddContact,
      passProps: {
        car,
        ...this.props,
        onSuccess: this.props.onSuccess,
      },
    });
  }

  onFormSubmit(form, { currentClass, brand, line }) {
    const token = this.props.auth().token;
    const customer = this.props.auth().sessionData.customer;
    const values = form.getValue();

    const selectValues = [
      {
        label: 'Clase',
        value: currentClass,
      },
      {
        label: 'Línea',
        value: line,
      },
      {
        label: 'Marca',
        value: brand,
      },
    ];

    const filled = currentClass !== null && line !== null && brand !== null;

    if (!filled) {
      const failItemsLabel = selectValues
        .filter(item => item.value === null)
        .map(field => field.label)
        .join(', ');

      Alert.alert('Error', `${failItemsLabel} son requeridos`);
    } else if (values && filled) {
      this.setState({ loading: true });
      const vehicle = this.generateVehicle(values, { class: currentClass, brand, line }, customer);
      VehicleService.create(vehicle, token)
        .then((res) => {
          this.validateCarCreation(res);
          // this.setState({ loading: false });
        })
        .catch((err) => {
          this.setState({ loading: false });
          ToastAndroid.show(err.toString(), ToastAndroid.SHORT);
        });
    }
  }

  updateForm(newValues) {
    this.setState({
      formValues: newValues,
    });
  }

  validateCarCreation(response) {
    const wasCreated = response.ok;
    const body = response._bodyText ? JSON.parse(response._bodyText) : '';
    if (wasCreated) {
      this.nextStep(body);
    } else {
      switch (body.code) {
      case 11000: {
        ToastAndroid.show('¡Vehículo ya existe!', ToastAndroid.SHORT);
        break;
      }
      default: {
        ToastAndroid.show(`Error: ${body.errmsg}`, ToastAndroid.SHORT);
      }
      }
    }
  }

  renderForm() {
    return (
      <VehicleForm
        options={this.options}
        type={this.vehicle}
        onSubmit={this.onFormSubmit}
        formValues={this.state.formValues}
        updateForm={newValues => this.updateForm(newValues)}
      />
    );
  }

  render() {
    const { loading } = this.state;
    return (
      loading
      ? <Loading
        text="Procesando..."
      />
      : this.renderForm()
    );
  }
}

export default AddVehicleScreen;
