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
import { isInViewport, updateHash, getScrollPercentage } from 'utils/scroll';
import { actions, sections } from 'redux/navigation';
import { SpaceXData } from 'types';

const Root: React.FC<SpaceXData> = (data) => {
  const dispatch = useDispatch();

  useEffect(() => {
    NProgress.configure({ minimum: 0, trickle: false, showSpinner: false });
    NProgress.start();

    ReactGA.initialize('UA-108091199-1');
    ReactGA.pageview('/');

    setTimeout(() => {
      if (window.location.hash !== '') {
        const section = window.location.hash.replace('#', '');
        dispatch(actions.navigateTo({ section, down: true }));
      }
    }, 1000);

    window.addEventListener('scroll', () => {
      NProgress.set(getScrollPercentage());
      const currentSection = sections.find((section) => isInViewport(section));
      if (currentSection) {
        updateHash(currentSection);
      }
    });
  }, []);

  return (
    <>
      <StyleReset />

      <Upcoming {...data} />

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
      
      <Footer />
      */}
    </>
  );
};

export default Root;
