import request from 'superagent';

export const apiGet = uri => new Promise(resolve =>
  request.get(`https://api.spacexdata.com/v2${uri}`).then(data => resolve(data)));

export const isInViewport = (testAnchor) => {
  const rect = document.getElementById(`section-${testAnchor}`).getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  return rect.top >= -(viewportHeight / 2) && rect.top < (viewportHeight / 2);
};
