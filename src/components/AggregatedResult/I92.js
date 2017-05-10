import { compact, get, isEmpty, map, startCase, pick } from '../../utils/lodash';
import React, { Component, PropTypes } from 'react';
import ReactList from 'react-list';
import moment from 'moment';

class I92List extends React.Component {
  static propTypes = {
    value: PropTypes.array,
  }

  state = { items: [] };

  componentWillMount() {
    const items = compact(map(this.props.value, (entry) => {
      let key = Object.keys(entry)[0];
      return(
      <li key={key}>
        {key}:  <I92Table value={entry[key]} />
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
          pageSize={5}
        />
      </div>
    );
  }
}

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