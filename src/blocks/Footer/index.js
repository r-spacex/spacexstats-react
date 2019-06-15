import React from 'react';
import styled from 'styled-components';
import ScrollableAnchor from 'react-scrollable-anchor';
import { colorUsages } from 'stylesheet';

import { Background } from 'components/ContentBlock';
import Link from 'components/Link';

const Wrapper = styled(Background)`
  display: block;
  height: 100vh;
`;

const Content = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%;
  padding: 1rem;
  background-color: ${colorUsages.footerBackground};
  color: ${colorUsages.footer};
`;

const Footer = () => (
  <Wrapper id="section-infos" style={{ backgroundImage: 'url(/images/backgrounds/orbcommdark.jpg)' }}>
    <ScrollableAnchor id="infos">
      <span />
    </ScrollableAnchor>
    <Content>
      <p>
        Photos on this page courtesy SpaceX, &amp; NASA. BFS Hop Test image by{' '}
        <Link
          eventLabel="Exit to IanAtkinson_NSF's profile"
          to="https://www.reddit.com/user/IanAtkinson_NSF"
          title="IanAtkinson_NSF's Reddit profile"
        >
          /u/IanAtkinson_NSF
        </Link>{' '}
        on Reddit. All rights maintained by the respective owners.
        <br />
        This site is fan-run and not affiliated with SpaceX in any way. For official information and news, please visit{' '}
        <Link eventLabel="Exit to SpaceX official website" to="http://www.spacex.com" title="Official SpaceX website">
          www.spacex.com
        </Link>
        .
        <br />
        Original site concept and design by{' '}
        <Link
          eventLabel="Exit to EchoLogic's profile"
          to="https://www.reddit.com/user/EchoLogic"
          title="Echologic's Reddit profile"
        >
          /u/EchoLogic
        </Link>
        , now rehosted by{' '}
        <Link
          eventLabel="Exit to Brandtamos' profile"
          to="https://www.reddit.com/user/brandtamos"
          title="Brandtamos' Reddit profile"
        >
          /u/brandtamos
        </Link>{' '}
        and recoded by{' '}
        <Link
          eventLabel="Exit to kornelord's profile"
          to="https://www.reddit.com/user/kornelord"
          title="kornelord's Reddit profile"
        >
          /u/kornelord
        </Link>{' '}
        with React and{' '}
        <Link eventLabel="Exit to r/spacex's API" to="https://github.com/r-spacex/SpaceX-API" title="r/spacex's API">
          r/spacex’s API
        </Link>
        .<br />
        <br />
        <Link eventLabel="Exit to Github Repo" to="https://github.com/r-spacex/spacexstats-react" title="Contribute!">
          GitHub repository
        </Link>
      </p>
    </Content>
  </Wrapper>
);

export default Footer;
