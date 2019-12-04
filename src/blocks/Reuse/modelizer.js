import settings from 'settings';
import { chartColors } from 'stylesheet';
import { formatDuration } from 'utils';

const modelizer = ({ pastLaunches }) => {
  let totalReflown = 0;
  let totalFairingsReflown = 0;
  const cores = {};
  let quickestTurnaround = null;
  let quickestTurnaroundCore = null;
  let mostReflownCore = null;
  let quickestTurnaroundMission1 = null;
  let quickestTurnaroundMission2 = null;

  const notFalcon1Launches = pastLaunches.filter(launch => launch.rocket.rocket_id !== 'falcon1');

  // Reuse intervals chart
  const labels = [];
  const daysIntervals = [];
  const runningAverageData = [];
  const runningAverage10FlightsData = [];
  let runningAverage = 0;
  let runningAverage10Flights = 0;
  let reflownMissions = 0;

  for (let i = 0; i < notFalcon1Launches.length; i++) {
    const launch = notFalcon1Launches[i];
    const launchDate = new Date(launch.launch_date_utc).getTime() / 1000;
    let turnaround = null;

    if (launch.reuse.fairings) {
      totalFairingsReflown += 1;
    }

    launch.rocket.first_stage.cores.forEach(core => {
      const coreSerial = core.core_serial;

      if (!(coreSerial in cores)) {
        cores[coreSerial] = {
          reflown: false,
          launches: []
        };
      } else {
        totalReflown += 1;
        cores[coreSerial].reflown = true;
        const previousLaunches = cores[coreSerial].launches;
        const previousLaunch = previousLaunches[previousLaunches.length - 1];
        turnaround = launchDate - previousLaunch.date;

        // Check for most reflown core
        if (mostReflownCore === null || previousLaunches.length + 1 > cores[mostReflownCore].launches.length) {
          mostReflownCore = coreSerial;
        }

        // Check for quickest turnaround
        if (quickestTurnaround === null || turnaround < quickestTurnaround) {
          quickestTurnaround = turnaround;
          quickestTurnaroundCore = coreSerial;
          quickestTurnaroundMission1 = previousLaunch.name;
          quickestTurnaroundMission2 = launch.rocket.second_stage.payloads[0].payload_id;
        }
      }

      cores[coreSerial].launches.push({
        name: launch.rocket.second_stage.payloads[0].payload_id,
        date: launchDate,
        turnaround
      });

      // Reuse intervals
      if (cores[coreSerial].launches.length > 1) {
        reflownMissions += 1;
        labels.push(
          `${coreSerial}'s flight #${cores[coreSerial].launches.length} ${launch.rocket.second_stage.payloads[0].payload_id}`
        );
        const interval = Math.round(turnaround / (24 * 3600));
        daysIntervals.push(interval);
        runningAverage = Math.round((runningAverage * (reflownMissions - 1) + interval) / reflownMissions); // eslint-disable-line max-len
        runningAverageData.push(runningAverage);

        if (reflownMissions < 10) {
          runningAverage10Flights = runningAverage;
        } else {
          // If we compute for 10 flights there are 9 intervals
          runningAverage10Flights = (runningAverage10Flights * 9 - daysIntervals[reflownMissions - 10]) / 8; // eslint-disable-line max-len
          runningAverage10Flights = Math.round((runningAverage10Flights * 8 + interval) / 9);
        }
        runningAverage10FlightsData.push(runningAverage10Flights);
      }
    });
  }

  // Get mission names of most reflown core
  const mostReflownCoreMissions = [];
  cores[mostReflownCore].launches.forEach(launch => {
    mostReflownCoreMissions.push(launch.name);
  });

  let options = JSON.parse(JSON.stringify(settings.DEFAULTCHARTOPTIONS)); // Clone object
  options = Object.assign(options, JSON.parse(JSON.stringify(settings.DEFAULTBARCHARTOPTIONS)));
  options.scales.xAxes[0].ticks.display = false;
  options.scales.xAxes[0].stacked = false;
  options.scales.yAxes[0].stacked = false;
  options.scales.yAxes[0].ticks.min = 0;
  options.tooltips = { mode: 'label' };

  const daysBetweenReuses = {
    data: {
      labels,
      datasets: [
        {
          label: 'Running average (10 flights)',
          type: 'line',
          data: runningAverage10FlightsData,
          fill: false,
          borderColor: chartColors.yellow,
          backgroundColor: chartColors.yellow,
          pointBorderColor: chartColors.yellow,
          pointBackgroundColor: chartColors.yellow,
          pointHoverBackgroundColor: chartColors.yellow,
          pointHoverBorderColor: chartColors.yellow
        },
        {
          label: 'Running average',
          type: 'line',
          data: runningAverageData,
          fill: false,
          borderColor: chartColors.white,
          backgroundColor: chartColors.white,
          pointBorderColor: chartColors.white,
          pointBackgroundColor: chartColors.white,
          pointHoverBackgroundColor: chartColors.white,
          pointHoverBorderColor: chartColors.white
        },
        {
          label: 'Days between launches',
          backgroundColor: chartColors.blue,
          data: daysIntervals
        }
      ]
    },
    options
  };

  return {
    totalReflown,
    totalFairingsReflown,
    quickestReuseTurnaround: {
      core: quickestTurnaroundCore,
      mission1: quickestTurnaroundMission1,
      mission2: quickestTurnaroundMission2,
      turnaround: formatDuration(quickestTurnaround)
    },
    mostReflownCore: {
      launches: cores[mostReflownCore].launches.length,
      missions: mostReflownCoreMissions.join(', '),
      core: mostReflownCore
    },
    daysBetweenReuses
  };
};

export default modelizer;
