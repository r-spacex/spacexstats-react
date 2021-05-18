import React from 'react';
import { graphql } from 'gatsby';
import Root from 'components/ui/Root';
import SEO from 'components/ui/SEO';
import {
  Launch,
  Launchpad,
  Landpad,
  Core,
  Rocket,
  Payload,
  Crew,
  Starlink,
  Roadster,
  Company,
} from 'types';

interface Props {
  data: {
    currentBuildDate: {
      currentDate: string;
    };
    spacexdatalaunches: { launches: Launch[] };
    spacexdatacores: { cores: Core[] };
    spacexdatarockets: { rockets: Rocket[] };
    spacexdatapayloads: { payloads: Payload[] };
    spacexdatalaunchpads: { launchpads: Launchpad[] };
    spacexdatalandpads: { landpads: Landpad[] };
    spacexdatacrew: { crew: Crew[] };
    spacexdatastarlink: { starlink: Starlink[] };
    spacexdatacompany: { company: Company };
    spacexdataroadster: { roadster: Roadster };
  };
}

const IndexPage: React.FC<Props> = ({
  data: {
    currentBuildDate: { currentDate },
    spacexdatalaunches: { launches },
    spacexdatacores: { cores },
    spacexdatarockets: { rockets },
    spacexdatapayloads: { payloads },
    spacexdatalaunchpads: { launchpads },
    spacexdatalandpads: { landpads },
    spacexdatacrew: { crew },
    spacexdatastarlink: { starlink },
    spacexdatacompany: { company },
    spacexdataroadster: { roadster },
  },
}) => {
  const pastLaunches = launches.filter(
    (launch) => !launch.upcoming && launch.success !== null,
  );
  const upcomingLaunches = launches.filter((launch) => launch.upcoming);

  return (
    <>
      <SEO />
      <Root
        buildDate={currentDate}
        cores={cores}
        pastLaunches={pastLaunches}
        rockets={rockets}
        payloads={payloads}
        launchpads={launchpads}
        landpads={landpads}
        crew={crew}
        starlink={starlink}
        company={company}
        roadster={roadster}
        upcomingLaunches={upcomingLaunches}
      />
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
