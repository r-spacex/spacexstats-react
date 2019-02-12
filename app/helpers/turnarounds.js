import settings from '~/settings';

const timelines = pastLaunches => {
  const quickestTurnarounds = {
    ccafs_slc_40: {
      turnaround: null,
      mission1: null,
      mission2: null,
      previousMission: null
    },
    ksc_lc_39a: {
      turnaround: null,
      mission1: null,
      mission2: null,
      previousMission: null
    },
    vafb_slc_4e: {
      turnaround: null,
      mission1: null,
      mission2: null,
      previousMission: null
    }
  };
  let quickestTurnaroundPad = null;
  let quickestTurnaroundPadName = '';

  const labels = [];
  const daysIntervals = new Array(pastLaunches.length - 1).fill(0);
  const runningAverageData = new Array(pastLaunches.length - 1).fill(0);
  const runningAverage10FlightsData = new Array(pastLaunches.length - 1).fill(0);
  let runningAverage = 0;
  let runningAverage10Flights = 0;

  for (let i = 1; i < pastLaunches.length; i++) {
    const launch = pastLaunches[i];

    const launchDate = new Date(launch.launch_date_utc).getTime() / 1000;
    const previousLaunchDate = new Date(pastLaunches[i - 1].launch_date_utc).getTime() / 1000;
    const turnaround = launchDate - previousLaunchDate;

    // Fill bar chart
    labels.push(
      `#${launch.flight_number} ${launch.rocket.rocket_name} ${launch.rocket.second_stage.payloads[0].payload_id}`
    );
    const interval = Math.round(turnaround / (24 * 3600));
    daysIntervals[i - 1] = interval;
    runningAverage = Math.round((runningAverage * (i - 1) + interval) / i);
    runningAverageData[i - 1] = runningAverage;

    if (i < 10) {
      runningAverage10Flights = runningAverage;
    } else {
      // If we compute for 10 flights there are 9 intervals
      runningAverage10Flights = (runningAverage10Flights * 9 - daysIntervals[i - 10]) / 8;
      runningAverage10Flights = Math.round((runningAverage10Flights * 8 + interval) / 9);
    }
    runningAverage10FlightsData[i - 1] = runningAverage10Flights;

    // Ignore Kwajalein for pad stats
    if (launch.launch_site.site_id !== 'kwajalein_atoll') {
      // Check if quicker than current turnaround for the pad
      const launchpad = launch.launch_site.site_id;
      const quickestPadTurnaround = quickestTurnarounds[launchpad];
      const padTurnaround = launchDate - quickestPadTurnaround.previousMission;
      const currentMissionName = launch.rocket.second_stage.payloads[0].payload_id;

      // This is the first mission accounted for this pad
      if (quickestPadTurnaround.previousMission === null) {
        quickestTurnarounds[launchpad].mission1 = launch.rocket.second_stage.payloads[0].payload_id;
      } else if (quickestPadTurnaround.previousMission !== null && quickestPadTurnaround.turnaround === null) {
        quickestTurnarounds[launchpad] = {
          turnaround: padTurnaround,
          mission1: quickestPadTurnaround.previousMissionName,
          mission2: currentMissionName
        };
      } else if (quickestPadTurnaround.previousMission !== null && padTurnaround < quickestPadTurnaround.turnaround) {
        quickestTurnarounds[launchpad] = {
          turnaround: padTurnaround,
          mission1: quickestPadTurnaround.previousMissionName,
          mission2: currentMissionName
        };
      }
      quickestTurnarounds[launchpad].previousMission = launchDate;
      quickestTurnarounds[launchpad].previousMissionName = currentMissionName;

      // Check if quickest turnaround ever
      if (quickestTurnaroundPad === null || padTurnaround < quickestTurnarounds[quickestTurnaroundPad].turnaround) {
        quickestTurnaroundPad = launchpad;
        quickestTurnaroundPadName = launch.launch_site.site_name;
      }
    }
  }

  let options = JSON.parse(JSON.stringify(settings.DEFAULTCHARTOPTIONS)); // Clone object
  options = Object.assign(options, JSON.parse(JSON.stringify(settings.DEFAULTBARCHARTOPTIONS)));
  options.scales.xAxes[0].ticks.display = false;
  options.scales.xAxes[0].stacked = false;
  options.scales.yAxes[0].stacked = false;
  options.tooltips = { mode: 'label' };

  const daysBetweenLaunches = {
    data: {
      labels,
      datasets: [
        {
          label: 'Running average (10 flights)',
          type: 'line',
          data: runningAverage10FlightsData,
          fill: false,
          borderColor: settings.COLORS.yellow,
          backgroundColor: settings.COLORS.yellow,
          pointBorderColor: settings.COLORS.yellow,
          pointBackgroundColor: settings.COLORS.yellow,
          pointHoverBackgroundColor: settings.COLORS.yellow,
          pointHoverBorderColor: settings.COLORS.yellow
        },
        {
          label: 'Running average',
          type: 'line',
          data: runningAverageData,
          fill: false,
          borderColor: settings.COLORS.white,
          backgroundColor: settings.COLORS.white,
          pointBorderColor: settings.COLORS.white,
          pointBackgroundColor: settings.COLORS.white,
          pointHoverBackgroundColor: settings.COLORS.white,
          pointHoverBorderColor: settings.COLORS.white
        },
        {
          label: 'Days between launches',
          backgroundColor: settings.COLORS.blue,
          data: daysIntervals
        }
      ]
    },
    options
  };

  const lastLaunchDate = pastLaunches[0].launch_date_utc;

  return {
    quickestTurnaround: quickestTurnarounds[quickestTurnaroundPad],
    quickestTurnaroundPadName,
    quickestTurnaroundSLC40: quickestTurnarounds.ccafs_slc_40,
    quickestTurnaroundHLC39A: quickestTurnarounds.ksc_lc_39a,
    quickestTurnaroundSLC4E: quickestTurnarounds.vafb_slc_4e,
    lastLaunchDate: new Date(lastLaunchDate).getTime(),
    daysBetweenLaunches
  };
};

export default timelines;
