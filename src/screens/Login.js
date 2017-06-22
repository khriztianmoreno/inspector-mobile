/**
 * Login
 *
 * This screen will be allow the user to login in the server
 *
 */

'use strict';

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
  AsyncStorage,
} from 'react-native';

import t from 'tcomb-form-native';
import Button from '../components/button';
import AuthService from '../services/AuthService';
import Alerts from '../components/alerts';
// import SearchVehicle from './SearchVehicle';
import ReviewContainer from '../containers/review';

// Globals
import AppStyles from '../styles';
import AppConfig from '../config';

import { getTokenPayload, isTokenValid } from '../helpers/JwtHelper';

const LOGO_IMAGE = require('../images/logo_default.png');
// t.form.Form.stylesheet.controlLabel.normal.color = '#555';

class Login extends Component {
  constructor(props) {
    super(props);

    // Email Validation
    const isValidEmail = t.refinement(
      t.String, (email) => {
        const re = /^.+@.+\..+$/;
        return re.test(email);
      }
    );

    // Password validation
    const isValidPassword = t.refinement(
      t.String, (password) => {
        if (password.length < 6) return false;
        return true;
      }
    );

    this.formOptions = {
      fields: {
        email: {
          error: 'Debe ingresar un correo válido',
          label: ' Correo electrónico',
          onSubmitEditing: () => this.focusPassword(),
          placeholder: 'user@example.com',
          placeholderTextColor: '#CCC',
          underlineColorAndroid: AppConfig.primaryColor,
        },
        password: {
          error: 'La contraseña debe tener 6 o más caracteres',
          label: ' Contraseña',
          onSubmitEditing: () => this.cleanError(),
          placeholder: '******',
          placeholderTextColor: '#CCC',
          secureTextEntry: true,
          underlineColorAndroid: AppConfig.primaryColor,
        },
      },
    };

    this.state = {
      loginFields: t.struct({
        email: isValidEmail,
        password: isValidPassword,
      }),
      form_values: {
        email: null,
        password: null,
      },
      error: '',
      loading: false,
    };

    this.onFormChange = this.onFormChange.bind(this);
    this.cleanError = this.cleanError.bind(this);

    this.alreadyLoggedIn();
  }

  async alreadyLoggedIn() {
    try {
      const token = await AsyncStorage.getItem('token');
      // const email = await AsyncStorage.getItem('email');
      if (token) {
        const payload = getTokenPayload(token);
        if (isTokenValid(payload.exp)) {
          console.log('Valid token, loading...');
          this.props.userLogin(token);
          this.nextScreen();
        }
      }
    } catch (error) {
      // Error retrieving data
      console.log('Error getting data from Login Service', error);
    }
  }

  focusPassword() {
    this.cleanError();
    this.form.getComponent('password').refs.input.focus();
  }

  showError(msg) {
    this.setState({ error: msg });
  }

  onFormChange(value) {
    this.setState({
      form_values: value,
    });
  }

  cleanError() {
    this.setState({ error: '' });
  }

  loading(value) {
    this.setState({
      loading: value,
    });
  }

  nextScreen() {
    // const payload = getTokenPayload(token);

    this.props.navigator.replace({
      title: 'Buscar Vehículo',
      component: ReviewContainer,
      passProps: {
        /* ...this.props,
        review: {
          userReview: {
            localId: payload._id,
            name: payload.name,
          },
        },*/
      },
    });
  }

  renderButton() {
    if (this.state.loading) {
      return (
        <ActivityIndicator
          animating={this.state.loading}
          color={AppConfig.primaryColor}
          size="large"
        />
      );
    }

    return (
      <Button
        text={'Iniciar sesión'}
        onPress={() => this.login()}
      />
    );
  }

  login() {
    this.cleanError();

    const value = this.form.getValue();
    if (value) {
      this.loading(true);
      const email = value.email.trim();
      const pass = value.password;

      const login = AuthService.login(email, pass);
      login
        .then(res => res.json())
        .then((res) => {
          if (res.message) {
            this.showError(res.message);
            this.loading(false);
            // throw new Error(res.message);
          } else {
            this.cleanError();
            this.props.userLogin(res.token, email);
            this.nextScreen();
          }
        })
// .then(token => this.fetchUser(email, token, this.nextScreen.bind(this)))
        .catch((err) => {
          console.log(err);
          this.showError('Error por problemas de conexión');
          this.loading(false);
        });
    }
  }

  render() {
    const Form = t.form.Form;
    return (
      <View style={[AppStyles.container, styles.container]}>
        <View style={[styles.logoContainer]}>
          <Image
            source={LOGO_IMAGE}
            style={{ resizeMode: 'contain', width: 380, height: 160 }}
          />
        </View>

        <View style={[AppStyles.paddingHorizontal]}>
          <Form
            ref={(form) => { this.form = form; }}
            type={this.state.loginFields}
            options={this.formOptions}
            value={this.state.form_values}
            onChange={this.onFormChange}
          />
          <Alerts
            error={this.state.error}
          />
          {this.renderButton()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 15,
    paddingBottom: 20,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  logoContainer: {
    alignItems: 'center',
    padding: 30,
  },
});

export default Login;
