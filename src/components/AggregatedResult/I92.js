import { compact, get, isEmpty, map, startCase, pick } from '../../utils/lodash';
import React, { Component, PropTypes } from 'react';
import ReactList from 'react-list';
import moment from 'moment';
import Collapse from 'rc-collapse';
import 'rc-collapse/assets/index.css';

const I92List = ({value}) => {
  const items = compact(map(value, (entry) => {
    let key = Object.keys(entry)[0];
    return(
    <Collapse.Panel key={key} header={key}>
      <I92Table value={entry[key]} />
    </Collapse.Panel>
    );
  }));
  return (
    <div className="explorer__result-i92_amounts">
      <Collapse accordion={false}>
        {items}
      </Collapse>
    </div>
  );
};
I92List.propTypes = { value: PropTypes.array };

const I92Table = ({value}) => {
  const items = compact(map(value, (date_entry) => {
    let key = Object.keys(date_entry)[0];
    return(
    <tr key={key}>
      <td className="ports-cell">{moment(key).utc().format('MMM YYYY')}</td>
      <td className="ports-cell"> <I92Amounts value={date_entry[key]} /> </td>
    </tr>
    );
  }));
  if (isEmpty(items)) return null;

  return <table className="explorer__result-i92_table"><tbody>{items}</tbody></table>;
};
I92Table.propTypes = { value: PropTypes.array };

const I92Amounts = ({value}) => {
  const items = compact(map(value, (v, k) => {
    return(
    <li key={k}>
      {startCase(k)}:  {v}
    </li>
    );
  }));
  if (isEmpty(items)) return null;

  return <ul className="explorer__result-i92_amounts">{items}</ul>;
};
I92Amounts.propTypes = { value: PropTypes.object };

export {
  I92List
};