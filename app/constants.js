export default {
  // Colors used by charts
  COLORS: {
    white: '#FAFAFA',
    yellow: '#ccac55',
    brown: '#69551f',
    red: 'crimson',
    blue: 'steelblue',
    green: 'mediumseagreen',
  },
  DEFAULTCHARTOPTIONS: {
    title: {
      display: false,
    },
    layout: {
      padding: {
        left: 14,
        right: 14,
        top: 0,
        bottom: 0,
      },
    },
    legend: {
      position: 'bottom',
      labels: {
        fontFamily: 'Brandon',
        fontColor: '#FAFAFA',
      },
    },
    tooltips: {
      mode: 'index',
      intersect: false
    },
    responsive: true,
    maintainAspectRatio: false,
  }
};
