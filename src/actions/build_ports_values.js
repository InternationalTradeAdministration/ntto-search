import { values, has, compact, capitalize, map, snakeCase } from '../utils/lodash';

export function buildPortsValues(ports_arrivals){
  ports_arrivals = sortPortsArrivals(ports_arrivals);
  return ports_arrivals;
}

function sortPortsArrivals(ports_arrivals){
  for (let date_key in ports_arrivals) {
    let ports_array = ports_arrivals[date_key];
    ports_array.sort(compare);
  }
  return ports_arrivals
}

function compare(a,b) {
  if (a.amount > b.amount)
    return -1;
  if (a.amount < b.amount)
    return 1;
  return 0;
}