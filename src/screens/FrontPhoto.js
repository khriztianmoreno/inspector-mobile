/**
 * Back Photo Screen
 */

import React, { Component } from 'react';
import Photo from '../components/Photo';
import BackPhoto from '../screens/BackPhoto';

// Local imports

class FrontPhoto extends Component {

  onAcceptPicture(photoPath) {
    this.nextScreen(photoPath);
  }

  nextScreen(photoPath) {
    this.props.navigator.push({
      title: 'Foto Trasera',
      component: BackPhoto,
      passProps: {
        ...this.props,
        images: { front: photoPath },
      },
    });
  }

  render() {
    return (
      <Photo
        onAcceptPicture={imagePath => this.onAcceptPicture(imagePath)}
      />
    );
  }
}

export default FrontPhoto;
