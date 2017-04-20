import React, { Component, PropTypes } from 'react';
import { has } from '../utils/lodash';
import { I92List } from './../components/AggregatedResult/I92.js';

class I92Class {
  entries_list = (props) => {
    return( <I92List value={props.val} />);
  }

  i92Entry = (entry) => {
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

  processI92 = (agg_entry, raw_entry) => {
    if (raw_entry.event_type == 'Arrival'){
      const key = raw_entry.foreign_port + ' to ' + raw_entry.us_port;
      if (!has(agg_entry.i92_arrivals, key))
        agg_entry.i92_arrivals[key] = {};

      agg_entry.i92_arrivals[key][raw_entry.date] = this.i92Entry(raw_entry);
    }

    if (raw_entry.event_type == 'Departure'){
      const key = raw_entry.us_port + ' to ' + raw_entry.foreign_port;
      if (!has(agg_entry.i92_departures, key))
        agg_entry.i92_departures[key] = {};

      agg_entry.i92_departures[key][raw_entry.date] = this.i92Entry(raw_entry);
    }

    return agg_entry;
  }

  sortEntries = (entries) => {
    const ordered_ports = [];
    Object.keys(entries).sort().forEach(function(k) {
        let new_entry = {};
        let ordered_dates = [];
        Object.keys(entries[k]).sort().forEach(function(date) {
          let new_date_entry = {};
          new_date_entry[date] = entries[k][date];
          ordered_dates.push(new_date_entry);
        });
        new_entry[k] = ordered_dates;
        ordered_ports.push(new_entry);
      });
    return ordered_ports;
  }
}

export const I92 = new I92Class();