import React, { Component, PropTypes } from 'react';
import { has } from '../utils/lodash';
import { SiatTable } from './../components/AggregatedResult/Siat.js';

class SiatClass {
  entries_list = (props) => {
    return( <SiatTable value={props.val} />);
  }

  processSiat = (agg_entry, raw_entry) => {
    if (!has(agg_entry.siat_data, raw_entry.date)) agg_entry.siat_data[raw_entry.date] = {};
    if (!has(agg_entry.siat_data[raw_entry.date], raw_entry.question)) {
      agg_entry.siat_data[raw_entry.date][raw_entry.question] = { group: raw_entry.group, number_of_respondents: raw_entry.number_of_respondents, results: []};
    }
    agg_entry.siat_data[raw_entry.date][raw_entry.question].results.push({answer: raw_entry.answer, percentage_or_value: raw_entry.percentage_or_value})
    return agg_entry;
  }
}

export const Siat = new SiatClass();