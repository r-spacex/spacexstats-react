import React from 'react';
import Root from 'components/ui/Root';
import SEO from 'components/ui/SEO';
import { graphql } from 'gatsby';
import { LLAPIAdapter } from 'data/launch-library';
import { LLAPIData } from 'data/launch-library/types';

interface Props {
  data: LLAPIData;
}

const IndexPage: React.FC<Props> = ({ data }) => {
  const spacexstatsData = LLAPIAdapter.dataTransformer(data);

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
        net
        failreason
        rocket {
          configuration {
            id
            name
          }
        }
        mission {
          description
          orbit {
            id
          }
        }
        status {
          id
        }
        pad {
          id
          name
        }
      }
    }
  }
`;

/*
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
    */
