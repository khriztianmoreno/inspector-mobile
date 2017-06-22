import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import Autocomplete from './Autocomplete';
import AppConfig from '../config';

const AutocompleteModal = (props) => {
  const { item, closeModal, data, id, openModal, chooseAutocompleteValue, label } = props;
  return (
    <View>
      <Modal
        animation="slide"
        onRequestClose={() => {}}
        transparent={false}
        visible={item.edit}
      >
        <Autocomplete
          label={label}
          id={id}
          data={data}
          closeModal={() => closeModal(id)}
          chooseValue={(currentId, currentItem) =>
            chooseAutocompleteValue(currentId, currentItem)
          }
        />
      </Modal>
      <View style={styles.formRow}>
        <Text style={styles.labelText}>
          {label}
        </Text>
        <TouchableOpacity
          style={styles.select}
          onPress={() => {
            openModal(id);
          }}
        >
          {item.name
            ? <Text style={styles.normalText}>{item.name}</Text>
            : <Text style={styles.clearText}>{'Elegir'}</Text>
          }
          <Icon name="arrow-drop-down" size={40} color={AppConfig.secondaryColor} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  select: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  clearText: {
    fontSize: 17,
    color: '#CCC',
  },
  normalText: {
    fontSize: 17,
    color: '#555',
  },
  labelText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#555',
  },
  formRow: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    marginBottom: 15,
  },
});

export default AutocompleteModal;
