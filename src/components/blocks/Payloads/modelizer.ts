import settings from 'settings';
import { chartColors } from 'stylesheet';
import { ChartOptions, ChartData } from 'chart.js';
import deepmerge from 'deepmerge';
import { SpaceXData, Launch, Orbit, Payload } from 'types';
import orderBy from 'lodash/orderBy';
import range from 'lodash/range';

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
    launch.rocket.second_stage.payloads.forEach((payload) => {
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
  const years = range(yearsStart, yearsEnd + 1).map((year) => String(year));

  const payloads: LaunchPayload[] = [];
  pastLaunches.forEach((launch) => {
    launch.rocket.second_stage.payloads.forEach((payload) => {
      if (!Object.values(Orbit).includes(payload.orbit)) {
        console.warn(
          `Unhandled orbit: ${payload.orbit} for launch ${launch.mission_name}`,
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
            launch.launch_year === year && orbits.includes(payload.orbit),
        )
        .reduce(
          (sum, { payload: { payload_mass_kg } }) => sum + payload_mass_kg,
          0,
        ),
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
        backgroundColor: chartColors.red,
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
}: SpaceXData): ModelizedSectionData => {
  const launchMasses = pastLaunches.map((launch) => ({
    launch,
    mass: launch.rocket.second_stage.payloads.reduce(
      (sum, payload) => sum + payload.payload_mass_kg,
      0,
    ),
  }));

  const sortedLaunchMasses = orderBy(launchMasses, 'mass', 'desc');
  const heaviestPayloadLaunch = sortedLaunchMasses[0];
  const heaviestPayload = {
    mass: heaviestPayloadLaunch.mass,
    mission: heaviestPayloadLaunch.launch.mission_name,
    customers: heaviestPayloadLaunch.launch.rocket.second_stage.payloads[0].customers.join(
      ', ',
    ),
  };

  const heaviestPayloadLaunchGTO = sortedLaunchMasses.filter(
    ({ launch }) => launch.rocket.second_stage.payloads[0].orbit === Orbit.gto,
  )[0];
  const heaviestPayloadGTO = {
    mass: heaviestPayloadLaunchGTO.mass,
    mission: heaviestPayloadLaunchGTO.launch.mission_name,
    customers: heaviestPayloadLaunchGTO.launch.rocket.second_stage.payloads[0].customers.join(
      ', ',
    ),
  };

  return {
    customers: buildCustomersChart(pastLaunches),
    upmassPerYear: buildUpmassPerYearChart(pastLaunches),
    totalMass: Math.floor(
      launchMasses.reduce((sum, { mass }) => sum + mass, 0) / 1000,
    ),
    heaviestPayload,
    heaviestPayloadGTO,
  };
};
