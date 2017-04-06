import React, { PropTypes } from 'react';
import { Row, UnorderedList, MonthlyAmountsList, PortsList, I92List, SpendingDataTable, SiatTable } from './DetailItem';
import { I92 } from './../../apis/I92';
import { SpendingData } from './../../apis/SpendingData';
import { Siat } from './../../apis/Siat';

const Detail = ({ result }) => {

  return (
    <table className="explorer__result-item__detail">
      <tbody>
        <Row label="Country or Region">{result.i94_country_or_region}</Row>
        <Row label="NTTO Groups">
          <UnorderedList value={result.ntto_group} />
        </Row>
        <Row label="Country">{result.country}</Row>
        <Row label="World Regions">
          <UnorderedList value={result.world_region} />
        </Row>

        <Row label="Total Arrivals by Month">
          <MonthlyAmountsList value={result.total_arrivals} />
        </Row>

        <Row label="Business Visa Arrivals by Month">
          <MonthlyAmountsList value={result.business_visa_arrivals} />
        </Row>

        <Row label="Pleasure Visa Arrivals by Month">
          <MonthlyAmountsList value={result.pleasure_visa_arrivals} />
        </Row>

        <Row label="Student Visa Arrivals by Month">
          <MonthlyAmountsList value={result.student_visa_arrivals} />
        </Row>

        <Row label="Ports of Entry Arrivals by Month">
          <PortsList value={result.ports_arrivals} />
        </Row>

        <Row label="I-92 Arrivals by Month">
          {I92.entries_list({val: result.i92_departures})}
        </Row>

        <Row label="I-92 Departures by Month">
          {I92.entries_list({val: result.i92_departures})}
        </Row>

        <Row label="Spending Data (Millions of Dollars)">
          {SpendingData.entries_list({val: result.spending_data})}
        </Row>

        <Row label="Survey of International Air Travel Results">
          {Siat.entries_list({val: result.siat_data})}
        </Row>

      </tbody>
    </table>
  )
};
Detail.propTypes = {
  result: PropTypes.object.isRequired
};

export default Detail;
