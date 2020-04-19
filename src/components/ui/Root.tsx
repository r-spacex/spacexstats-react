import React, { useEffect } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import ReactGA from 'react-ga';
import { useDispatch } from 'react-redux';
import {
  Upcoming,
  // Dragon,
  // Landing,
  // LaunchCount,
  // LaunchHistory,
  // LaunchPads,
  // Payloads,
  // People,
  // Reuse,
  // Starlink,
  // Starship,
  // Timelines,
  // Turnarounds,
  Footer,
} from 'components/blocks';
import StyleReset from 'components/ui/StyleReset';
import { getScrollPercentage } from 'utils/scroll';
import { actions, sections, SectionId } from 'redux/navigation';
import { SpaceXData } from 'types';

const Root: React.FC<SpaceXData> = (data) => {
  const dispatch = useDispatch();

  useEffect(() => {
    NProgress.configure({ minimum: 0, trickle: false, showSpinner: false });
    NProgress.start();

    if (typeof window === 'undefined') {
      return;
    }

    ReactGA.initialize('UA-108091199-1');
    ReactGA.pageview('/');

    setTimeout(async () => {
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
        dispatch(
          actions.navigateTo({
            section: section as SectionId,
            down: true,
          }),
        );
      }
    }, 700);

    window.addEventListener('scroll', () => {
      NProgress.set(getScrollPercentage());
    });
  }, []);

  return (
    <>
      <StyleReset />

      <Upcoming data={data} id="upcoming" downSection="about" />

      {/* 
      <LaunchCount {...data} />

      <LaunchHistory {...data} />

      <LaunchPads {...data} />

      <Landing {...data} />

      <Reuse {...data} />

      <Turnarounds {...data} />

      <Payloads {...data} />

      <Dragon {...data} />

      <People {...data} />

      <Starlink {...data} />

      <Starship {...data} />

      <Timelines {...data} /> 
      
    */}
      <Footer />
    </>
  );
};

export default Root;
