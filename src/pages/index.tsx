import React from 'react';
import { graphql } from 'gatsby';
import Root from 'components/ui/Root';
import SEO from 'components/ui/SEO';
import { Launch, Launchpad, Landpad, Core, Rocket, Payload } from 'types';

interface Props {
  data: {
    spacexdatalaunches: { launches: Launch[] };
    spacexdatacores: { cores: Core[] };
    spacexdatarockets: { rockets: Rocket[] };
    spacexdatapayloads: { payloads: Payload[] };
    spacexdatalaunchpads: { launchpads: Launchpad[] };
    spacexdatalandpads: { landpads: Landpad[] };
  };
}

const IndexPage: React.FC<Props> = ({
  data: {
    spacexdatalaunches: { launches },
    spacexdatacores: { cores },
    spacexdatarockets: { rockets },
    spacexdatapayloads: { payloads },
    spacexdatalaunchpads: { launchpads },
    spacexdatalandpads: { landpads },
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
        rockets={rockets}
        payloads={payloads}
        launchpads={launchpads}
        landpads={landpads}
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
        id
        flight_number
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
    spacexdatarockets {
      rockets {
        id
        name
      }
    }
    spacexdatalaunchpads {
      launchpads {
        id
        name
      }
    }
    spacexdatalandpads {
      landpads {
        id
        name
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
