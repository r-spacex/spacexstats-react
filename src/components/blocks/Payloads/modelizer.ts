import settings from 'settings';
import { chartColors } from 'stylesheet';
import { ChartOptions, ChartData } from 'chart.js';
import deepmerge from 'deepmerge';
import { SpaceXData, Launch, Orbit, Payload } from 'types';
import orderBy from 'lodash/orderBy';
import range from 'lodash/range';
import { launchYear, getPayloads, getPayload } from 'utils/launch';

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

const buildCustomersChart = (pastLaunches: Launch[], payloads: Payload[]) => {
  const customers = { NASA: 0, Commercial: 0, SpaceX: 0, USAF: 0, NRO: 0 };
  let numOfPayloadMissions = 0;
  pastLaunches.forEach((launch) => {
    const payload = getPayload(launch, payloads);
    if (payload === null) {
      return;
    } else {
      if (payload.customers.length === 0) {
        return;
      }
      numOfPayloadMissions += 1;
      const customer = payload.customers[0];

      if (customer.includes('NASA')) {
        customers.NASA += 1;
      } else if (customer.includes('SpaceX')) {
        customers.SpaceX += 1;
      } else if (customer.includes('USAF')) {
        customers.USAF += 1;
      } else if (customer.includes('NRO')) {
        customers.NRO += 1;
      } else {
        customers.Commercial += 1;
      }
    }
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
            numOfPayloadMissions
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

const buildUpmassPerYearChart = (
  pastLaunches: Launch[],
  allPayloads: Payload[],
) => {
  const yearsStart = 2012; // Going beyond suborbital a decade before BO
  const yearsEnd = new Date().getFullYear();
  const years = range(yearsStart, yearsEnd + 1);

  const payloads: LaunchPayload[] = [];
  pastLaunches.forEach((launch) => {
    getPayloads(launch, allPayloads).forEach((payload) => {
      if (!Object.values(Orbit).includes(payload.orbit)) {
        console.warn(
          `Unhandled orbit: ${payload.orbit} for launch ${launch.name}`,
        );
      }
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
            launchYear(launch) === year && orbits.includes(payload.orbit),
        )
        .reduce((sum, { payload: { mass_kg } }) => sum + (mass_kg ?? 0), 0),
    );

  const data = {
    labels: years,
    datasets: [
      {
        label: 'LEO',
        backgroundColor: chartColors.blue,
        data: getMassForYear([Orbit.vleo, Orbit.leo, Orbit.meo]),
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
        data: getMassForYear([Orbit.gto, Orbit.sso, Orbit.heo]),
      },
      {
        label: 'Interplanetary',
        backgroundColor: chartColors.green,
        data: getMassForYear([Orbit.hco, Orbit.esl1]),
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
  payloads,
}: SpaceXData): ModelizedSectionData => {
  const launchMasses = pastLaunches.map((launch) => ({
    launch,
    mass: getPayloads(launch, payloads).reduce(
      (sum, payload) => sum + (payload.mass_kg ?? 0),
      0,
    ),
  }));

  const sortedLaunchMasses = orderBy(launchMasses, 'mass', 'desc');
  const heaviestPayloadLaunch = sortedLaunchMasses[0];
  const heaviestPayload = {
    mass: heaviestPayloadLaunch.mass,
    mission: heaviestPayloadLaunch.launch.name,
    customers:
      getPayload(heaviestPayloadLaunch.launch, payloads)?.customers.join(
        ', ',
      ) ?? 'Unknown customer',
  };

  const heaviestPayloadLaunchGTO = sortedLaunchMasses.filter(
    ({ launch }) => getPayload(launch, payloads)?.orbit === Orbit.gto,
  )[0];
  const heaviestPayloadGTO = {
    mass: heaviestPayloadLaunchGTO.mass,
    mission: heaviestPayloadLaunchGTO.launch.name,
    customers:
      getPayload(heaviestPayloadLaunchGTO.launch, payloads)?.customers.join(
        ', ',
      ) ?? 'Unknown customer',
  };

  return {
    customers: buildCustomersChart(pastLaunches, payloads),
    upmassPerYear: buildUpmassPerYearChart(pastLaunches, payloads),
    totalMass: Math.floor(
      launchMasses.reduce((sum, { mass }) => sum + mass, 0) / 1000,
    ),
    heaviestPayload: heaviestPayload ?? 'Unknown payload',
    heaviestPayloadGTO: heaviestPayloadGTO ?? 'Unknown payload',
  };
};
