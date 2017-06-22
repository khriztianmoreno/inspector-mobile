/**
 * List Object Component
 * Render a list based in key value object
 */

import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import AppConfig from '../config';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderColor: 'rgba(204, 204, 204, 0.2)',
    borderBottomWidth: 1,
  },
  key: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  value: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#BBB',
  },
});

const ListItem = ({ name, value }) => {
  return (
    <View style={styles.item}>
      <Text style={styles.key}>{name}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const ListObject = ({ object, fields }) => {
  return (
    <View style={styles.container}>
      {Object.keys(object)
        .map((key, i) => <ListItem key={i} name={fields[key].label} value={object[key]} />)
      }
    </View>
  );
};

export default ListObject;
