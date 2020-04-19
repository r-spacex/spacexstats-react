import React, { useEffect } from 'react';
import styled from 'styled-components';
import { colorUsages } from 'stylesheet';
import { Background, Wrapper } from 'components/ui/Section';
import { isInViewport, updateHash } from 'utils/scroll';
import Link from 'components/ui/Link';

const FooterBackground = styled(Background)`
  display: block;
  height: 100vh;
`;

const WhiteBackground = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  padding: 1rem;
  background-color: ${colorUsages.footerBackground};
  color: ${colorUsages.footer};
`;

const FooterWrapper = styled(Wrapper)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
`;

const Text = styled.p`
  margin-bottom: 1rem;
`;

const FOOTER_SECTION_ID = 'about';

const Footer: React.FC = () => {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.addEventListener('scroll', () => {
      if (isInViewport(FOOTER_SECTION_ID)) {
        updateHash(`${FOOTER_SECTION_ID}`);
      }
    });
  }, []);

  return (
    <FooterBackground filename="backgrounds/orbcommdark.jpg" tag="footer">
      <WhiteBackground>
        <FooterWrapper id={FOOTER_SECTION_ID}>
          <Text>
            Photos on this page courtesy SpaceX, NASA and BocaChicaGal. SpaceX
            Recaps by{' '}
            <Link
              eventLabel="Exit to SpaceX Recaps YouTube channel"
              to="https://www.youtube.com/channel/UC0xhru07vavdPOqJxKRzPrg"
              title="Jack Lishman's YouTube channel"
            >
              Jack Lishman
            </Link>
            . All rights maintained by the respective owners.
            <br />
            This site is fan-run and not affiliated with SpaceX in any way. For
            official information and news, please visit{' '}
            <Link
              eventLabel="Exit to SpaceX official website"
              to="http://www.spacex.com"
              title="Official SpaceX website"
            >
              www.spacex.com
            </Link>
            .
          </Text>
          <Text>
            Original site concept and design by /u/EchoLogic, now recoded by
            /u/kornelord with{' '}
            <Link
              eventLabel="Exit to GatsbyJS website"
              to="https://www.gatsbyjs.org/"
              title="GatsbyJS"
            >
              GatsbyJS
            </Link>{' '}
            and{' '}
            <Link
              eventLabel="Exit to r/spacex's API"
              to="https://github.com/r-spacex/SpaceX-API"
              title="r/spacex's API"
            >
              r/spacex’s API
            </Link>
            .<br />
            Contact for feedback:{' '}
            <Link
              eventLabel="Exit to kornelord's profile"
              to="https://www.reddit.com/user/kornelord"
              title="kornelord's Reddit profile"
            >
              /u/kornelord on Reddit
            </Link>
            ,{' '}
            <Link
              eventLabel="Exit to Albéric Trancart's profile"
              to="https://twitter.com/alberictrancart"
              title="kornelord's Twitter profile"
            >
              Albéric Trancart on Twitter
            </Link>
            .
          </Text>
          <Text>
            Domain name rehosted by{' '}
            <Link
              eventLabel="Exit to Brandtamos' profile"
              to="https://www.reddit.com/user/brandtamos"
              title="Brandtamos' Reddit profile"
            >
              /u/brandtamos
            </Link>
            .
            <br />
            <Link
              eventLabel="Exit to Github Repo"
              to="https://github.com/r-spacex/spacexstats-react"
              title="Contribute!"
            >
              GitHub repository
            </Link>
          </Text>
        </FooterWrapper>
      </WhiteBackground>
    </FooterBackground>
  );
};

export default Footer;
