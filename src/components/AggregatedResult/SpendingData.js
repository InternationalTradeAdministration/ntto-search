import { compact, get, isEmpty, map, startCase, pick } from '../../utils/lodash';
import React, { Component, PropTypes } from 'react';
import moment from 'moment';

const SpendingDataTable = ({value}) => {
  const items = compact(map(value, (v, k) => {
    return(
    <tr key={k}>
      <td className="ports-cell">{moment(k, 'YYYY').utc().format('YYYY')}</td>
      <td className="ports-cell"> <SpendingDataAmountsList value={v} /> </td>
    </tr>
    );
  }));
  if (isEmpty(items)) return null;

  return <table className="explorer__result-spending_table"><tbody>{items}</tbody></table>;
};
SpendingDataTable.propTypes = { value: PropTypes.object };

const SpendingDataAmountsList = ({value}) => {
  const items = compact(map(value, (v, k) => {
    if (k.includes('percent'))
      v = (v * 100).toLocaleString() + "%";
    else
      v = v.toLocaleString();
    k = startCase(k);
    if (k.includes('Us'))
      k= k.replace('Us', 'US');
    return(
    <li key={k}>
      {k}:  {v}
    </li>
    );
  }));
  if (isEmpty(items)) return null;

  return <ul className="explorer__result-ports_amounts">{items}</ul>;
};
SpendingDataAmountsList.propTypes = { value: PropTypes.object };

export {
  SpendingDataTable
};