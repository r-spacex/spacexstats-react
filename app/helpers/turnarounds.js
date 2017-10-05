import constants from 'constants';
import moment from 'moment';

const timelines = (pastLaunches) => {
  const quickestTurnarounds = {
    ccafs_slc_40: {turnaround: null, mission1: null, mission2: null, previousMission: null},
    ksc_lc_39a: {turnaround: null, mission1: null, mission2: null, previousMission: null},
    vafb_slc_4e: {turnaround: null, mission1: null, mission2: null, previousMission: null},
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

    const launchDate = moment(launch.launch_date_utc).unix();
    const previousLaunchDate = moment(pastLaunches[i - 1].launch_date_utc).unix();
    const turnaround = launchDate - previousLaunchDate;

    // Fill bar chart
    // FIXME it's wrong in the API
    const rocketName = launch.rocket.rocket ? launch.rocket.rocket : launch.rocket.rocket_name;
    labels.push(`#${launch.flight_number} ${rocketName} ${launch.payloads[0].payload_id}`);
    const interval = Math.round(turnaround / (24 * 3600));
    daysIntervals[i - 1] = interval;
    runningAverage = Math.round(((runningAverage * (i - 1)) + interval) / i);
    runningAverageData[i - 1] = runningAverage;

    if (i < 10) {
      runningAverage10Flights = runningAverage;
    } else {
      // If we compute for 10 flights there are 9 intervals
      runningAverage10Flights = ((runningAverage10Flights * 9) - daysIntervals[i - 10]) / 8;
      runningAverage10Flights = Math.round(((runningAverage10Flights * 8) + interval) / 9);
    }
    runningAverage10FlightsData[i - 1] = runningAverage10Flights;

    // Ignore Kwajalein for pad stats
    if (launch.launch_site.site_id === 'kwajalein_atoll') {
      continue;
    }

    // Check if quicker than current turnaround for the pad
    const launchpad = launch.launch_site.site_id;
    const quickestPadTurnaround = quickestTurnarounds[launchpad];
    const padTurnaround = launchDate - quickestPadTurnaround.previousMission;

    // This is the first mission accounted for this pad
    if (quickestPadTurnaround.previousMission === null) {
      quickestTurnarounds[launchpad].previousMission = launchDate;
      quickestTurnarounds[launchpad].mission1 = launch.payloads[0].payload_id;
    } else {
      // Do we need to update the quickest pad turnaround?
      // First time we get a turnaround (2nd mission from this pad)
      if (quickestPadTurnaround.turnaround === null) {
        quickestTurnarounds[launchpad] = {
          turnaround: padTurnaround,
          mission1: quickestTurnarounds[launchpad].mission1,
          mission2: launch.payloads[0].payload_id,
          previousMission: launchDate,
        };
      } else {
        if (padTurnaround < quickestPadTurnaround.turnaround) {
          quickestTurnarounds[launchpad] = {
            turnaround: padTurnaround,
            mission1: quickestTurnarounds[launchpad].mission2,
            mission2: launch.payloads[0].payload_id,
            previousMission: launchDate,
          };
        }
      }
    }

    // Check if quickest turnaround ever
    if (quickestTurnaroundPad === null || padTurnaround < quickestTurnarounds[quickestTurnaroundPad].turnaround) {
      quickestTurnaroundPad = launchpad;
      quickestTurnaroundPadName = launch.launch_site.site_name;
    }
  }

  let options = JSON.parse(JSON.stringify(constants.DEFAULTCHARTOPTIONS)); // Clone object
  options = Object.assign(options, {
    scales: {
      xAxes: [{
        gridLines: {
          display: false,
          color: constants.COLORS.white,
        },
        ticks: {
          display: false,
        },
      }],
      yAxes: [{
        gridLines: {
          display: false,
          color: constants.COLORS.white,
        },
        ticks: {
          fontFamily: 'Brandon',
          fontColor: constants.COLORS.white,
        },
      }]
    }
  });

  const daysBetweenLaunches = {
    data: {
      labels: labels,
      datasets: [{
        label: 'Running average (10 flights)',
        type: 'line',
        data: runningAverage10FlightsData,
        fill: false,
        borderColor: constants.COLORS.yellow,
        backgroundColor: constants.COLORS.yellow,
        pointBorderColor: constants.COLORS.yellow,
        pointBackgroundColor: constants.COLORS.yellow,
        pointHoverBackgroundColor: constants.COLORS.yellow,
        pointHoverBorderColor: constants.COLORS.yellow,
      }, {
        label: 'Running average',
        type: 'line',
        data: runningAverageData,
        fill: false,
        borderColor: constants.COLORS.white,
        backgroundColor: constants.COLORS.white,
        pointBorderColor: constants.COLORS.white,
        pointBackgroundColor: constants.COLORS.white,
        pointHoverBackgroundColor: constants.COLORS.white,
        pointHoverBorderColor: constants.COLORS.white,
      }, {
        label: 'Days between launches',
        backgroundColor: constants.COLORS.blue,
        data: daysIntervals,
      }]
    },
    options: options,
  };

  return {
    quickestTurnaround: quickestTurnarounds[quickestTurnaroundPad],
    quickestTurnaroundPadName: quickestTurnaroundPadName,
    quickestTurnaroundSLC40: quickestTurnarounds.ccafs_slc_40,
    quickestTurnaroundHLC39A: quickestTurnarounds.ksc_lc_39a,
    quickestTurnaroundSLC4E: quickestTurnarounds.vafb_slc_4e,
    lastLaunchDate: moment(pastLaunches[pastLaunches.length - 1].launch_date_utc).unix(),
    daysBetweenLaunches,
  };
};

export default timelines;
