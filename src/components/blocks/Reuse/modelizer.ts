import settings from 'settings';
import { chartColors } from 'stylesheet';
import { formatDuration } from 'utils/date';
import { SpaceXData, Core, Launch, CoreStatus } from 'types';
import { ChartData, ChartOptions } from 'chart.js';
import deepmerge from 'deepmerge';
import orderBy from 'lodash/orderBy';
import { getMissions } from 'utils/launch';

interface Turnaround {
  core: string;
  launch1: string;
  launch2: string;
  turnaround: string;
  turnaroundTime: number;
}

export interface ModelizedSectionData {
  reflownLaunchesCount: number;
  mostLaunches: {
    data: ChartData;
    options: ChartOptions;
  };
  mostReflownCore: {
    serial: string;
    missions: string;
  };
  quickestReuseTurnaround: Turnaround;
  reflownFairingsCount: number;
}

const buildMostLaunchesChart = (cores: Core[], launches: Launch[]) => {
  const sortedCores = orderBy(
    cores,
    [
      'reuse_count',
      (core) =>
        core.status === CoreStatus.active || core.status === CoreStatus.unknown
          ? 0
          : 1,
      'serial',
    ],
    ['desc', 'asc', 'asc'],
  ).slice(0, 9);

  const data = {
    labels: sortedCores.map((core) => core.serial),
    datasets: [
      {
        label: 'Lost cores',
        backgroundColor: chartColors.orange,
        data: sortedCores.map((core) =>
          core.status === CoreStatus.lost || core.status === CoreStatus.expended
            ? core.reuse_count + 1
            : 0,
        ),
      },
      {
        label: 'Retired cores',
        backgroundColor: chartColors.white,
        data: sortedCores.map((core) =>
          core.status === CoreStatus.inactive ||
          core.status === CoreStatus.retired
            ? core.reuse_count + 1
            : 0,
        ),
      },
      {
        label: 'Active cores',
        backgroundColor: chartColors.blue,
        data: sortedCores.map((core) =>
          core.status === CoreStatus.active ||
          core.status === CoreStatus.unknown
            ? core.reuse_count + 1
            : 0,
        ),
      },
    ],
  };

  const customOptions: ChartOptions = {
    tooltips: {
      callbacks: {
        label: (tooltipItem) => {
          const currentCore = sortedCores.find(
            (core) => core.serial === tooltipItem.xLabel,
          )!;
          const missions = getMissions(currentCore, launches)
            .map((mission) => mission.name)
            .join(', ');

          return tooltipItem.value && parseInt(tooltipItem.value) > 0
            ? `Launches: ${parseInt(
                tooltipItem.value,
              ).toLocaleString()} (${missions})`
            : '';
        },
      },
    },
  };
  const options = deepmerge(settings.DEFAULTBARCHARTOPTIONS, customOptions);
  if (options.scales?.xAxes?.length) {
    options.scales.xAxes[0].stacked = true;
  }
  if (options.scales?.yAxes?.length) {
    options.scales.yAxes[0].ticks.stepSize = 1;
  }

  return { data, options, mostLaunchedCore: sortedCores[0] };
};

const getQuickestReuseTurnaround = (cores: Core[], pastLaunches: Launch[]) => {
  const reusedCores = cores.filter((core) => core.reuse_count > 0);

  const turnarounds: Turnaround[] = [];
  reusedCores.forEach((core) => {
    core.launches.forEach((launchId, index) => {
      if (index === 0) {
        return;
      }

      const launch1 = pastLaunches.find(
        (launch) => launch.id === core.launches[index - 1],
      );
      const launch2 = pastLaunches.find((launch) => launch.id === launchId);

      if (!launch1 || !launch2) {
        return;
      }

      const turnaround = launch2.date_unix - launch1.date_unix;

      turnarounds.push({
        core: core.serial,
        launch1: launch1.name,
        launch2: launch2.name,
        turnaround: formatDuration(turnaround),
        turnaroundTime: turnaround,
      });
    });
  });

  const sortedTurnarounds = orderBy(turnarounds, 'turnaroundTime', 'asc');

  return sortedTurnarounds[0];
};

export const modelizer = ({
  pastLaunches,
  cores,
}: SpaceXData): ModelizedSectionData => {
  const reflownLaunchesCount = cores.reduce(
    (sum, currentCore) => (sum += currentCore.reuse_count),
    0,
  );

  const mostLaunches = buildMostLaunchesChart(cores, pastLaunches);
  const { mostLaunchedCore } = mostLaunches;

  const reflownFairingsCount = pastLaunches.filter(
    (launch) => launch.fairings?.reused,
  ).length;

  return {
    reflownLaunchesCount,
    mostLaunches,
    mostReflownCore: {
      serial: mostLaunchedCore.serial,
      missions: getMissions(mostLaunchedCore, pastLaunches)
        .map((launch) => launch.name)
        .join(', '),
    },
    quickestReuseTurnaround: getQuickestReuseTurnaround(cores, pastLaunches),
    reflownFairingsCount,
  };
};
