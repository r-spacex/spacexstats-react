const colors = {
  white: '#FAFAFA',
  yellow: '#ccac55',
  brown: '#69551f',
  red: 'crimson',
  blue: 'steelblue',
  green: 'mediumseagreen',
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
    tooltips: {
      mode: 'index',
      intersect: false
    },
    responsive: true,
    maintainAspectRatio: false,
  },
  DEFAULTBARCHARTOPTIONS: {
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
    }
  },
};
