// Colourblind friendly palette
const colors = {
  white: '#FAFAFA',
  yellow: '#F0E442',
  orange: '#e79f00',
  brown: '#69551f',
  red: '#D55E00',
  lightblue: '#9ad0f3',
  blue: '#0072B2',
  green: '#009E73',
  pink: '#CC79A7',
  black: '#000000',
};

export default {
  // Colors used by charts
  COLORS: colors,
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
        fontColor: colors.white,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  },
  DEFAULTBARCHARTOPTIONS: {
    pan: {
      enabled: true,
      mode: 'x',
      rangeMin: {
        x: 0,
      },
    },
    zoom: {
      enabled: true,
      drag: false,
      mode: 'x',
      rangeMin: {
        x: 0,
      },
    },
    scales: {
      xAxes: [{
        stacked: true,
        gridLines: {
          display: false,
          color: colors.white,
        },
        ticks: {
          fontFamily: 'Brandon',
          fontColor: colors.white,
        },
      }],
      yAxes: [{
        stacked: true,
        gridLines: {
          display: false,
          color: colors.white,
        },
        ticks: {
          fontFamily: 'Brandon',
          fontColor: colors.white,
        },
      }]
    },
  },
};
