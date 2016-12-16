import fetch from 'isomorphic-fetch';
import { stringify } from 'querystring';
import { isEmpty, omit, values, map, forEach, has} from '../utils/lodash';
import { buildAggResults } from './build_agg_results.js';
import { buildReports } from './build_reports.js';
import { REQUEST_AGG_RESULTS, RECEIVE_FAILURE, PAGE_RESULTS, RECEIVE_AGG_RESULTS } from 'constants';
import config from '../config.js';

export function requestAggResults() {
  return {
    type: REQUEST_AGG_RESULTS,
  };
}

export function receiveFailure(error) {
  return {
    type: RECEIVE_FAILURE,
    error,
  };
}

export function pageResults(offset) {
  return {
    type: PAGE_RESULTS,
    offset,
  };
}

export function receiveAggResults(payload) {
  return {
    type: RECEIVE_AGG_RESULTS,
    payload,
  };
}

function aggregateResults(json, querystring, params, offset, agg_results, apis) {
  var results = {};  
  var count = 0;
  for (var key in apis){
    // 10k is the max offset that can be reached in Elasticsearch:
    if (json[count].total >= 10000) return receiveFailure('Too many results, enter more search terms to narrow search.');
    results[key] = json[count];
    count += 1;
  }
    
  agg_results.results = buildAggResults(results, agg_results.results, params);

  if (has(results, 'i94')) agg_results.i94_total += results.i94.results.length;
  if (has(results, 'i92')) agg_results.i92_total += results.i92.results.length;

  // Fetch next batch of results if needed:
  if(has(results, 'i94') && agg_results.i94_total < results.i94.total &&
    has(results, 'i92') && agg_results.i92_total < results.i92.total){
    return fetchAggResults(querystring, params, offset+100, agg_results, apis);
  }
  else if(has(results, 'i94') && agg_results.i94_total < results.i94.total){
    apis = omit(apis, 'i92');
    return fetchAggResults(querystring, params, offset+100, agg_results, apis);
  }
  else if(has(results, 'i92') && agg_results.i92_total < results.i92.total){
    apis = omit(apis, 'i94');
    return fetchAggResults(querystring, params, offset+100, agg_results, apis);
  }

  agg_results.results = buildReports(agg_results.results, params);

  return receiveAggResults(values(agg_results.results));
}

const { i94_url, i92_url, apiKey } = config.api;

function fetchAggResults(querystring, params, offset = 0, aggregated_results = {}, apis = {}) {
  return (dispatch) => {
    dispatch(requestAggResults(querystring));

    var requests = values(apis).map( function(api){
      return sendRequest(api, querystring, offset);
    });
    return Promise.all(requests)
      .then(response => ( Promise.all(response.map( function(api_result){
        return api_result.json()
      }))))
      .then(json => dispatch(aggregateResults(json, querystring, params, offset, aggregated_results, apis)));
  };
}

function sendRequest(api, querystring, offset){
  return fetch(`${api}?api_key=${apiKey}&size=100&offset=${offset}&${querystring}`)
}

function shouldFetchResults(state) {
  const { results } = state;
  if (!results) {
    return true;
  } else if (results.isFetching) {
    return false;
  }
  return true;
}

function buildQueryString(params) {
  if (params.start_date && params.end_date) {
    Object.assign(params, { date: params.start_date + "-01" + " TO " + params.end_date + "-01" });
  }
  return stringify(omit(params, ['start_date', 'end_date']));
}

export function fetchAggResultsIfNeeded(params) {
  return (dispatch, getState) => {
    if (isEmpty(omit(params, ['offset', 'size']))) {
      return dispatch(receiveAggResults([]));
    }
    else if(shouldFetchResults(getState())) {
      var apis = {i94: i94_url, i92: i92_url};
      var agg_results = { results: [], i94_total: 0, i92_total: 0 }
      return dispatch(fetchAggResults(buildQueryString(params), params, 0, agg_results, apis));
    }

    return Promise.resolve([]);
  };
}
