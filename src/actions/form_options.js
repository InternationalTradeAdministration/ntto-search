import fetch from 'isomorphic-fetch';
import { stringify } from 'querystring';
import { isEmpty, omit, values, has, map, uniq } from '../utils/lodash';
import { SET_FORM_OPTIONS } from 'constants';
import config from '../config.js';

const { i94_url, i92_url, spending_data_url, siat_url, apiKey } = config.api;

export function setFormOptions(countries_array, world_regions_array){
  let countries = map(countries_array, val => { 
    return optionObject(val);
  });
  let world_regions = map(world_regions_array, val => { 
    return optionObject(val); 
  });

  return {
    type: SET_FORM_OPTIONS,
    countries: countries,
    world_regions: world_regions,
  };
}

export function requestFormOptions(){
  return (dispatch) => {
    const urls = [i94_url, i92_url, spending_data_url, siat_url];
    const requests = values(urls).map( function(url){
      return fetch(`${url}?api_key=${apiKey}&size=1`)
    });
    return Promise.all(requests)
      .then(response => ( Promise.all(response.map( function(api_result){
        return api_result.json()
      }))))
      .then(json => dispatch(consolidateOptions(json)));
  }
}

function consolidateOptions(json_array){
  let countries = [];
  let world_regions = [];

  for (let index in json_array){
    let result = json_array[index];
    countries = countries.concat(map(result.aggregations.countries, obj => {
      return obj['key'];
    }));
    world_regions = world_regions.concat(map(result.aggregations.world_regions, obj => {
      return obj['key'];
    }));
  }
  countries = uniq(countries).sort();
  world_regions = uniq(world_regions).sort();

  return setFormOptions(countries, world_regions);
}

function optionObject(val){
  return {label: val, value: val}
}