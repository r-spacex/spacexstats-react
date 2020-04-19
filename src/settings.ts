import { chartColors } from 'stylesheet';

const commonChartOptions = {
  defaultFontFamily: 'Noto Sans',
  defaultFontColor: chartColors.white,
  defaultColor: chartColors.white,
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
          stacked: true,
          gridLines: {
            display: false,
            color: chartColors.white,
          },
          ticks: {
            fontColor: chartColors.white,
          },
        },
      ],
      yAxes: [
        {
          stacked: true,
          gridLines: {
            color: chartColors.grey,
          },
          ticks: {
            fontColor: chartColors.white,
          },
        },
      ],
    },
  },
};
