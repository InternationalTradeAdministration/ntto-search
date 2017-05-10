import React, { Component, PropTypes } from 'react';
import { has, omit } from '../utils/lodash';
import { SpendingDataTable } from './../components/AggregatedResult/SpendingData.js';

class SpendingDataClass {
  entries_list = (props) => {
    return( <SpendingDataTable value={props.val} />);
  }

  processSpendingData = (agg_entry, raw_entry) => {
    agg_entry.spending_data[raw_entry.date] = omit(raw_entry, ['date', 'country', 'id', 'country_or_region', 'world_region']);
    return agg_entry;
  }
}

export const SpendingData = new SpendingDataClass();