export const isInViewport = (testAnchor: string) => {
  const element = document.getElementById(testAnchor);

  if (!element) {
    return false;
  }

  const rect = element.getBoundingClientRect();
  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight;
  return rect.top >= -(viewportHeight / 2) && rect.top < viewportHeight / 2;
};

export const scrollTo = (testAnchor: string) => {
  const element = document.getElementById(testAnchor);

  if (!element) {
    return;
  }

  element.scrollIntoView();
};

export const updateHash = (hash: string) => {
  if (window.history.pushState && hash !== '') {
    window.history.pushState(null, 'Scroll page', `#${hash}`);
  }
};

export const getScrollPercentage = () => {
  const { body, documentElement } = document;

  return (
    (documentElement.scrollTop || body.scrollTop) /
    ((documentElement.scrollHeight || body.scrollHeight) -
      documentElement.clientHeight)
  );
};
