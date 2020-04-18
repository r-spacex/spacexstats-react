export const isInViewport = (testAnchor) => {
  const element = document.getElementById(testAnchor);

  if (!element) {
    return false;
  }

  const rect = element.getBoundingClientRect();
  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight;
  return rect.top >= -(viewportHeight / 2) && rect.top < viewportHeight / 2;
};

export const scrollTo = (testAnchor) => {
  const element = document.getElementById(testAnchor);

  if (!element) {
    return;
  }

  element.scrollIntoView({ behavior: 'smooth' });
};

export const updateHash = (hash) => {
  if (window.history.pushState && hash !== '') {
    window.history.pushState(null, null, `#${hash}`);
  }
};
