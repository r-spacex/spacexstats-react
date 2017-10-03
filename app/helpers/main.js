import nextLaunches from 'helpers/nextLaunches';
import launchCount from 'helpers/launchCount';
import launchHistory from 'helpers/launchHistory';
import moment from 'moment';

const computeStats = (pastLaunches, upcomingLaunches) => {
  const nextLaunchesData = nextLaunches(upcomingLaunches);
  const launchCountData = launchCount(pastLaunches);
  const launchHistoryData = launchHistory(pastLaunches);

  return {
    nextLaunch: [{
      title: nextLaunchesData.nextLaunch.payloadName,
      tabTitle: 'Next Launch',
      type: 'countdown',
      data: moment(nextLaunchesData.nextLaunch.date),
      text: nextLaunchesData.nextLaunch.payloadDesc,
    }],
    launchCount: [{
      title: 'Total',
      tabTitle: 'Total',
      type: 'integer',
      data: {'value': launchCountData.totalLaunches, 'subtitle': 'Flights'},
      text: 'As of October 2017, SpaceX has launched ' + launchCountData.totalLaunches + ' rockets, carrying a variety of payloads to multiple destinations; including LEO, GTO, L1, and the ISS. SpaceX currently has a manifest of over 70 flights that will fly over the coming years.',
    }, {
      title: 'Falcon 9',
      tabTitle: 'Falcon 9',
      type: 'integer',
      data: {'value': launchCountData.totalFalcon9, 'subtitle': 'Flights'},
      text: 'Nearly 3/4\'s the height of the Saturn V, yet thinner than a Space Shuttle SRB, Falcon 9 is the workhorse of SpaceX\'s rocket fleet. Able to carry 13,150kg to LEO and 5,300kg to GTO with first stage reusability. It has launched ' + launchCountData.totalFalcon9 + ' times and is not far from its last iteration (Falcon 9 v1.2) enabling rapid reusability.',
    }, {
      title: 'Falcon Heavy',
      tabTitle: 'Falcon Heavy',
      type: 'integer',
      data: {'value': launchCountData.totalBFR, 'subtitle': 'Flights'},
      text: 'When Falcon Heavy launches at the end of 2017, it will become the world\'s most powerful rocket, able to carry up to 64 metric tonnes to Low Earth Orbit in full expendable mode, rising on its 27 first stage Merlin 1D engines. Only the mighty Saturn V has delivered more payload to orbit.',
    }, {
      title: 'Falcon 1',
      tabTitle: 'Falcon 1',
      type: 'integer',
      data: {'value': launchCountData.totalFalcon1, 'subtitle': 'Flights'},
      text: 'Falcon 1 was SpaceX\'s original two stage rocket - the first stage equipped with a single Merlin 1A engine, and later, the venerable Merlin 1C. Launched exclusively from Kwajalein, it was able to lift 670kg to LEO and became the first privately-developed rocket to reach Earth orbit. It launched ' + launchCountData.totalFalcon1 + ' times over approximately 2 years.',
    }, {
      title: 'BFR',
      tabTitle: 'BFR',
      type: 'integer',
      data: {'value': launchCountData.totalBFR, 'subtitle': 'Flights'},
      text: 'BFR will stand 106 meters tall, 9 meters wide, and will be able to carry up to 150 tonnes (reusable) to Low Earth Orbit. This will be the single largest rocket ever designed, developed and then built.',
    }],
    launchHistory: [{
      title: 'Launches Per Year',
      tabTitle: 'Launches Per Year',
      type: 'barchart',
      data: launchHistoryData.flightsPerYear.data,
      options: launchHistoryData.flightsPerYear.options,
      text: 'With an ever-increasing launch cadence, SpaceX is on track to equal or surpass other launch providers by annual vehicles launched and continues, nearly year-on-year, to set vehicle flight records.',
    }],
  };
};

export default computeStats;
