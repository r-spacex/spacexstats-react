import { chartColors } from 'stylesheet';

const commonChartOptions = {
  defaultFontFamily: 'Noto Sans',
  defaultFontColor: chartColors.white,
  defaultColor: chartColors.white,
  title: {
    display: false,
  },
  legend: {
    position: 'bottom',
    labels: {
      fontColor: chartColors.white,
    },
  },
  responsive: true,
  maintainAspectRatio: false,
};

export default {
  // Colors used by charts
  DEFAULTCHARTOPTIONS: {
    ...commonChartOptions,
  },
  DEFAULTBARCHARTOPTIONS: {
    ...commonChartOptions,
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
      xAxes: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            fontColor: chartColors.white,
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            display: true,
            color: chartColors.white,
            zeroLineColor: chartColors.white,
          },
          ticks: {
            fontColor: chartColors.white,
          },
        },
      ],
    },
  },
};
