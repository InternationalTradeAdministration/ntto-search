import { values, capitalize, compact, has, map } from '../utils/lodash';

export function buildAggResults(raw_results, agg_results, params) {

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
      if (k == 'i94'){
        agg_results[key].total_arrivals[entry.date] = entry.total_arrivals;
        if ( entry.business_visa_arrivals != null )
          agg_results[key].business_visa_arrivals[entry.date] = entry.business_visa_arrivals;
        if ( entry.pleasure_visa_arrivals != null )
          agg_results[key].pleasure_visa_arrivals[entry.date] = entry.pleasure_visa_arrivals;
        if ( entry.student_visa_arrivals != null )
          agg_results[key].student_visa_arrivals[entry.date] = entry.student_visa_arrivals;
        if ( entry.ports_arrivals.length > 0 )
          agg_results[key].ports_arrivals[entry.date] = entry.ports_arrivals;
      }

      if (k == 'i92'){
        if (entry.event_type == 'Arrival'){
          if (!has(agg_results[key].i92_arrivals, entry.foreign_port + ' to ' + entry.us_port))
            agg_results[key].i92_arrivals[entry.foreign_port + ' to ' + entry.us_port] = {};

          agg_results[key].i92_arrivals[entry.foreign_port + ' to ' + entry.us_port][entry.date] = i92Entry(entry);
        }

        if (entry.event_type == 'Departure'){
          if (!has(agg_results[key].i92_departures, entry.us_port + ' to ' + entry.foreign_port))
            agg_results[key].i92_departures[entry.us_port + ' to ' + entry.foreign_port] = {};

          agg_results[key].i92_departures[entry.us_port + ' to ' + entry.foreign_port][entry.date] = i92Entry(entry);
        }
      }

    }
  }
  return agg_results;
}

function buildNewEntry(entry){
  var return_hash = {
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

  return return_hash;
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