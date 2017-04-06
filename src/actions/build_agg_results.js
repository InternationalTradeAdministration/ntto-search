import { values, capitalize, compact, has, map, omit } from '../utils/lodash';
import { I92 } from './../apis/I92';
import { SpendingData } from './../apis/SpendingData';
import { Siat } from './../apis/Siat';

export function buildAggResults(raw_results, agg_results, params) {
  // Iterate i94 and i92 sequentialy: 
  for (let k in raw_results) {
    const entries = raw_results[k].results;

    for (let i in entries){
      const entry = entries[i];
      let key = entry.country;
      if(!key) key = entry.i94_country_or_region;
      if(!key) key = entry.country_name;
      if(!key) key = entry.country_or_region;

      if ( !has(agg_results, key) ) {
        // Build initial agg entry if it doesn't exist yet:
        agg_results[key] = buildNewEntry(entry)
      }
      // Add date-amount k-v's to agg entry:
      if (k == 'i94')
        agg_results[key] = processI94(agg_results[key], entry);
      if (k == 'i92')
        agg_results[key] = I92.processI92(agg_results[key], entry);
      if (k == 'spending_data')
        agg_results[key] = SpendingData.processSpendingData(agg_results[key], entry);
      if (k == 'siat'){
        agg_results[key] = Siat.processSiat(agg_results[key], entry);
      }
    }
  }
  return agg_results;
}

function processI94(agg_entry, raw_entry){
  agg_entry.total_arrivals[raw_entry.date] = raw_entry.total_arrivals;
  if ( raw_entry.business_visa_arrivals != null )
    agg_entry.business_visa_arrivals[raw_entry.date] = raw_entry.business_visa_arrivals;
  if ( raw_entry.pleasure_visa_arrivals != null )
    agg_entry.pleasure_visa_arrivals[raw_entry.date] = raw_entry.pleasure_visa_arrivals;
  if ( raw_entry.student_visa_arrivals != null )
    agg_entry.student_visa_arrivals[raw_entry.date] = raw_entry.student_visa_arrivals;
  if ( raw_entry.ports_arrivals.length > 0 )
    agg_entry.ports_arrivals[raw_entry.date] = raw_entry.ports_arrivals;

  return agg_entry;
}

function buildNewEntry(entry){
  return {
    i94_country_or_region: entry.i94_country_or_region,
    ntto_group: entry.ntto_group,
    country: entry.country,
    world_region: entry.world_region,
    total_arrivals: {},
    business_visa_arrivals: {},
    pleasure_visa_arrivals: {},
    student_visa_arrivals: {},
    ports_arrivals: {},
    i92_arrivals: {},
    i92_departures: {},
    spending_data: {},
    siat_data: {}
  }
}