import React, { Component } from 'react';
import {
  Picker,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AppConfig from '../config';

const [PASS_FAIL, SELECT, TEXT] = ['PASS/FAIL', 'SELECT', 'TEXT'];

class InspectionItem extends Component {

  constructor(props) {
    super(props);

    this.state = {
      valueType: {
        switch: false,
        select: 0,
        text: null,
      },
      /*value: {
        value: 0,
      },
      switchValue: false,*/
    };

    this.onItemValueChange = this.onItemValueChange.bind(this);
    this.renderComment = this.renderComment.bind(this);
  }

  /**
   * Pending for remove direct mutability

  onItemValueChange({ value, localId }) {
    const { item, onValueChange, onPress } = this.props;

    this.setState({ value, localId });
    onValueChange(item.index, { value, localId });
    if (value === BAD_ITEM) {
      onPress(item);
    }
  }
  */

  onItemValueChange(value) {
    const { item, onValueChange } = this.props;
    const values = {
      [PASS_FAIL]: { switch: value },
      [SELECT]: { select: value },
      [TEXT]: { text: value },
    };

    if (values[item.type]) {
      this.setState({ valueType: values[item.type] });
      onValueChange(item, value);
    }
  }

  renderComment(comment) {
    const commentExists = (comment !== undefined) && (comment !== '');
    return (
      <Text style={commentExists ? styles.commented : styles.commentText}>
        {comment || 'Agrega un comentario'}
      </Text>
    );
  }

  renderItemOption(item) {
    switch (item.type) {
    case SELECT: {
      return (
        <Picker
          style={styles.picker}
          mode="dropdown"
          onValueChange={this.onItemValueChange}
          selectedValue={this.state.valueType.select}
        >
          {item.values.map((option, i) => {
            return (
              <Picker.Item
                key={i}
                label={option.name['es'].description}
                value={i}
              />
            );
          }) }
        </Picker>
      );
    }
    case PASS_FAIL: {
      return (
        <Switch
          onValueChange={this.onItemValueChange}
          value={this.state.valueType.switch}
        />
      );
    }
    default:
      return null;
    }
  }

  renderInput() {
    return (
      <View>
        <TextInput
          autoCorrect={false}
          onChangeText={text => this.onItemValueChange(text)}
          placeholder="Ingrese el valor del campo"
          placeholderTextColor="#CCC"
          returnKeyType="done"
          underlineColorAndroid="rgba(0, 0, 0, 0)"
          value={this.state.valueType.text}
          style={styles.input}
        />
      </View>
    );
  }


  render() {
    const { item } = this.props;
    const isTypeText = item.type === TEXT;
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.props.onPress} style={styles.leftSide}>
          <Text style={styles.text}>{item.name['es'].description}</Text>
          {
            isTypeText
            ? this.renderInput()
            : this.renderComment(item.comment)
          }
          <View style={styles.category}>
            <View style={[styles.circle, { backgroundColor: item.category.color }]} />
            <Text style={styles.categoryText}>{item.category.description}</Text>
          </View>
        </TouchableOpacity>
        {
          !isTypeText && (
            <View style={styles.rightSide}>
              {this.renderItemOption(item)}
            </View>
          )
        }
      </View>

    );
  }
}

InspectionItem.propTypes = {
  item: React.PropTypes.object,
  onValueChange: React.PropTypes.func,
  onPress: React.PropTypes.func,
};

const padding = 5;

const styles = StyleSheet.create({
  container: {
    height: 100,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderColor: '#EFEFEF',
    borderBottomWidth: 1.5,
  },
  text: {
    fontSize: 16,
  },
  category: {
    backgroundColor: '#EEE',
    paddingVertical: 4,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 12,
  },
  commentText: {
    fontSize: 12,
    color: '#CCC',
    fontStyle: 'italic',
  },
  commented: {
    fontSize: 12,
    color: '#555',
    fontStyle: 'italic',
  },
  leftSide: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingVertical: padding,
    paddingHorizontal: padding,
    // width: AppConfig.windowWidth * 0.65,
    flex: 1,
  },
  rightSide: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: padding,
    paddingHorizontal: padding,
    width: AppConfig.windowWidth * 0.35,
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 3,
  },
  picker: {
    width: (AppConfig.windowWidth * 0.35) - (padding * 2),
    color: '#666',
  },
  input: {
    color: '#555',
    height: 40,
    textAlign: 'right',
  },
});


export default InspectionItem;
