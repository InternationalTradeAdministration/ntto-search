import React, { PropTypes } from 'react';
import { Row, UnorderedList, MonthlyAmountsList, PortsList, PortsAmounts, PortsPercentages, I92List } from './DetailItem';

const Detail = ({ result, visibleFields }) => {

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

        <Row label="Total Arrivals">
          <MonthlyAmountsList value={result.total_arrivals} />
        </Row>

        <Row label="Business Visa Arrivals">
          <MonthlyAmountsList value={result.business_visa_arrivals} />
        </Row>

        <Row label="Pleasure Visa Arrivals">
          <MonthlyAmountsList value={result.pleasure_visa_arrivals} />
        </Row>

        <Row label="Student Visa Arrivals">
          <MonthlyAmountsList value={result.student_visa_arrivals} />
        </Row>

        <Row label="Arrivals by Ports of Entry">
          <PortsList value={result.ports_arrivals} />
        </Row>

        <Row label="I-92 Arrivals">
          <I92List value={result.i92_arrivals} />
        </Row>

        <Row label="I-92 Departures">
          <I92List value={result.i92_departures} />
        </Row>

      </tbody>
    </table>
  )
};
Detail.propTypes = {
  result: PropTypes.object.isRequired,
  visibleFields: PropTypes.array.isRequired
};

export default Detail;
