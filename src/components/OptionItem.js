import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Local Imports
import AppConfig from '../config';

const OptionItem = ({ item, onPress }) => {
  return (
    <TouchableHighlight 
      onPress={() => onPress(item)}
      underlayColor="#DDD"
    >
      <View style={styles.container}>
        <View style={styles.icon}>
          <Icon name="local-activity" size={25} color={AppConfig.primaryColor} />
        </View>
        <Text style={styles.optionText}>{item.name}</Text>
      </View>      
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 10
  },
  optionText: {
    fontSize: 18,
  },
  icon: {
    paddingHorizontal: 15,
  }
});

export default OptionItem;