import settings from 'settings';
import { chartColors } from 'stylesheet';
import { ChartOptions, ChartData } from 'chart.js';
import deepmerge from 'deepmerge';
import { SpaceXStatsData, Launch, Orbit, Payload } from 'types';
import orderBy from 'lodash/orderBy';
import range from 'lodash/range';
import { launchYear, getPayload } from 'utils/launch';

export interface ModelizedSectionData {
  customers: {
    data: ChartData;
    options: ChartOptions;
  };
  upmassPerYear: {
    data: ChartData;
    options: ChartOptions;
  };
  totalMass: number;
  heaviestPayload: {
    mass: number;
    mission: string;
    customers: string;
  };
  heaviestPayloadGTO: {
    mass: number;
    mission: string;
    customers: string;
  };
}

const buildCustomersChart = (pastLaunches: Launch[]) => {
  const customers = { NASA: 0, Commercial: 0, SpaceX: 0, USAF: 0, NRO: 0 };

  pastLaunches.forEach((launch) => {
    launch.payloads.forEach((payload) => {
      if (payload.customers.length === 0) {
        return;
      }

      // Only consider first customer
      const customer = payload.customers[0];

      if (customer.includes('NASA')) {
        customers.NASA += 1;
      } else if (
        customer === 'SpaceX' ||
        customer === 'USAF' ||
        customer === 'NRO'
      ) {
        customers[customer] += 1;
      } else {
        customers.Commercial += 1;
      }
    });
  });

  const data = {
    labels: Object.keys(customers),
    datasets: [
      {
        data: Object.values(customers),
        backgroundColor: [
          chartColors.blue,
          chartColors.lightblue,
          chartColors.white,
          chartColors.yellow,
          chartColors.orange,
        ],
      },
    ],
  };

  const customOptions: ChartOptions = {
    tooltips: {
      callbacks: {
        label: (tooltipItem) => {
          if (
            tooltipItem.index === undefined ||
            !Object.keys(customers)[tooltipItem.index]
          ) {
            return ``;
          }
          const customer = Object.keys(customers)[tooltipItem.index];
          const launchCount = Object.values(customers)[tooltipItem.index];

          return `${customer}: ${launchCount} launches (${(
            (100 * launchCount) /
            pastLaunches.length
          ).toFixed(0)}%)`;
        },
      },
    },
  };
  const options = deepmerge(settings.DEFAULTCHARTOPTIONS, customOptions);

  return { data, options };
};

interface LaunchPayload {
  launch: Launch;
  payload: Payload;
}

const buildUpmassPerYearChart = (pastLaunches: Launch[]) => {
  const yearsStart = 2012; // Going beyond suborbital a decade before BO
  const yearsEnd = new Date().getFullYear();
  const years = range(yearsStart, yearsEnd + 1);

  const payloads: LaunchPayload[] = [];
  pastLaunches.forEach((launch) => {
    launch.payloads.forEach((payload) => {
      payloads.push({
        launch,
        payload,
      });
    });
  });

  const getMassForYear = (orbits: Orbit[]) =>
    years.map((year) =>
      payloads
        .filter(
          ({ launch, payload }) =>
            launchYear(launch) === year &&
            payload.orbit !== null &&
            orbits.includes(payload.orbit),
        )
        .reduce((sum, { payload: { mass } }) => sum + (mass ?? 0), 0),
    );

  const data = {
    labels: years,
    datasets: [
      {
        label: 'LEO',
        backgroundColor: chartColors.blue,
        data: getMassForYear([Orbit.leo, Orbit.meo]),
      },
      {
        label: 'ISS',
        backgroundColor: chartColors.lightblue,
        data: getMassForYear([Orbit.iss]),
      },
      {
        label: 'Polar',
        backgroundColor: chartColors.yellow,
        data: getMassForYear([Orbit.po]),
      },
      {
        label: 'GTO',
        backgroundColor: chartColors.orange,
        data: getMassForYear([Orbit.gto, Orbit.sso]),
      },
      {
        label: 'Interplanetary',
        backgroundColor: chartColors.green,
        data: getMassForYear([Orbit.interplanetary, Orbit.cislunar]),
      },
    ],
  };

  const customOptions: ChartOptions = {
    tooltips: {
      mode: 'x',
      callbacks: {
        label: (tooltipItem) => {
          if (
            tooltipItem.datasetIndex === undefined ||
            !data.datasets[tooltipItem.datasetIndex]
          ) {
            return '';
          }
          const dataset = data.datasets[tooltipItem.datasetIndex];
          return `${dataset.label}: ${Math.floor(
            Number(tooltipItem.yLabel) / 1000,
          ).toLocaleString()}t`;
        },
        footer: (tooltipItems) => {
          const totalCount = tooltipItems.reduce(
            (sum, tooltipItem) => sum + (tooltipItem.yLabel as number),
            0,
          );
          return `TOTAL: ${Math.floor(totalCount / 1000).toLocaleString()}t`;
        },
      },
    },
  };
  const options = deepmerge(settings.DEFAULTBARCHARTOPTIONS, customOptions);
  if (options.scales?.xAxes?.length) {
    options.scales.xAxes[0].stacked = true;
  }
  if (options.scales?.yAxes?.length) {
    options.scales.yAxes[0].stacked = true;
    options.scales.yAxes[0].ticks.callback = (label) =>
      `${Math.floor(Number(label) / 1000).toLocaleString()}t`;
  }

  return { data, options };
};

export const modelizer = ({
  pastLaunches,
}: SpaceXStatsData): ModelizedSectionData => {
  const launchMasses = pastLaunches.map((launch) => ({
    launch,
    mass: launch.payloads.reduce(
      (sum, payload) => sum + (payload.mass ?? 0),
      0,
    ),
  }));

  const sortedLaunchMasses = orderBy(launchMasses, 'mass', 'desc');
  const heaviestPayloadLaunch = sortedLaunchMasses[0];
  const heaviestPayload = {
    mass: heaviestPayloadLaunch.mass,
    mission: heaviestPayloadLaunch.launch.name,
    customers:
      getPayload(heaviestPayloadLaunch.launch)?.customers.join(', ') ??
      'Unknown customer',
  };

  const heaviestPayloadLaunchGTO = sortedLaunchMasses.filter(
    ({ launch }) => getPayload(launch)?.orbit === Orbit.gto,
  )[0];
  const heaviestPayloadGTO = {
    mass: heaviestPayloadLaunchGTO.mass,
    mission: heaviestPayloadLaunchGTO.launch.name,
    customers:
      getPayload(heaviestPayloadLaunchGTO.launch)?.customers.join(', ') ??
      'Unknown customer',
  };

  return {
    customers: buildCustomersChart(pastLaunches),
    upmassPerYear: buildUpmassPerYearChart(pastLaunches),
    totalMass: Math.floor(
      launchMasses.reduce((sum, { mass }) => sum + mass, 0) / 1000,
    ),
    heaviestPayload: heaviestPayload ?? 'Unknown payload',
    heaviestPayloadGTO: heaviestPayloadGTO ?? 'Unknown payload',
  };
};
