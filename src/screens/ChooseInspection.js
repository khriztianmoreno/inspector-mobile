import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ListView,
  ScrollView,
} from 'react-native';

// Local Imports
import AppStyles from '../styles';
import AppConfig from '../config';
import InspectionService from '../services/InspectionService';
import VehicleInformation from '../screens/VehicleInformation';
import OptionItem from '../components/OptionItem';
import Loading from '../components/loading';

class ChooseInspection extends Component {
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });    
    this.nextScreen = this.nextScreen.bind(this);
    this.renderInspections = this.renderInspections.bind(this);

    InspectionService.getInspections(this.renderInspections, this.props.auth().token);

    this.state = {
      dataSource: this.ds.cloneWithRows([]),
      loading: true,
    };
  }

  nextScreen(item) {
    const review = { ...this.props.review };
    review.inspectionId = item._id;

    this.props.navigator.push({
      title: 'Información Vehículo',
      component: VehicleInformation,
      passProps: {
        ...this.props,
        review,
        inspection: item,
      },
      index: 3,
    });
  }

  // Service Callback
  renderInspections(result, error) {
    if (result) {
      this.setState({
        dataSource: this.ds.cloneWithRows(result),
        loading: false,
      });
    }
  }

  render() {
    return !this.state.loading
      ? (
        <ScrollView
          keyboardShouldPersistTaps
          style={styles.scroll}
        >
          <View style={styles.container}>
            <Text style={[AppStyles.h1, styles.vPad]}>Tipo de Revisión</Text>
            <View style={styles.list}>
              <ListView
                keyboardShouldPersistTaps
                dataSource={this.state.dataSource}
                enableEmptySections
                renderRow={(item, key) => <OptionItem item={item} key={key} onPress={this.nextScreen} />}
                renderSeparator={(sectionId, rowId) =>
                  <View
                    style={{ height: 1, backgroundColor: 'rgba(204, 204, 204, 0.2)' }} 
                  />
                }
              />
            </View>
          </View>
        </ScrollView>
      )
      : (
        <Loading
          text="Cargando inspeciones..."
        />
      );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  scroll: {
    height: AppConfig.windowHeight - AppConfig.navbarHeight,
  },
  list: {
    alignSelf: 'stretch',
  },
  vPad: {
    paddingVertical: 10,
  },
});

export default ChooseInspection;
