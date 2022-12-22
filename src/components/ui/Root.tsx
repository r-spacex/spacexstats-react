import React, { useEffect } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import ReactGA from 'react-ga';
import { useDispatch } from 'react-redux';
import {
  Dragon,
  Footer,
  LaunchHistory,
  Payloads,
  People,
  Recovery,
  Reuse,
  Starlink,
  Starship,
  Timelines,
  Upcoming,
} from 'components/blocks';
import StyleReset from 'components/ui/StyleReset';
import { getScrollPercentage, scrollTo, updateSectionUrl } from 'utils/scroll';
import { actions, sections, SectionId } from 'redux/navigation';
import { SpaceXStatsData, BlockProps } from 'types';
import styled from 'styled-components';
import { getSpacing, palette } from 'stylesheet';

const Banner = styled.div`
  background-color: ${palette.yellow};
  color: white;
  padding: ${getSpacing(3)};
`;

const Root: React.FC<SpaceXStatsData> = (data) => {
  const dispatch = useDispatch();

  useEffect(() => {
    NProgress.configure({ minimum: 0, trickle: false, showSpinner: false });
    NProgress.start();

    if (typeof window === 'undefined') {
      return;
    }

    ReactGA.initialize('UA-108091199-1');
    ReactGA.pageview('/');

    if (window.location.hash !== '') {
      const anchorHash = window.location.hash.replace('#', '');
      const [section, tab] = anchorHash.split(/\-(.+)/);

      if (!sections.includes(section as SectionId)) {
        return;
      }

      dispatch(
        actions.changeTab({
          section: section as SectionId,
          tab,
        }),
      );
      scrollTo(section, false);
    }

    setTimeout(() => {
      window.addEventListener('scroll', () => {
        NProgress.set(getScrollPercentage());
        updateSectionUrl();
      });
    }, 300);
  }, []);

  const sectionComponents: {
    id: SectionId;
    Component: React.FC<BlockProps>;
  }[] = [
    { id: 'upcoming', Component: Upcoming },
    { id: 'starship', Component: Starship },
    { id: 'launchhistory', Component: LaunchHistory },
    { id: 'recovery', Component: Recovery },
    { id: 'reuse', Component: Reuse },
    { id: 'payloads', Component: Payloads },
    { id: 'starlink', Component: Starlink },
    { id: 'dragon', Component: Dragon },
    { id: 'people', Component: People },
    { id: 'timelines', Component: Timelines },
  ];

  return (
    <>
      <StyleReset />

      <Banner>
        As some of you already noticed and reported, the stats may be incorrect
        in some places because the r/spacex API is winding down{' '}
        <a href="https://github.com/r-spacex/SpaceX-API/issues/1243">
          (more details on GitHub)
        </a>
        . I&apos;m currently working on a rewrite using the Launch Library 2 but
        it will take some time. I hope to complete the rewrite by the end of the
        year! Thanks again for your messages and support ❤️🚀
      </Banner>

      {sectionComponents.map(({ id, Component }, index) => (
        <Component
          key={id}
          id={id}
          data={data}
          up={index > 0 ? sectionComponents[index - 1].id : undefined}
          down={
            index + 1 < sectionComponents.length
              ? sectionComponents[index + 1].id
              : 'about'
          }
        />
      ))}

      <Footer buildDate={data.buildDate} />
    </>
  );
};

export default Root;
