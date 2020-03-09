import { compact, get, isEmpty, map, startCase, pick } from '../../utils/lodash';
import React, { Component, PropTypes } from 'react';
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
        <p>Number of respondents:  {parseInt(v.number_of_respondents)}</p>
        <SiatResultsList value={v.results} question={question}/>
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

const SiatResultsList = ({value, question}) => {
  let headers = <tr><th>Answer</th><th>Value (Dollars)</th></tr>;
  if (question.includes('%')) {
      headers = <tr><th>Answer</th><th>Percentage</th></tr>;
    }
  const items = compact(map(value, (item, i) => {
    let formatted_val = parseFloat(item.percentage_or_value);
    if (question.includes('%')) {
      formatted_val = formatted_val * 100;
    }
    return(
    <tr key={i}>
      <td className="ports-cell">{item.answer}</td>
      <td className="ports-cell">{formatted_val.toFixed(2)}</td>
    </tr>
    );
  }));
  if (isEmpty(items)) return null;
  return <table className="explorer__result-ports_amounts"><tbody>{headers}{items}</tbody></table>;
};
SiatResultsList.propTypes = { 
  value: PropTypes.array,
  question: PropTypes.string
};

export {
  SiatTable
};