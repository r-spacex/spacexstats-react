import React from 'react';
import { graphql } from 'gatsby';

import Root from 'components/ui/Root';
import SEO from 'components/ui/SEO';

interface Launch {
  flight_number: number;
}

interface SpaceXAPIData {
  pastLaunches: Launch[];
  upcomingLaunches: Launch[];
}

const IndexPage = ({ data }: { data: SpaceXAPIData }) => (
  <>
    <SEO />
    <Root {...data} />
  </>
);

export default IndexPage;

export const query = graphql`
  query IndexQuery {
    spacexData {
      pastLaunches {
        flight_number
      }
      upcomingLaunches {
        flight_number
      }
    }
  }
`;
