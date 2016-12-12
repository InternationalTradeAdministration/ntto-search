import React, { PropTypes, Component } from 'react';
import Collpase from 'react-collapse';

const HeadingDropdown = () => {

  return (
      <div id="heading-dropdown">
        <p className="DefaultParagraph-1">
          Search for international passenger travel data and generate reports for each country, region or port based on Arrivals to the United States (Inbound) or Departures from the United States (Outbound).
        </p>
 
        <p>
          Arrivals to the United States include both air traffic (APIS, formerly I-92) and international visitation (I-94 Program):
        </p>
        <ol>
          <li>       International air traffic (all) to the United States.
            <p>
            These data are sourced from the U.S. Department of Homeland Security’s Advance Passenger Information System (APIS, formerly I-92).  APIS data are based on the “Flight O&D,” i.e., the origin and destination of a non-stop flight, from LHR (London Heathrow) to ATL (Atlanta).  Not all APIS non-U.S. travelers from the LHR (United Kingdom) are residents of the United Kingdom.  Many travelers originate from ‘behind,’ i.e., passenger origin = Sweden, etc.  Breakouts include: non-U.S. citizens (originating their trips), U.S. citizens (returning to the U.S.), U.S. Carriers and Foreign Carriers, and Ports of Entry.  Please note, APIS data include all travelers on flights to and from the United States.  These data are not visitation data.  They include travelers that the United Nations World Tourism Organization does not count as visitors (e.g., temporary workers, immigrants, refugees, transit passengers, airline crews, and others). 
            </p>
          </li>
          <li>
                 International visitation to the United States.
            <p>
              Data are sourced from the U.S. Department of Homeland Security’s I-94 arrival records.  I-94 data are based on 13 ‘visitor visa’ types.  I-94 data are also based on the “Passenger O&D,” i.e., the origin and destination of the traveler, from the U.K. (country of residence) to ATL (Atlanta).  Breakouts include: country of residence, visa type (business/leisure/student), and ports of arrival.  I-94 arrivals data are the only source for official international arrivals to the United States.
            </p>
          </li>
        </ol>
 
        <p>
          Departures from the United States include air traffic only (APIS, formerly I-92):
        </p>

         <ul className="heading-list">   
          <li>
            International air traffic to the U.S. The source is also DHS’ Advance Passenger Information System (APIS, formerly I-92)

            APIS data is based on the Flight O&D, i.e. the origin and destination of a non-stop flight, from ATL (Atlanta) to LHR (London Heathrow)

            Breakouts include: U.S. citizens (originating their trips from the U.S.) / Non-U.S. citizens (returning from the U.S.) / Carriers and Foreign Carriers/Ports of Departure
          </li>
          <li>
            Note: I-94 departure records are not available from DHS.
           </li>
        </ul> 
      </div>
  );

};

export default HeadingDropdown;