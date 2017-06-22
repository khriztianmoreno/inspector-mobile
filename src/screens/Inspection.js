/**
 * Inspection screen
 *
 *
 */

import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Text,
  ListView,
  Modal,
  Alert,
} from 'react-native';
import dimissKeyboard from 'react-native-dismiss-keyboard';

// Local Imports
import AppConfig from '../config';
import InspectionHelper from '../helpers/InspectionHelper';
import InspectionItem from '../components/InspectionItem';
import ReviewModal from '../components/ReviewModal';
import ImageService from '../services/ImageService';
import ReviewService from '../services/ReviewService';
import ReviewContainer from '../containers/review';
import VehicleService from '../services/VehicleService';

class Inspection extends Component {
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    this.inspectionHelper = new InspectionHelper(props.inspection);
    this.result = this.inspectionHelper.getInspection();
    this.closeModal = this.closeModal.bind(this);
    this.saveItem = this.saveItem.bind(this);
    this.onItemValueChange = this.onItemValueChange.bind(this);
    this.processReview = this.processReview.bind(this);
    this.imagesCallback = this.imagesCallback.bind(this);
    this.validateFinishReview = this.validateFinishReview.bind(this);
    this.finishReview = this.finishReview.bind(this);
    this.addReviewToVehicle = this.addReviewToVehicle.bind(this);

    this.images = [];
    this.resolveCarImages();

    this.state = {
      dataSource: this.ds.cloneWithRows([]),
      filterValue: '',
      modalState: false,
      currentItem: {},
    };
  }

  /**
   * Pending for update, direct mutation problem

  onItemValueChange(index, props) {
    this.inspectionHelper.updateItem(index, props);
  }
  */

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        dataSource: this.ds.cloneWithRows(this.inspectionHelper.getAllItems()),
      });
    }, 500);
  }

  onItemValueChange(item, value) {
    if (item.type === 'PASS/FAIL') {
      item.value = !value ? item.values[0].name['es'].description : item.values[1].name['es'].description;
    } else if (item.type === 'SELECT') {
      item.value = item.values[value].name['es'].description;
      item.localId = item.values[value].code;
    } else {
      item.value = value || null;
    }
  }

  resolveCarImages() {
    const { isPreventive, images } = this.props;

    if (isPreventive) {
      Promise.all(this.props.images.promises)
        .then((resolvedImages) => {
          resolvedImages.map(image => this.images.push(image.image_url));
        })
        .catch(err => console.log('Error uploading front and back pictures:', err));
    }
  }

  filterItems() {
    const filteredItems = this.inspectionHelper.getItemsByName(this.state.filterValue);
    const newList = { ...filteredItems };

    this.setState({
      dataSource: this.ds.cloneWithRows(newList),
    });
  }

  closeModal() {
    this.setState({
      modalState: false,
    });
    this.filterItems();
  }

  selectItem(item) {
    this.setState({
      currentItem: item,
      modalState: true,
    });
  }

  saveItem(item, comment, picture) {
    const token = this.props.auth().token;
    if (picture.path !== '' && picture.path !== undefined) {
      item.picture = {
        path: picture.path,
        promise: ImageService.uploadFromBase64Ref(picture.path, token, item.id),
      };
    }
    item.comment = comment;
  }

  filterByName(name) {
    const filteredItems = this.inspectionHelper.getItemsByName(name);
    const newList = { ...filteredItems };

    this.setState({
      dataSource: this.ds.cloneWithRows(newList),
      filterValue: name,
    });
  }

  addReviewToVehicle(vehicle, review) {
    console.log('Review:', review);
    const token = this.props.auth().token;

    const vehicleUpdated = { ...vehicle };
    const vehicleReview = {
      type: review.type,
      localId: review._id,
      mileage: vehicle.vehicleData.mileage,
    };

    vehicleUpdated.reviews.push(vehicleReview);
    // console.log(vehicleUpdated);
    VehicleService.update(vehicleUpdated, token)
      .then(res => console.log('Saving review in vehicle:', res))
      .catch(err => console.log('Error adding review to vehicle:', err));
  }

  imagesCallback() {
    const token = this.props.auth().token;
    const images = this.images || [null, null];
    const { vehicleUpdated } = this.props;
    const { customer, vehicle, userReview, cost } = this.props.review;
    console.log('Vehicle:', vehicle);
    console.log('Vehicle updated:', vehicleUpdated);
    vehicle.mileage = vehicleUpdated.vehicleData.mileage;
    const review = this.inspectionHelper.generateReview(customer, vehicle, userReview, cost, images);

    ReviewService.create(review, token)
      .then(res => res.json())
      .then(reviewResult => this.addReviewToVehicle(vehicleUpdated, reviewResult))
      .then(res => console.log('Last step:', res))
      .catch(err => console.log(err));
  }

  finishReview() {
    Alert.alert('Estado revisión', 'Revisión finalizada con éxito');
    this.processReview();
    this.props.navigator.resetTo({
      title: 'Buscar placa',
      component: ReviewContainer,
      passProps: { },
    });
  }

  validateFinishReview() {
    Alert.alert(
      'Finalizar revisión',
      'Está seguro que desea terminar la revisión?',
      [
        { text: 'No, volver' },
        { text: 'Sí, guardar', onPress: this.finishReview },
      ]
    );
  }

  processReview() {
    this.inspectionHelper.uploadPictures(this.imagesCallback);
  }

  render() {
    return (
      <View>
        <Modal
          animationType={'slide'}
          onRequestClose={this.closeModal}
          transparent
          visible={this.state.modalState}
        >
          <ReviewModal
            item={this.state.currentItem}
            closeModal={this.closeModal}
            onSave={this.saveItem}
          />
        </Modal>
        <ScrollView
          style={[styles.scroll, styles.mainContainer]}
          keyboardShouldPersistTaps
        >
          <View style={[styles.topBar]}>
            <TextInput
              placeholder={'Buscar por categoría o elemento'}
              placeholderTextColor="#BDBDBD"
              style={styles.search}
              selectionColor={AppConfig.primaryColor}
              underlineColorAndroid={'#AAA'}
              returnKeyType="search"
              value={this.state.filterValue}
              onChangeText={newText => this.filterByName(newText)}
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={this.validateFinishReview}
            >
              <Text style={styles.buttonText}>GUARDAR</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.itemList]}>
            <ListView
              dataSource={this.state.dataSource}
              enableEmptySections
              initialListSize={5}
              pageSize={2}
              renderRow={item => (
                <InspectionItem
                  onPress={() => this.selectItem(item)}
                  item={item}
                  onValueChange={this.onItemValueChange}
                />)
              }
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    flexDirection: 'column',
  },
  scroll: {
    height: AppConfig.windowHeight - 65,
  },
  topBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 100,
    backgroundColor: '#FAFAFA',
  },
  search: {
    marginHorizontal: 5,
    width: AppConfig.windowWidth * 0.7,
    fontSize: 16,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: AppConfig.windowWidth * 0.25,
    backgroundColor: AppConfig.primaryColor,
    borderRadius: 3,
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    color: '#FFF',
  },
  itemList: {
    borderColor: '#CCC',
    paddingVertical: 10,
  },
});

export default Inspection;
