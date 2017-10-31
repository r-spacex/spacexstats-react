const isInViewport = (testAnchor) => {
  const rect = document.getElementById('section-' + testAnchor).getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  return rect.top >= - (viewportHeight / 2) && rect.top < (viewportHeight / 2);
};

export default {
  isInViewport,
};
