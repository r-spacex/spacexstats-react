import settings from 'settings';
import { chartColors } from 'stylesheet';
import { ChartOptions } from 'chart.js';
import deepmerge from 'deepmerge';
import { Launch, Launchpad } from 'types';

export const buildLaunchesPerLaunchpadChart = (pastLaunches: Launch[]) => {
  const launchesPerRocket = {
    'Kwajalein Atoll': pastLaunches.filter(
      ({ launch_site }) => launch_site.site_id === Launchpad.kwajalein,
    ).length,
    'Vandenberg Air Force Base SLC 4E': pastLaunches.filter(
      ({ launch_site }) => launch_site.site_id === Launchpad.vafb,
    ).length,
    'Cape Canaveral Air Force Station SLC 40': pastLaunches.filter(
      ({ launch_site }) => launch_site.site_id === Launchpad.slc40,
    ).length,
    'KSC Historic Launch Complex 39A': pastLaunches.filter(
      ({ launch_site }) => launch_site.site_id === Launchpad.lc39a,
    ).length,
    'Boca Chica, South Texas': 0,
  };

  const data = {
    labels: Object.keys(launchesPerRocket),
    datasets: [
      {
        data: Object.values(launchesPerRocket),
        backgroundColor: [
          chartColors.green,
          chartColors.blue,
          chartColors.yellow,
          chartColors.orange,
          chartColors.grey,
        ],
      },
    ],
  };

  const customOptions: ChartOptions = {};
  const options = deepmerge(settings.DEFAULTCHARTOPTIONS, customOptions);

  return { data, options };
};
