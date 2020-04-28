import { sections } from 'redux/navigation';

const isInViewport = (testAnchor: string) => {
  const element = document.getElementById(testAnchor);

  if (!element) {
    return false;
  }

  const rect = element.getBoundingClientRect();
  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight;
  return rect.top >= -(viewportHeight / 2) && rect.top < viewportHeight / 2;
};

const updateHash = (hash: string) => {
  if (window.history.pushState && hash !== '') {
    window.history.pushState(null, 'Scroll page', `#${hash}`);
  }
};

export const updateSectionUrl = () => {
  if (typeof window === 'undefined') {
    return '';
  }
  sections.forEach((sectionId) => {
    if (!isInViewport(sectionId)) {
      return;
    }
    const currentTab = document.getElementById(sectionId)?.dataset['tab'];
    if (currentTab) {
      updateHash(`${sectionId}-${currentTab}`);
    } else {
      updateHash(sectionId);
    }
  });
};

export const scrollTo = (testAnchor: string, smooth = true) => {
  const element = document.getElementById(testAnchor);

  if (!element) {
    return;
  }

  if (smooth) {
    element.scrollIntoView({ behavior: 'smooth' });
  } else {
    element.scrollIntoView();
  }

  const sectionTitle = element.querySelector(
    'h1, h2, h3, h4, h5, h6',
  ) as HTMLElement;
  if (sectionTitle) {
    sectionTitle.focus({ preventScroll: true });
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
