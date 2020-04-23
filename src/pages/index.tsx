import React from 'react';
import { graphql } from 'gatsby';
import Root from 'components/ui/Root';
import SEO from 'components/ui/SEO';
import { Launch, Core } from 'types';

interface Props {
  data: {
    spacexdatalaunches: { launches: Launch[] };
    spacexdatacores: { cores: Core[] };
  };
}

const IndexPage: React.FC<Props> = ({
  data: {
    spacexdatalaunches: { launches },
    spacexdatacores: { cores },
  },
}) => {
  const pastLaunches = launches.filter((launch) => !launch.upcoming);
  const upcomingLaunches = launches.filter((launch) => launch.upcoming);

  return (
    <>
      <SEO />
      <Root
        cores={cores}
        pastLaunches={pastLaunches}
        upcomingLaunches={upcomingLaunches}
      />
    </>
  );
};

export default IndexPage;

export const query = graphql`
  query IndexQuery {
    spacexdatalaunches {
      launches {
        flight_number
        mission_name
        launch_year
        launch_date_unix
        launch_date_utc
        tentative_max_precision
        rocket {
          rocket_id
          rocket_name
          rocket_type
          first_stage {
            cores {
              core_serial
              flight
              land_success
              landing_intent
              landing_type
              landing_vehicle
              reused
            }
          }
          second_stage {
            payloads {
              payload_id
              norad_id
              reused
              customers
              nationality
              payload_type
              payload_mass_kg
              orbit
              mass_returned_kg
              flight_time_sec
            }
          }
          fairings {
            recovery_attempt
            recovered
            reused
            ship
          }
        }
        launch_site {
          site_id
          site_name
        }
        launch_success
        details
        upcoming
      }
    }
    spacexdatacores {
      cores {
        core_serial
        status
        missions {
          name
          flight
        }
        reuse_count
        details
      }
    }
  }
`;
