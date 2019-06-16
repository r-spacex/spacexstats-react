import axios from 'axios';

// API
export const apiGet = uri =>
  new Promise(resolve => axios.get(`https://api.spacexdata.com/v2${uri}`).then(({ data }) => resolve(data)));

// Scroll
export const isInViewport = testAnchor => {
  const element = document.getElementById(testAnchor);

  if (!element) {
    return false;
  }

  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  return rect.top >= -(viewportHeight / 2) && rect.top < viewportHeight / 2;
};

export const scrollTo = testAnchor => {
  const element = document.getElementById(testAnchor);

  if (!element) {
    return;
  }

  element.scrollIntoView({ behavior: 'smooth' });
};

export const updateHash = hash => {
  if (window.history.pushState && hash !== '') {
    window.history.pushState(null, null, `#${hash}`);
  }
};

// Time
export const fromUnix = unixDate => new Date(unixDate * 1000);

export const formatDuration = durationInSeconds => {
  const SECONDS_PER_DAY = 24 * 3600;
  const days = Math.floor(durationInSeconds / SECONDS_PER_DAY);
  const hours = Math.floor((durationInSeconds - SECONDS_PER_DAY * days) / 3600);

  return `${days} days and ${hours} hours`;
};
