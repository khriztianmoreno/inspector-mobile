/**
 * Navbar Elements
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */

'use strict';

/* Setup ==================================================================== */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// App Globals
import AppStyles from '../styles';


/* Navbar Title Component =================================================== */
const NavbarTitle = (props) => {
  return (
    <Text style={[AppStyles.baseText, AppStyles.strong, styles.navbarTitle]}>{props.title || 'Loop'}</Text>
  );
};

NavbarTitle.propTypes = {
  title: React.PropTypes.string,
};

exports.Title = NavbarTitle;


/* Navbar Left Button Component ============================================= */
const NavbarLeftButton = (props) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      activeOpacity={0.7}
      style={styles.navbarButton}
      hitSlop={{ top: 7, right: 7, bottom: 7, left: 7 }}
    >
      <Icon name={props.icon} size={36} color="#FFF" />
    </TouchableOpacity>
  );
};

NavbarLeftButton.propTypes = {
  onPress: React.PropTypes.func.isRequired,
  icon: React.PropTypes.string.isRequired,
};

exports.LeftButton = NavbarLeftButton;

/* Styles =================================================================== */
const styles = StyleSheet.create({
  navbarButton: {
    left: 20,
    top: 4,
  },
  navbarTitle: {
    color: '#FFFFFF',
    bottom: 6,
    fontSize: 15,
  },
});
