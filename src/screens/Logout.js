import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import AppConfig from '../config';
import AppStyles from '../styles';
import Button from '../components/button';
import LoginContainer from '../containers/login';

class Logout extends Component {
  constructor(props) {
    super(props);

    this.logout = this.logout.bind(this);
    this.nextScreen = this.nextScreen.bind(this);

    const alreadyLogged = props.auth().logged;

    this.state = {
      logged: alreadyLogged,
    };
  }

  logout() {
    this.props.userLogout();
    this.nextScreen();
  }

  nextScreen() {
    this.props.navigator.resetTo({
      title: 'Iniciar sesión',
      component: LoginContainer,
      passProps: { },
    });
  }

  renderButton() {
    if (this.state.logged) {
      return (
        <Button
          text="Cerrar sesión"
          onPress={this.logout}
        />
      );
    }

    return (
      <Button
        text="Iniciar sesión"
        onPress={() => this.nextScreen()}
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderButton()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
  },
});

export default Logout;
