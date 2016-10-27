import { values, capitalize, compact, has, map } from '../utils/lodash';

export function buildAggResults(raw_results, agg_results, params) {
  // Iterate i94 and i92 sequentialy: 
  for (var k in raw_results) {
    var entries = raw_results[k].results;

    for (var i in entries){
      var entry = entries[i];
      var key = entry.country;
      if(!key) key = entry.i94_country_or_region;
      if(!key) key = entry.country_name;

      if ( !has(agg_results, key) ) {
        // Build initial agg entry if it doesn't exist yet:
        agg_results[key] = buildNewEntry(entry)
      }

      // Add date-amount k-v's to agg entry:
      if (k == 'i94')
        agg_results[key] = processI94(agg_results[key], entry);
      if (k == 'i92')
        agg_results[key] = processI92(agg_results[key], entry);
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

function processI92(agg_entry, raw_entry){
  if (raw_entry.event_type == 'Arrival'){
    if (!has(agg_entry.i92_arrivals, raw_entry.foreign_port + ' to ' + raw_entry.us_port))
      agg_entry.i92_arrivals[raw_entry.foreign_port + ' to ' + raw_entry.us_port] = {};

    agg_entry.i92_arrivals[raw_entry.foreign_port + ' to ' + raw_entry.us_port][raw_entry.date] = i92Entry(raw_entry);
  }

  if (raw_entry.event_type == 'Departure'){
    if (!has(agg_entry.i92_departures, raw_entry.us_port + ' to ' + raw_entry.foreign_port))
      agg_entry.i92_departures[raw_entry.us_port + ' to ' + raw_entry.foreign_port] = {};

    agg_entry.i92_departures[raw_entry.us_port + ' to ' + raw_entry.foreign_port][raw_entry.date] = i92Entry(raw_entry);
  }

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
    i92_departures: {}
  }
}

function i92Entry(entry){
  return {
    passenger_total: entry.passenger_total,
    citizens_total: entry.citizens_total,
    aliens_total: entry.aliens_total,
    us_flag_total: entry.us_flag_total,
    foreign_flag_total: entry.foreign_flag_total,
    scheduled_flights_total: entry.scheduled_flights_total,
    chartered_flights_total: entry.chartered_flights_total
  }
}