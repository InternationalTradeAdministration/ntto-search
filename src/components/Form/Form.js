import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import {RadioGroup, Radio} from 'react-radio-group'
import FormMessages from 'redux-form-validation';
import {generateValidation} from 'redux-form-validation';

import countryList from '../../fixtures/countries';
import worldRegionsList from '../../fixtures/world_regions';
import './Form.scss';

 var validations = {
     startDate: {
       required: true
     },
    endDate: {
       required: true
     },
     selectOptions: {
      required: false
     },
    countries: {
      required: false
     },
    worldRegions: {
      required: false
     }
   };

const TextField = ({ description, field, label }) => (
  <div className="explorer__form__group">
    <label htmlFor={field.name}>{label}</label>
    {description ? <p>{description}</p> : null}
    <input type="text" className="explorer__form__input" id={field.name} {...field} />
  </div>
);
TextField.propTypes = {
  description: PropTypes.string,
  field: PropTypes.object.isRequired,
  label: PropTypes.string,
};

const SelectField = ({ description, field, label = 'Untitled', options, multi = false }) => (
  <div className="explorer__form__group">
    <label htmlFor={field.name}>{label}</label>
    {description ? <p>{description}</p> : null}
    <div>
      <Select
        {...field}
        options={options}
        multi={multi} autoBlur
        onBlur={() => field.onBlur(field.value)}
        joinValues = {true}
        delimiter = {','}
        simpleValue = {true}
      />
    </div>
  </div>
);
SelectField.propTypes = {
  description: PropTypes.string,
  field: PropTypes.object.isRequired,
  label: PropTypes.string,
  options: PropTypes.array.isRequired,
  multi: PropTypes.bool,
};

const DateField = ({ field }) => {
  return (
    <input type="month" className="explorer__form__input" id={field.name} {...field} />
  );
};
DateField.propTypes = {
  field: PropTypes.object.isRequired,
}

const DateRangeField = ({ description, label = 'Untitled', startDate, endDate }) => (
  <div className="explorer__form__group">
    <label>{label}</label>
    {description ? <p>{description}</p> : null}
    <DateField field={startDate} />
    <DateField field={endDate} />
  </div>
);
DateRangeField.propTypes = {
  description: PropTypes.string,
  endDate: PropTypes.object.isRequired,
  label: PropTypes.string,
  startDate: PropTypes.object.isRequired,
};

const CountriesField = ({field}) => (
  <SelectField
    field={field} label="All Countries" options={countryList} multi
    description="Choose one or more countries to search."
  />
)

const WorldRegionsField = ({field}) => (
  <SelectField
    field={field} label="ITA World Regions" options={worldRegionsList} multi
    description="Choose one or more world regions to search."
  />
)


class Form extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {selectField: 'countries'};
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    this.setState({selectField: value});
  }

  render() {
    const { 
      fields: { selectOptions, countries, worldRegions, startDate, endDate }, 
      handleSubmit 
    } = this.props;

    var selectField;
    if (selectOptions.value == 'countries' || selectOptions.value === ''){
      validations.countries = {required: true}
      validations.worldRegions = {required: false}
      selectField = <CountriesField field={countries} />;
    }
    else if (selectOptions.value == 'worldRegions'){
      validations.countries = {required: false}
      validations.worldRegions = {required: true}
      selectField =  <WorldRegionsField field={worldRegions}/>;
    }

    return (
      <form className="explorer__form" onSubmit={handleSubmit}>
        <fieldset>
          <div className="explorer__form__group">
            <label>Select an option to search by Countries or World Regions</label>
            <RadioGroup name='selectOptions' selectedValue={selectOptions.value ? selectOptions.value : 'countries'}>
              <Radio {...selectOptions} value="countries" /> Countries
              <Radio {...selectOptions} value="worldRegions" /> World Regions
            </RadioGroup>
          </div>

          {selectField}

          <FormMessages field={countries} >
               <p className="validation-error" when="required">
                 Must enter at least one country.
               </p>
          </FormMessages>
          <FormMessages field={worldRegions} >
               <p className="validation-error" when="required">
                 Must enter at least one world region.
               </p>
          </FormMessages>

          <DateRangeField
            startDate={startDate}
            endDate={endDate}
            label="Date"
            description="Choose a range of months to filter arrivals data."
          />

          <FormMessages field={startDate} >
               <p className="validation-error" when="required">
                 Must enter a starting month.
               </p>
          </FormMessages>
          <FormMessages field={endDate} >
               <p className="validation-error" when="required">
                 Must enter an ending month.
               </p>
          </FormMessages>

          <div className="explorer__form__submit">
            <button className="explorer__form__submit-button pure-button pure-button-primary" onClick={handleSubmit}>
              <i className="fa fa-paper-plane" /> Generate Reports
            </button>
            <a className="explorer__form__advanced-link" href="https://sod-trade.cs32.force.com/i94_search">I-94 Arrivals Advanced Search</a>
          </div>

        </fieldset>
      </form>
    );
  }
}
Form.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'form',
  fields: ['selectOptions', 'countries', 'worldRegions', 'startDate', 'endDate'],
  ...generateValidation(validations)
})(Form);
