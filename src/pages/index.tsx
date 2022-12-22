import React from 'react';
import Root from 'components/ui/Root';
import SEO from 'components/ui/SEO';
import { RSXAPIData } from 'api/r-spacex/types';
import { RSXAPIAdapter } from 'api/r-spacex';
// eslint-disable-next-line
import { graphql } from 'gatsby';

interface Props {
  data: RSXAPIData;
}

const IndexPage: React.FC<Props> = ({ data }) => {
  const spacexstatsData = RSXAPIAdapter.dataTransformer(data);

  return (
    <>
      <SEO />
      <Root {...spacexstatsData} />
    </>
  );
};

export default IndexPage;

export const query = graphql`
  query IndexQuery {
    currentBuildDate {
      currentDate
    }
    spacexdatalaunches {
      launches {
        id
        name
        date_unix
        date_utc
        date_precision
        rocket
        launchpad
        success
        payloads
        cores {
          flight
          landing_success
          landing_attempt
          landing_type
          landpad
          reused
        }
        fairings {
          recovery_attempt
          recovered
          reused
        }
        details
        upcoming
      }
    }
    spacexdatacores {
      cores {
        id
        serial
        status
        reuse_count
        launches
      }
    }
    spacexdatacompany {
      company {
        id
        employees
      }
    }
    spacexdataroadster {
      roadster {
        id
        earth_distance_km
        speed_kph
        details
      }
    }
    spacexdatacrew {
      crew {
        id
        name
        agency
        launches
        status
      }
    }
    spacexdatastarlink {
      starlink {
        id
        launch
        version
        spaceTrack {
          OBJECT_NAME
          LAUNCH_DATE
          DECAY_DATE
        }
      }
    }
    spacexdatapayloads {
      payloads {
        id
        name
        type
        norad_ids
        reused
        customers
        mass_kg
        orbit
        dragon {
          mass_returned_kg
          flight_time_sec
        }
      }
    }
  }
`;
