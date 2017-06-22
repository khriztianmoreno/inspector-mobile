/**
 * Side Bar Component
 * 
 * 
 */

import React, { Component } from 'react';
import {
  Animated,
  TouchableWithoutFeedback,
  StyleSheet,
  View,
  Text
} from 'react-native';

// Local imports
import AppConfig from '../config';


class SideBar extends Component {
  constructor(props) {
    super(props);
    this.isOpen = props.isOpen;
    
    this.animatedValue = new Animated.ValueXY({ x: -sideBarWidth, y: 0 });
  }

  componentWillReceiveProps(props) {
    if (props.isOpen !== this.isOpen) {
      this.animate(props.isOpen);
    }
  }

  getBarPosition() {
    return this.isOpen ? -sideBarWidth: 0;
  }

  animate(isOpen) {
    Animated.spring(this.animatedValue, {
      duration: 800,
      toValue: {
        x: this.getBarPosition(),
        y: 0
      }
    }).start();

    this.isOpen = isOpen;
    this.forceUpdate();
  }

  closeSideBar() {
    this.animate(false);
    this.props.onChange(false);
  }

  renderCounterSide() {
    if (this.isOpen) {
      return (
        <TouchableWithoutFeedback onPress={() => {
          this.closeSideBar();
        }}>
          <View style={sideStyles.counterSide} />
        </TouchableWithoutFeedback>
      );
    }
    return null;
  }


  render() {
    return (
      <View>
        <Animated.View style={[sideStyles.side, this.animatedValue.getLayout()]}>
          <Text>Revisiones</Text>
        </Animated.View>
        {this.renderCounterSide()}
        {this.props.children}
      </View>      
    );    
  }
}

const sideBarWidth = AppConfig.windowWidth * 0.65;
const counterSide = AppConfig.windowWidth * 0.35;

const sideStyles = StyleSheet.create({
  side: {
    position: 'absolute',
    width: sideBarWidth,
    left: -sideBarWidth,
    height: AppConfig.windowHeight - 48,
    backgroundColor: '#EFEFEF',
    zIndex: 10,
    padding: 10
  },
  counterSide: {
    position: 'absolute',
    right: 0,
    width: -counterSide,
    height: AppConfig.windowHeight - 48,
    backgroundColor: 'black',
    opacity: 0.25
  },
});

export default SideBar;