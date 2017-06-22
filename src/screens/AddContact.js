import React from 'react';
import {
  Alert,
  ToastAndroid,
} from 'react-native';
import t from 'tcomb-form-native';
import dimissKeyboard from 'react-native-dismiss-keyboard';
import ContactForm from '../components/ContactForm';
import VehicleService from '../services/VehicleService';
import Loading from '../components/loading';

class AddContact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      values: {
        name: null,
        email: null,
        dni: null,
        phone: null,
      },
    };

    this.options = {
      fields: {
        name: {
          label: 'Nombres',
          placeholder: 'ej. John Doe',
          placeholderTextColor: '#CCC',
          underlineColorAndroid: 'rgba(0, 0, 0, 0)',
        },
        email: {
          label: 'Correo',
          placeholder: 'ej. correo@example.com',
          placeholderTextColor: '#CCC',
          underlineColorAndroid: 'rgba(0, 0, 0, 0)',
        },
        dni: {
          label: 'Cédula',
          placeholder: 'ej. 1087200000',
          placeholderTextColor: '#CCC',
          underlineColorAndroid: 'rgba(0, 0, 0, 0)',
        },
        phone: {
          label: 'Teléfono',
          placeholder: 'ej. 7222222',
          placeholderTextColor: '#CCC',
          underlineColorAndroid: 'rgba(0, 0, 0, 0)',
        },
      },
    };

    this.type = t.struct({
      name: t.String,
      email: t.String,
      dni: t.Number,
      phone: t.Number,
    });
  }

  updateForm(values) {
    this.setState({
      values,
    });
  }

  submitForm(form) {
    const car = { ...this.props.car };
    const values = form.getValue();

    if (values) {
      const updatedValues = { ...values, email: values.email.trim() };
      this.setState({ loading: true });
      VehicleService.get(car._id, this.props.auth().token)
        .then(res => res.json())
        .then((currentCar) => {
          const updatedCar = { ...currentCar, contacts: [...currentCar.contacts, updatedValues] };
          return VehicleService.update(updatedCar, this.props.auth().token);
        })
        .then(res => this.validateCarUpdate(res))
        .catch(err => console.log('Error:', err));
    }
  }

  validateCarUpdate(response) {
    const wasCreated = response.ok;
    const body = response._bodyText ? JSON.parse(response._bodyText) : '';
    if (wasCreated) {
      dimissKeyboard();
      this.props.onSuccess(body);
    } else {
      this.setState({ loading: false });
      ToastAndroid.show('Error agregando contacto, valide el email', ToastAndroid.SHORT);
    }
  }

  render() {
    const { loading } = this.state;
    return (
      loading
      ? <Loading
        text="Procesando..."
      />
      : <ContactForm
        type={this.type}
        options={this.options}
        formValue={this.state.values}
        updateValue={values => this.updateForm(values)}
        submitForm={form => this.submitForm(form)}
      />
    );
  }
}

AddContact.propTypes = {
  car: React.PropTypes.object,
  onSuccess: React.PropTypes.func,
}

export default AddContact;
