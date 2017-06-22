/**
 * Autocomplete Modal component
 */

import React from 'react';
import {
  ListView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AppConfig from '../config';
import Button from './button';

const ListItem = (props) => {
  const { data, onItemSelect } = props;
  const itemStyle = StyleSheet.create({
    container: {
      paddingVertical: 10,
      borderColor: '#EEE',
      flexDirection: 'row',
      marginHorizontal: 5,
    },
    title: {
      fontSize: 16,
      marginHorizontal: 5,
    },
  });

  return (
    <TouchableOpacity
      onPress={() => onItemSelect(data)}
      style={itemStyle.container}
    >
      <Icon name="toys" size={20} color={AppConfig.primaryColor} />
      <Text style={itemStyle.title}>{data.name}</Text>
    </TouchableOpacity>
  );
};

const Separator = (props) => {
  return (
    <View style={{ alignSelf: 'stretch', height: 1, backgroundColor: '#FAFAFA' }} />
  );
};

class Autocomplete extends React.Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      ds: ds.cloneWithRows([]),
      value: { name: null, value: null },
      currentValue: null,
    };
  }

  onItemSelect(data) {
    this.setState(prevState => ({
      value: data,
      currentValue: data.name.toUpperCase(),
      ds: prevState.ds.cloneWithRows([]),
    }));
  }

  filterItems(text) {
    const { data } = this.props;
    const regexp = new RegExp(`.*${text}.*`, 'i');
    let filteredItems = data.filter(item => regexp.test(item.name));

    if (text.length === 0) filteredItems = [];

    this.setState(prevState => ({
      currentValue: text,
      ds: prevState.ds.cloneWithRows(filteredItems),
    }));
  }

  selectAndSave() {
    const { closeModal, chooseValue, id } = this.props;
    chooseValue(id, this.state.value);
    closeModal(id);
  }

  render() {
    const border = this.state.ds.getRowCount() > 0 ? 1 : 0;
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', height: 60 }}>
          <TextInput
            autoCorrect={false}
            onChangeText={text => this.filterItems(text)}
            placeholder={`Ingrese la ${this.props.label} a buscar`}
            placeholderTextColor="#CCC"
            style={{ flex: 0.75, fontSize: 16, color: '#555' }}
            underlineColorAndroid={AppConfig.primaryColor}
            value={this.state.currentValue}
          />
          <View style={{ flex: 0.25, justifyContent: 'center' }}>
            <Button 
              text="Elegir"
              size="small"
              type="outlined"
              onPress={() => this.selectAndSave()}
            />
          </View>
        </View>
        <ScrollView
          contentContainerStyle={[styles.listContainer, { borderWidth: border }]}
          keyboardShouldPersistTaps
          showsVerticalScrollIndicator
          style={{ height: 250 }}
        >
          <ListView
            dataSource={this.state.ds}
            keyboardShouldPersistTaps
            enableEmptySections
            renderRow={(item) => {
              return (
                <ListItem
                  data={item}
                  onItemSelect={this.onItemSelect.bind(this)}
                />
              );
            }}
            renderSeparator={(sectionId, rowId) => {
              return <Separator key={`${sectionId}-${rowId}`} />;
            }}
          />
        </ScrollView>
      </View>
    );
  }
}

/* Autocomplete.propTypes = {
  data: React.PropTypes.arrayOf(React.PropTypes.object),
}; */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  scroll: {
    height: 250,
  },
  listContainer: {
    height: 250,
    borderColor: '#DDD',
    marginHorizontal: 3,
  },
});

export default Autocomplete;
