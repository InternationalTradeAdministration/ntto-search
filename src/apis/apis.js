import config from '../config.js';

const { i94_url, i92_url, spending_data_url, siat_url} = config.api;
export const apis = { i94: i94_url, i92: i92_url, spending_data: spending_data_url, siat: siat_url };