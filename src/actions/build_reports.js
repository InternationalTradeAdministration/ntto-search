import { values, capitalize, compact, has, map, snakeCase } from '../utils/lodash';
import { buildPortsValues } from './build_ports_values.js';

export function buildReports(agg_results, params){
  for (var key in agg_results) {
    var entry = Object.assign(agg_results[key], EMPTY_RECORD);
    var arrivals_keys = ["total_arrivals", "business_visa_arrivals", "pleasure_visa_arrivals", "student_visa_arrivals", "ports_arrivals"];

    entry = populateAdditionalFields(arrivals_keys, entry);
    
    if( has(entry, 'ports_arrivals')) // Add ports fields
      agg_results[key] = Object.assign(entry, buildPortsValues(entry.ports_arrivals));
  }
  return agg_results;
}

function populateAdditionalFields(arrivals_keys, entry){
  for (var i in arrivals_keys) {
    var arrivals_type = arrivals_keys[i];
    if (arrivals_type == "ports_arrivals") continue; // Ports fields need custom treatment
    var ordered = {};
    var sum = 0;
    // Sort amounts and add sum and percent change:
    if (has(entry, arrivals_type)){
      Object.keys(entry[arrivals_type]).sort().forEach(function(k) {
        ordered[k] = entry[arrivals_type][k];
        sum += ordered[k];
      });
      entry[arrivals_type] = ordered;
      entry[arrivals_type + "_sum"] = sum;
    }
  }
  return entry;
}

const EMPTY_RECORD = {
  total_arrivals_sum: "",
  business_visa_arrivals_sum: "",
  pleasure_visa_arrivals_sum: "",
  student_visa_arrivals_sum: "",
}