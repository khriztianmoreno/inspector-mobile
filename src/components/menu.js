/**
 * Menu Contents
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */

'use strict';

/* Setup ==================================================================== */
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';

// App Globals
import AppStyles from '../styles';
import AppConfig from '../config';

// Screens
import ReviewContainer from '../containers/review';
import ConfigContainer from '../containers/configuration';
import TodayReviewsContainer from '../containers/todayReviews';
import CreateVehicleFull from '../screens/CreateVehicleFull';

/* Component ==================================================================== */
class Menu extends Component {
  static propTypes = {
    navigate: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    // Initial state
    this.getAuthState = this.getAuthState.bind(this);

    this.state = {
      menu: [
        {
          title: 'Agregar revisión',
          menuTitle: 'Agregar revisión',
          component: ReviewContainer,
          icon: 'add-box',
          props: {
            passProps: { },
          },
        },
        {
          menuTitle: 'Agregar vehículo',
          title: 'Agregar vehículo',
          component: CreateVehicleFull,
          icon: 'directions-car',
          props: {
            passProps: {
              auth: this.getAuthState,
              userLogin: this.props.userLogin,
              insideReview: false,
            },
          },
        },
        {
          menuTitle: 'Mis revisiones',
          title: `Revisiones ${moment().format('MMM DD, YYYY')}`,
          component: TodayReviewsContainer,
          icon: 'playlist-add-check',
          props: {
            passProps: { },
          },
        },
        {
          title: 'Configuración',
          menuTitle: 'Configuración',
          component: ConfigContainer,
          icon: 'settings',
          props: {
            passProps: { },
          },
        },
      ],
    };
  }

  getAuthState() {
    return this.props.auth;
  }

  renderHeader() {
    return (
      <View style={styles.header}>
        <View style={styles.circle}>
          <Icon name={this.getAuthState().logged ? 'person' : 'help'} size={80} color="#CCC" />
        </View>
        {this.renderUserData()}
      </View>
    );
  }

  renderUserData() {
    const { logged } = this.props.auth;

    if (logged) {
      const customer = this.props.auth.sessionData.name;
      return (
        <Text style={[AppStyles.baseText, styles.user]}>{customer}</Text>
      );
    }
    return null;
  }

  render() {
    const { navigate } = this.props;
    const { menu } = this.state;

    // Build the actual Menu Items
    const menuItems = [];
    menu.map((item) => {
      const { title, component, props, menuTitle, icon } = item;

      menuItems.push(
        <TouchableHighlight key={'menu-item-'+title}
          onPress={() => navigate(title, component, props)}
          underlayColor="#DDD"
        >
          <View style={[styles.menuItem]}>
            <Icon name={icon} size={25} color={AppConfig.primaryColor} />
            <Text style={[AppStyles.baseText, styles.menuItem_text]}>{menuTitle}</Text>
          </View>
        </TouchableHighlight>
      );
    });

    return (
      <View style={[styles.menuContainer]}>
        {this.renderHeader()}
        <View style={[styles.menu]}>{menuItems}</View>
      </View>
    );
  }
}


/* Styles ==================================================================== */
const styles = StyleSheet.create({
  menuContainer: {
    flex: 1,
    left: 0,
    right: 0,
    backgroundColor: '#FAFAFA',
  },
  menu: {
    flex: 1,
    left: 0,
    right: 0,
    height: AppConfig.windowHeight,
    backgroundColor: '#FAFAFA',
    padding: 10,
  },
  menuItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingVertical: 10,
  },
  menuItem_text: {
    fontSize: 18,
    lineHeight: parseInt(18 + (18 * 0.5), 10),
    fontWeight: '500',
    marginLeft: 5,
    flex: 1,
    color: AppConfig.secondaryColor,
  },
  header: {
    padding: 10,
    alignItems: 'center',
    backgroundColor: AppConfig.secondaryColor,
  },
  circle: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  user: {
    textAlign: 'center',
    color: '#FAFAFA',
    marginTop: 10,
  },

});

/* Export Component ==================================================================== */
export default Menu;
