/**
 * Photo Component
 * Instagram like component for capture a picture and cancel or accept that picture
 */

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import Camera, { constants } from 'react-native-camera';
import Icon from 'react-native-vector-icons/FontAwesome';

import AppConfig from '../config';
// import RNFS from 'react-native-fs';

const [CAMERA, PICTURE] = [0, 1];
const FLASH_ON_ICON = require('../images/icons/flash_on_white.png');
const FLASH_OFF_ICON = require('../images/icons/flash_off_white.png');
const CAMERA_ICON = require('../images/icons/shot.png');

class Photo extends Component {
  static propTypes = {
    onAcceptPicture: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.switchFlash = this.switchFlash.bind(this);
    this.captureImage = this.captureImage.bind(this);
    this.rejectImage = this.rejectImage.bind(this);
    this.notifyAcceptedImage = this.notifyAcceptedImage.bind(this);

    this.state = {
      camera: {
        flashMode: constants.FlashMode.off,
      },
      picturePath: '',
      showMode: CAMERA,
    };
  }

  // Property for the flash icon
  flashIcon() {
    let icon;
    const { on, off } = constants.FlashMode;
    switch (this.state.camera.flashMode) {
    case on: {
      icon = FLASH_ON_ICON;
      break;
    }
    case off: {
      icon = FLASH_OFF_ICON;
      break;
    }
    default: {
      icon = FLASH_OFF_ICON;
    }
    }
    return icon;
  }

  // Switch view between CAMERA and PHOTO
  switchShowMode(path) {
    this.setState({
      showMode: this.state.showMode === CAMERA ? PICTURE : CAMERA,
      picturePath: path || '',
    });
  }

  // Switch between flash modes
  switchFlash() {
    let newFlashMode;
    const { on, off } = constants.FlashMode;

    switch (this.state.camera.flashMode) {
    case on: {
      newFlashMode = off;
      break;
    }
    case off: {
      newFlashMode = on;
      break;
    }
    default:
      newFlashMode = off;
    }

    this.setState({
      camera: {
        ...this.state.camera,
        flashMode: newFlashMode,
      },
    });
  }

  /**
   * TODO: Pending implementation of delete photo due Android Document Directory restriction
|  */

  // Capture the photo
  captureImage() {
    this.camera.capture()
      .then((res) => {
        this.switchShowMode(`data:image/jpeg;base64,${res.data}`);
      })
      .catch(err => console.log('Camera photo error:', err));
  }

  // User accepts the image
  notifyAcceptedImage() {
    this.props.onAcceptPicture(this.state.picturePath);
  }

  // If the user does not like the image
  rejectImage() {
    this.switchShowMode();
    // this._deleteCurrentPhoto();
  }

  // Render photo View or Camera view
  renderImageView() {
    if (this.state.showMode === CAMERA) {
      return (
        <Camera
          ref={(cam) => { this.camera = cam; }}
          style={styles.previewContainer}
          flashMode={this.state.camera.flashMode}
          aspect={constants.Aspect.fill}
          captureQuality="medium"
          captureTarget={Camera.constants.CaptureTarget.memory}
        >

          <View style={styles.cameraUtils}>
            <TouchableOpacity onPress={this.switchFlash}>
              <Image source={this.flashIcon()} />
            </TouchableOpacity>
          </View>
        </Camera>
      );
    }
    return (
      <Image
        source={{ uri: this.state.picturePath }}
        resizeMode="cover"
        style={styles.previewContainer}
      />
    );
  }

  // Render panel for camera or panel for captured picture
  renderPanel() {
    if (this.state.showMode === CAMERA) {
      return (
        <View style={[styles.panelCamera]}>
          <TouchableHighlight
            activeOpacity={0.15}
            onPress={this.captureImage}
            style={[styles.iconSize]}
            underlayColor={AppConfig.primaryColor}
          >
            <Image
              source={CAMERA_ICON}
              style={[styles.iconSize]}
            />
          </TouchableHighlight>
        </View>
      );
    }
    return (
      <View style={[styles.panelPicture]}>
        <TouchableOpacity
          onPress={this.rejectImage}
          style={[styles.iconBack]}
        >
          <Icon name="times" size={60} color="red" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.notifyAcceptedImage}
          style={[styles.iconBack]}
        >
          <Icon name="check" size={60} color="green" />
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.preview}>
          {this.renderImageView() }
        </View>
        {this.renderPanel() }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  previewContainer: {
    justifyContent: 'flex-end',
    height: AppConfig.windowHeight * 0.6,
    width: AppConfig.windowWidth,
  },
  panelCamera: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: AppConfig.windowHeight * 0.3,
  },
  panelPicture: {
    flexDirection: 'row',
    height: AppConfig.windowHeight * 0.3,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: AppConfig.windowWidth * 0.2,
  },
  iconSize: {
    height: 70,
    width: 70,
    borderRadius: 35,
  },
  cameraUtils: {
    margin: 15,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  iconBack: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 35,
    width: 70,
    height: 70,
    borderColor: '#BDBDBD',
    borderWidth: 0.3,
  },
});

export default Photo;
