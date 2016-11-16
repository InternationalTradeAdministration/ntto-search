import { compact, get, isEmpty, map, startCase, pick } from '../../utils/lodash';
import React, { Component, PropTypes } from 'react';
import ReactList from 'react-list';
import moment from 'moment';

const isValidArray = (value) => (value && Array.isArray(value) && value.length);
const isValidChildren = (value) => {
  if (typeof value === 'undefined' || value === null || isEmpty(value)) return false;

  if (typeof value.type === 'function' &&
      typeof get(value, ['props', 'value']) === 'undefined') return false;

  return true;
};

const Link = ({ value }) => <a href={value}>{value}</a>;
Link.propTypes = { value: PropTypes.string.isRequired };

const ListItem = ({ value }) => (value ? <li>{value}</li> : null);
ListItem.propTypes = { value: PropTypes.string };

const UnorderedList = ({ value }) => {
  if (!isValidArray(value)) return null;

  const items = compact(map(value, (item, i) => !isEmpty(value) && (
    <ListItem key={i} value={item} />
  )));
  if (isEmpty(items)) return null;
  return <ul>{items}</ul>;
};
UnorderedList.propTypes = { value: PropTypes.array };

const Row = ({ label, children }) => {
  if (!isValidChildren(children)) return null;
  return (
    <tr>
      <td className="result-row-label">{label}</td>
      <td>{children}</td>
    </tr>
  );
};
Row.propTypes = { label: PropTypes.string.isRequired, children: PropTypes.any };


const MonthlyAmountsList = ({ value }) => {
  if (typeof value != 'object') return null;

  const items = compact(map(value, (v, k) => {
    return(
    <li key={k}>
      {moment(k).format('MMM YYYY')}:  {v.toLocaleString()}
    </li>
    );
  }));
  if (isEmpty(items)) {
    return null;
  }

  return <ul className="explorer__result-monthly_amounts">{items}</ul>;
};
MonthlyAmountsList.propTypes = { value: PropTypes.object };


const PortsList = ({value}) => {
  const items = compact(map(value, (v, k) => {
    return(
    <tr key={k}>
      <td className="ports-cell">{moment(k).format('MMM YYYY')}</td>
      <td className="ports-cell"> <PortsAmounts value={v} /> </td>
    </tr>
    );
  }));
  if (isEmpty(items)) return null;

  return <table className="explorer__result-ports_list"><tbody>{items}</tbody></table>;
};
PortsList.propTypes = { value: PropTypes.object };


const PortsAmounts = ({value}) => {
  const items = compact(map(value, (item, i) => {
    return(
    <li key={i}>
      {item['port']}:  {item['amount'].toLocaleString()}
    </li>
    );
  }));
  if (isEmpty(items)) return null;

  return <ul className="explorer__result-ports_amounts">{items}</ul>;
};
PortsAmounts.propTypes = { value: PropTypes.array };

const PortsPercentages = ({value}) => {
  const items = compact(map(value, (item, i) => {
    return(
    <li key={i}>
      {item['port']}:  {item['amount']}
    </li>
    );
  }));
  if (isEmpty(items)) return null;

  return <ul className="explorer__result-ports_amounts">{items}</ul>;
};
PortsAmounts.propTypes = { value: PropTypes.array };


class I92List extends React.Component {
  static propTypes = {
    value: PropTypes.object,
  }

  state = { items: [] };

  componentWillMount() {
    const items = compact(map(this.props.value, (v, k) => {
      return(
      <li key={k}>
        {k}:  <I92Table value={v} />
      </li>
      );
    }));
    this.setState({items});
  }

  renderItem(index, key) {
    return this.state.items[index];
  }

  render() {
    return (
      <div className="explorer__result-i92_amounts">
        <ReactList
          itemRenderer={::this.renderItem}
          length={this.state.items.length}
        />
      </div>
    );
  }
}

const I92Table = ({value}) => {
  const items = compact(map(value, (v, k) => {
    return(
    <tr key={k}>
      <td className="ports-cell">{moment(k).utc().format('MMM YYYY')}</td>
      <td className="ports-cell"> <I92Amounts value={v} /> </td>
    </tr>
    );
  }));
  if (isEmpty(items)) return null;

  return <table className="explorer__result-i92_table"><tbody>{items}</tbody></table>;
};
I92Table.propTypes = { value: PropTypes.object };

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
  Link,
  ListItem,
  Row,
  UnorderedList,
  MonthlyAmountsList,
  PortsList,
  PortsAmounts,
  PortsPercentages,
  I92List
};
