import { isEmpty, map, omit, has } from '../../utils/lodash';
import React, { PropTypes } from 'react';
import Item from './Item';
import Pages from './Pages';
import './Result.scss';
import moment from 'moment';

const ResultCountLabel = ({ count, query }) => {
  let text = '';
  if (!isEmpty(omit(query, ['offset', 'size']))) {
    if (count === 0) text = 'No results.';
    else if (count === 1) text = ` report found.`;
    else if (count >= 10000) text = 'Too many results, enter more terms to narrow search.';
    else text = ` reports found.`;
  }
  if (text == '') count = '';
  
  return <p className="result-count-label"><div className="result-count">{count}</div>{text}</p>;
};
ResultCountLabel.propTypes = {
  count: PropTypes.number.isRequired,
  query: PropTypes.object,
};

const TimeFrameLabel = ({ query }) => {
  if (has(query, 'date')) {
    var time_frame = query['date'].split(" TO ");
    time_frame = moment(time_frame[0]).format('MMM YYYY') + " to " + moment(time_frame[1]).format('MMM YYYY');
  }
  else
    var time_frame = "no time frame specified";
  let text = '';
  if (!isEmpty(omit(query, ['offset', 'size']))) {
    text = `Travel Data for:  ${time_frame}.`;
  }
  return <p className="explorer__result__label">{text}</p>;
};
TimeFrameLabel.propTypes = {
  query: PropTypes.object,
};

const AggregatedResult = ({ onPaging, query = {}, results }) => {
  if (results.isFetchingAggs) return null;
  if (results.error != "") 
    return (<div className="explorer__result">{results.error}</div>);

  const items = map(results.pageItems, result => {
    return <Item key={Object.keys(result)[0]} result={Object.values(result)[0]} result_key={Object.keys(result)[0]}/>
  });

  const pagesProps = {
    current: Math.ceil((results.offset ? results.offset : 0) / 10) + 1,
    displayed: 5,
    total: Math.ceil(results.aggregatedItems.length / 10),
    handleClick: onPaging,
  };

  return (
    <div className="explorer__result">
      <TimeFrameLabel query={query} />
      <ResultCountLabel count={results.aggregatedItems.length} query={query} />
      {items}
      <Pages {...pagesProps} />
    </div>
  );
};
AggregatedResult.propTypes = {
  onPaging: PropTypes.func.isRequired,
  query: PropTypes.object,
  results: PropTypes.object,
};

export default AggregatedResult;
