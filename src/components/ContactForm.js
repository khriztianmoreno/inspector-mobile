import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import t from 'tcomb-form-native';
import _ from 'lodash';
import Button from '../components/button';

const stylesheet = _.cloneDeep(t.form.Form.stylesheet);
stylesheet.formGroup.normal.flexDirection = 'row';
stylesheet.formGroup.error.flexDirection = 'row';

stylesheet.textbox.normal.flex = 1;
stylesheet.textbox.normal.textAlign = 'right';
stylesheet.textbox.normal.color = '#555';
stylesheet.textbox.normal.fontSize = 17;

stylesheet.textbox.error.textAlign = 'right';
stylesheet.textbox.error.color = '#555';
stylesheet.textbox.error.fontSize = 17;
stylesheet.textbox.error.flex = 1;

stylesheet.controlLabel.error.paddingTop = 6;
stylesheet.controlLabel.normal.paddingTop = 6;
stylesheet.controlLabel.normal.color = '#555';

const Form = t.form.Form;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});

const ContactForm = (props) => {
  const { type, options, formValue, updateValue, submitForm } = props;
  const newOptions = _.merge(options, { stylesheet });
  let currentForm;

  return (
    <View style={styles.container}>
      <Form
        ref={(form) => { currentForm = form; }}
        type={type}
        options={newOptions}
        value={formValue}
        onChange={newValue => updateValue(newValue)}
      />
      <Button 
        text="Guardar"
        size="medium"
        onPress={() => submitForm(currentForm)}
      />
    </View>
  );
};

ContactForm.propTypes = {
  type: React.PropTypes.func,
  options: React.PropTypes.object,
  formValue: React.PropTypes.object,
  updateValue: React.PropTypes.func,
  submitForm: React.PropTypes.func,
};

export default ContactForm;
