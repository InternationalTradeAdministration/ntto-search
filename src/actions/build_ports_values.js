import { values, has, compact, capitalize, map, snakeCase } from '../utils/lodash';

export function buildPortsValues(ports_arrivals){
  ports_arrivals = sortPortsArrivals(ports_arrivals);
  
  var return_hash = populateAdditionalFields(ports_arrivals);
  return return_hash;
}

function sortPortsArrivals(ports_arrivals){
  for (var date_key in ports_arrivals) {
    var ports_array = ports_arrivals[date_key];
    ports_array.sort(compare);
  }
  return ports_arrivals
}

function populateAdditionalFields(ports_arrivals){
  var ports_arrivals_sums = {};
  var return_hash = {};

  for (var date_key in ports_arrivals) {
    var ports_array = ports_arrivals[date_key];

    ports_array.forEach( function (entry) {
      if (has(ports_arrivals_sums, entry.port)) {
        ports_arrivals_sums[entry.port].amount += entry.amount;
      }
      else{
        ports_arrivals_sums[entry.port] = { port: entry.port, amount: entry.amount };
      }
    });
  }

  return_hash.ports_arrivals_sums = values(ports_arrivals_sums).sort(compare);
  return return_hash;
}

function compare(a,b) {
  if (a.amount > b.amount)
    return -1;
  if (a.amount < b.amount)
    return 1;
  return 0;
}