import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
} from 'react-native';
import t from 'tcomb-form-native';
import _ from 'lodash';
import Button from './button';
import AutocompleteModal from './AutocompleteModal';
import SystemValuesService from '../services/SystemValuesService';
import Loading from './loading';

const Form = t.form.Form;

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
stylesheet.controlLabel.normal.paddingTop = 6;
stylesheet.controlLabel.normal.color = '#555';

class VehicleForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      class: {
        name: null,
        value: null,
        edit: false,
      },
      brand: {
        name: null,
        value: null,
        edit: false,
      },
      line: {
        name: null,
        value: null,
        edit: false,
      },
      classesData: null,
      brandsData: null,
      linesData: null,
    };

    this.newOptions = _.merge(props.options, { stylesheet });
  }

  componentDidMount() {
    SystemValuesService.fetchBrands()
      .then(res => res.json())
      .then((brands) => {
        const updatedBrands = brands[0].values.map(brand => ({ name: brand, id: brand }));
        return updatedBrands;
      })
      .then(brands => this.setState({ brandsData: brands }))
      .catch(console.log);

    SystemValuesService.fetchClasses()
      .then(res => res.json())
      .then((classes) => {
        const updatedClasses = classes[0].values.map(item => ({ name: item, id: item }));
        return updatedClasses;
      })
      .then(classes => this.setState({ classesData: classes }))
      .catch(console.log);

    SystemValuesService.fetchLines()
      .then(res => res.json())
      .then((lines) => {
        const updatedLines = lines[0].values.map(line => ({ name: line, id: line }));
        return updatedLines;
      })
      .then(lines => this.setState({ linesData: lines }))
      .catch(console.log);
  }

  closeModal(id) {
    switch (id) {
    case 'class': {
      this.setState(prevState => ({
        class: { ...prevState.class, edit: false },
      }));
      break;
    }
    case 'brand': {
      this.setState(prevState => ({
        brand: { ...prevState.brand, edit: false },
      }));
      break;
    }
    case 'line': {
      this.setState(prevState => ({
        line: { ...prevState.line, edit: false },
      }));
      break;
    }
    default:
    }
  }

  openModal(id) {
    switch (id) {
    case 'class': {
      this.setState(prevState => ({
        class: { ...prevState.class, edit: true },
      }));
      break;
    }
    case 'brand': {
      this.setState(prevState => ({
        brand: { ...prevState.brand, edit: true },
      }));
      break;
    }
    case 'line': {
      this.setState(prevState => ({
        line: { ...prevState.line, edit: true },
      }));
      break;
    }
    default:
    }
  }

  chooseAutocompleteValue(currentId, item) {
    const { id, name } = item;
    switch (currentId) {
    case 'class': {
      this.setState((prevState) => {
        const newId = id || prevState.class.id;
        const newName = name || prevState.class.name;
        return { class: { value: newId, name: newName } };
      });
      break;
    }
    case 'brand': {
      this.setState((prevState) => {
        const newId = id || prevState.class.id;
        const newName = name || prevState.class.name;
        return { brand: { value: newId, name: newName } };
      });
      break;
    }
    case 'line': {
      this.setState((prevState) => {
        const newId = id || prevState.class.id;
        const newName = name || prevState.class.name;
        return { line: { value: newId, name: newName } };
      });
      break;
    }
    default:
    }
  }

  submitForm() {
    const { onSubmit } = this.props;
    const { line, brand } = this.state;
    const currentClass = this.state.class;

    onSubmit(
      this.form,
      { currentClass: currentClass.value, line: line.value, brand: brand.value }
    );
  }

  renderForm() {
    const { options, type, formValues, updateForm } = this.props;
    const { line, brand } = this.state;
    // const { currentClass } = this.state.class;

    return (
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps
      >
        <Form
          ref={(form) => { this.form = form; }}
          options={options}
          type={type}
          value={formValues}
          onChange={newValues => updateForm(newValues)}
        />

        <AutocompleteModal
          id={'class'}
          item={this.state.class}
          closeModal={id => this.closeModal(id)}
          openModal={id => this.openModal(id)}
          data={this.state.classesData}
          chooseAutocompleteValue={(id, item) => this.chooseAutocompleteValue(id, item)}
          label="Clase"
        />
        <AutocompleteModal
          id={'brand'}
          item={this.state.brand}
          closeModal={id => this.closeModal(id)}
          openModal={id => this.openModal(id)}
          data={this.state.brandsData}
          chooseAutocompleteValue={(id, item) => this.chooseAutocompleteValue(id, item)}
          label="Marca"
        />
        <AutocompleteModal
          id={'line'}
          item={this.state.line}
          closeModal={id => this.closeModal(id)}
          openModal={id => this.openModal(id)}
          data={this.state.linesData}
          chooseAutocompleteValue={(id, item) => this.chooseAutocompleteValue(id, item)}
          label="Linea"
        />
        <Button
          text={'Crear'}
          onPress={() => this.submitForm()}
        />
      </ScrollView>
    );
  }

  render() {
    const { classesData, linesData, brandsData } = this.state;
    const ready = classesData !== null && linesData !== null && brandsData !== null;
    return ready ? this.renderForm() : <Loading text={'Cargando información'} />;
  }
}

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

export default VehicleForm;
