import axios from 'axios';

export const apiGet = uri =>
  new Promise(resolve => axios.get(`https://api.spacexdata.com/v2${uri}`).then(({ data }) => resolve(data)));

export const isInViewport = testAnchor => {
  const element = document.getElementById(testAnchor);

  if (!element) {
    console.error(`Anchor ${testAnchor} not found.`);
    return false;
  }

  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  return rect.top >= -(viewportHeight / 2) && rect.top < viewportHeight / 2;
};

export const scrollTo = testAnchor => {
  const element = document.getElementById(testAnchor);

  if (!element) {
    console.error(`Anchor ${testAnchor} not found.`);
    return;
  }

  element.scrollIntoView({ behavior: 'smooth' });
};

export const fromUnix = unixDate => new Date(unixDate * 1000);
