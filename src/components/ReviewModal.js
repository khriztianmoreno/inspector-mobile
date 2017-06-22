import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  Image,
} from 'react-native';

import AppConfig from '../config';
import AppStyles from '../styles';
import Button from '../components/button';
import Icon from 'react-native-vector-icons/FontAwesome';
import Photo from '../components/Photo';

const [MODAL_CAMERA, MODAL_OPTIONS] = ['CAMERA_MODE', 'OPTIONS_MODE'];

const Picture = ({ image, onDelete, horizontalMargin, height, width }) => {
  const pictureStyles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      alignItems: 'center',
      marginHorizontal: horizontalMargin,
    },
    image: {
      width,
      height,
    },
    delete: {
      position: 'absolute',
      right: 0,
      top: 0,
    },
  });

  return (
    <View style={pictureStyles.container}>
      <Image
        style={pictureStyles.image}
        resizeMode={'cover'}
        source={{ uri: image }}
      />
      <TouchableHighlight
        style={pictureStyles.delete}
        onPress={() => onDelete(image)}
      >
        <Icon name="times" color="#CA0C0C" size={50} />
      </TouchableHighlight>
    </View>
  );
};

class ReviewModal extends Component {
  static propTypes = {
    item: React.PropTypes.object.isRequired,
    closeModal: React.PropTypes.func.isRequired,
    onSave: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      comment: props.item.comment || '',
      picture: props.item.picture,
      modalType: MODAL_OPTIONS,
    };

    this.saveAndClose = this.saveAndClose.bind(this);
    this.updateText = this.updateText.bind(this);
    this.deleteImage = this.deleteImage.bind(this);
    this.pictureTaken = this.pictureTaken.bind(this);
  }

  saveAndClose() {
    const { comment, picture } = this.state;
    const { onSave, closeModal, item } = this.props;

    onSave(item, comment, picture);
    closeModal();
  }

  updateText(text) {
    this.setState({
      comment: text,
    });
  }

  deleteImage() {
    this.setState({
      picture: { path: '', promise: null },
    });
  }

  pictureRender() {
    const { path } = this.state.picture;
    if (path) {
      return (
        <Picture
          image={path}
          resizeMode={'cover'}
          onDelete={this.deleteImage}
          height={200}
          width={200}
        />
      );
    }

    return (
      <TouchableHighlight onPress={() => this.switchModal(MODAL_CAMERA)}>
        <Icon name="camera" size={180} color="#AAA" />
      </TouchableHighlight>
    );
  }

  switchModal(type) {
    this.setState({
      modalType: type,
    });
  }

  pictureTaken(path) {
    this.setState({
      picture: { path },
      modalType: MODAL_OPTIONS,
    });
  }

  renderModal() {
    const { item } = this.props;
    const inputFont = this.state.comment.length < 25 ? 22 : 18;

    if (this.state.modalType === MODAL_OPTIONS) {
      return (
        <View>
          <View style={[styles.main, AppStyles.paddingHorizontal]}>
            <Text style={[AppStyles.h2, AppStyles.centered]}>{item.name['es'].description}</Text>
            <View style={styles.comment}>
              <Text style={[styles.commentLabel]}>Comentarios</Text>
              <TextInput
                maxLength={150}
                onChangeText={this.updateText}
                placeholder={'Escribe tus notas acá!'}
                placeholderTextColor={'#CCC'}
                selectionColor={AppConfig.primaryColor}
                underlineColorAndroid={AppConfig.primaryColor}
                style={[styles.editComment, { fontSize: inputFont }]}
                value={this.state.comment}
              />
            </View>
            <View style={styles.pictureContainer}>
              {this.pictureRender()}
            </View>
          </View> 

          <View style={[styles.footer, AppStyles.paddingHorizontal]}>
            <Button
              text={'GUARDAR'}
              size={'medium'}
              onPress={this.saveAndClose}
            />
          </View>
        </View>
      );
    }

    return (
      <Photo
        title="Falla"
        onAcceptPicture={this.pictureTaken}
      />
    );
  }

  render() {
    return (
      <View style={[styles.container]}>
        <View style={styles.header}>
          <Text style={styles.textHeader}>{this.props.item.category.description}</Text>
        </View>
        {this.renderModal()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    height: 50,
    backgroundColor: AppConfig.primaryColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  textHeader: {
    fontSize: 22,
    fontWeight: 'normal',
    color: '#FFF',
  },
  main: {
    marginTop: 20,
  },
  comment: {
    paddingTop: 20,
    alignSelf: 'stretch',
  },
  commentLabel: {
    fontSize: 18,
  },
  editComment: {
    fontSize: 18,
  },
  pictureContainer: {
    marginTop: 20,
    backgroundColor: '#EEE',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },

  footer: {
    paddingTop: 20,
  },
});

export default ReviewModal;
