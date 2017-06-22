/**
 * Back Photo Screen
 */

import React, { Component } from 'react';
import Photo from '../components/Photo';
import CDService from '../services/CDService';
import Inspection from '../screens/Inspection';
import ImageService from '../services/ImageService';


class BackPhoto extends Component {
  constructor(props) {
    super(props);
    this.onAcceptPicture = this.onAcceptPicture.bind(this);
    this.picture = '';
  }

  onAcceptPicture(backPhoto) {
    this.picture = backPhoto;
    const token = this.props.auth().token;
    const pictures = [backPhoto, this.props.images.front];
    const responses = [];

    pictures.forEach((pic) => {
      const currentImage = ImageService.uploadFromBase64(pic, token);
      responses.push(currentImage.then(res => res.json()));
    });

    this.nextScreen(responses);
  }

  nextScreen(picturePromises) {
    this.props.navigator.replace({
      title: 'Revisión',
      component: Inspection,
      passProps: {
        ...this.props,
        images: {
          ...this.props.images,
          back: this.picture,
          promises: picturePromises,
        },
      },
    });
  }

  render() {
    return (
      <Photo
        onAcceptPicture={this.onAcceptPicture}
      />
    );
  }
}

export default BackPhoto;
