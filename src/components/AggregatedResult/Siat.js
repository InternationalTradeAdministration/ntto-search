import { compact, get, isEmpty, map, startCase, pick } from '../../utils/lodash';
import React, { Component, PropTypes } from 'react';
import ReactList from 'react-list';
import moment from 'moment';
import Collapse from 'rc-collapse';
import 'rc-collapse/assets/index.css';

const SiatTable = ({value}) => {
  const items = compact(map(value, (v, k) => {
    return(
    <tr key={k}>
      <td className="ports-cell">{moment(k, 'YYYY').utc().format('YYYY')}</td>
      <td className="ports-cell"> <SiatQuestionList value={v} /> </td>
    </tr>
    );
  }));
  if (isEmpty(items)) return null;
  return <table className="explorer__result-siat_table"><tbody>{items}</tbody></table>;
}
SiatTable.propTypes = { value: PropTypes.object };

const SiatQuestionList = ({value}) => {
  const items = compact(map(value, (v, question) => {
    return(
      <Collapse.Panel header={question} key={question}>
        <p>Number of respondents:  {v.number_of_respondents}</p>
        <SiatResultsList value={v.results} />
      </Collapse.Panel>
    );
  }));
  if(isEmpty(items)) return null;
  return (
    <div className="explorer__result-siat_question_list">
      <Collapse accordion={false}>
        {items}
      </Collapse>
    </div>
  );
}
SiatQuestionList.propTypes = { value: PropTypes.object };

const SiatResultsList = ({value}) => {
  const items = compact(map(value, (item, i) => {
    return(
    <tr key={i}>
      <td className="ports-cell">Answer:  {item.answer}</td>
      <td className="ports-cell">Percentage or value:  {item.percentage_or_value}</td>
    </tr>
    );
  }));
  if (isEmpty(items)) return null;
  return <table className="explorer__result-ports_amounts"><tbody>{items}</tbody></table>;
};
SiatResultsList.propTypes = { value: PropTypes.array };

export {
  SiatTable
};