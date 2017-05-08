import 'babel-polyfill';
import { SET_FORM_OPTIONS } from 'constants';

export function form_options(state = {
  countries: [],
  worldRegions: []
}, action) {
  switch (action.type) {
  case SET_FORM_OPTIONS:
    return Object.assign({}, state, {
      countries: action.countries,
      worldRegions: action.world_regions
    });
  default:
    return state;
  }
}