import fetch from 'isomorphic-fetch';
import { stringify } from 'querystring';
import { isEmpty, omit, values, map, forEach, has} from '../utils/lodash';
import { buildAggResults } from './build_agg_results.js';
import { buildReports } from './build_reports.js';
import { REQUEST_RESULTS, REQUEST_AGG_RESULTS, RECEIVE_RESULTS, RECEIVE_FAILURE, PAGE_RESULTS, RECEIVE_AGG_RESULTS, SET_VISIBLE_FIELDS } from 'constants';
import config from '../config.js';

export function requestResults() {
  return {
    type: REQUEST_RESULTS,
  };
}

export function requestAggResults() {
  return {
    type: REQUEST_AGG_RESULTS,
  };
}

export function receiveResults(payload) {
  return {
    type: RECEIVE_RESULTS,
    payload,
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

export function setVisibleFields(visible_fields){
  return {
    type: SET_VISIBLE_FIELDS,
    visible_fields,
  };
}

function aggregateResults(json, querystring, params, offset, agg_results, apis) {
  var results = {};  
  var count = 0;
  for (var key in apis){
    // 10k is the max offset that can be reached in Elasticsearch:
    if (json[count].total >= 10000) return receiveAggResults([]);
    results[key] = json[count];
    count += 1;
  }
    
  if(has(agg_results, 'results')){
    agg_results.results = buildAggResults(results, agg_results.results, params);
    if (has(results, 'i94')) agg_results.i94_total += results.i94.results.length;
    if (has(results, 'i92')) agg_results.i92_total += results.i92.results.length;
  } 
  else{
    agg_results.results = buildAggResults(results, {}, params);
    if (has(results, 'i94')) agg_results.i94_total = results.i94.results.length;
    if (has(results, 'i92')) agg_results.i92_total = results.i92.results.length;
  }

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

  //agg_results.results = buildReports(agg_results.results, params);
  return receiveAggResults(values(agg_results.results));
}

const { i94_url, i92_url, apiKey } = config.api;

function fetchResults(querystring) {
  return (dispatch) => {
    dispatch(requestResults(querystring));
    return fetch(`${i92_url}?api_key=${apiKey}&${querystring}`)
      .then(response => response.json())
      .then(json => dispatch(receiveResults(json)));
  };
}

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
  return stringify(omit(params, ['start_date', 'end_date', 'percent_change', 'visible_fields', 'sort']));
}

export function fetchResultsIfNeeded(params) {
  return (dispatch, getState) => {
    if (shouldFetchResults(getState())) {
      return dispatch(fetchResults(buildQueryString(params)));
    }

    return Promise.resolve([]);
  };
}

export function fetchAggResultsIfNeeded(params) {
  return (dispatch, getState) => {
    params.sort = params.sort ? params.sort : ""
    params.percent_change = params.percent_change ? params.percent_change : ""
    if (isEmpty(omit(params, ['sort', 'offset', 'size', 'percent_change', 'visible_fields']))) {
      return dispatch(receiveAggResults([]));
    }
    else {
      var apis = {i94: i94_url, i92: i92_url};
      return dispatch(fetchAggResults(buildQueryString(params), params, 0, {}, apis));
    }

    return Promise.resolve([]);
  };
}
