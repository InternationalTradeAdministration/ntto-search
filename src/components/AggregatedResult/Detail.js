import React, { PropTypes } from 'react';
import Collapse from 'rc-collapse';
import { Row, UnorderedList, MonthlyAmountsList, PortsList, I92List, SpendingDataTable, SiatTable } from './DetailItem';
import { I92 } from './../../apis/I92';
import { SpendingData } from './../../apis/SpendingData';
import { Siat } from './../../apis/Siat';
import 'rc-collapse/assets/index.css';

const Detail = ({ result }) => {

  return (
    <Collapse accordion={false}>
      <Collapse.Panel header="I-94 International Arrivals">
        <Collapse accordion={false}>

          <Collapse.Panel header="Total Arrivals">
            <table className="explorer__result-item__detail">
              <tbody>             
                <Row label="Total Arrivals by Month">
                  <MonthlyAmountsList value={result.total_arrivals} />
                </Row>
              </tbody>
            </table>
          </Collapse.Panel>

          <Collapse.Panel header="Arrivals by Visa Type">
            <table className="explorer__result-item__detail">
              <tbody>  
                <Row label="Business Visa Arrivals by Month">
                  <MonthlyAmountsList value={result.business_visa_arrivals} />
                </Row>

                <Row label="Pleasure Visa Arrivals by Month">
                  <MonthlyAmountsList value={result.pleasure_visa_arrivals} />
                </Row>

                <Row label="Student Visa Arrivals by Month">
                  <MonthlyAmountsList value={result.student_visa_arrivals} />
                </Row>
              </tbody>
            </table>
          </Collapse.Panel>

          <Collapse.Panel header="Arrivals by Port of Entry">
            <table className="explorer__result-item__detail">
              <tbody>  
                <Row label="Ports of Entry Arrivals by Month">
                  <PortsList value={result.ports_arrivals} />
                </Row>
              </tbody>
            </table>
          </Collapse.Panel>

        </Collapse>
      </Collapse.Panel>

      <Collapse.Panel header="APIS (I-92) Arrivals and Departures">
        <Collapse accordion={false}>
          <Collapse.Panel header="I-92 Arrivals by Month">
            {I92.entries_list({val: result.i92_arrivals})}
          </Collapse.Panel>

          <Collapse.Panel header="I-92 Departures by Month">
            {I92.entries_list({val: result.i92_departures})}
          </Collapse.Panel>
        </Collapse>
      </Collapse.Panel>

      <Collapse.Panel header="Spending Data">
        {SpendingData.entries_list({val: result.spending_data})}
      </Collapse.Panel>

      <Collapse.Panel header="Survey of International Air Travelers">
        {Siat.entries_list({val: result.siat_data})}
      </Collapse.Panel>

    </Collapse>
  )
};
Detail.propTypes = {
  result: PropTypes.object.isRequired
};

export default Detail;
