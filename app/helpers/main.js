import nextLaunches from 'helpers/nextLaunches';
import launchCount from 'helpers/launchCount';
import launchHistory from 'helpers/launchHistory';
import reuseHistory from 'helpers/reuseHistory';
import launchpadCount from 'helpers/launchpadCount';
import turnarounds from 'helpers/turnarounds';
import payloads from 'helpers/payloads';
import people from 'helpers/people';
import timelines from 'helpers/timelines';
import moment from 'moment';

const computeStats = (pastLaunches, upcomingLaunches) => {
  const nextLaunchesData = nextLaunches(upcomingLaunches);
  const launchCountData = launchCount(pastLaunches);
  const launchHistoryData = launchHistory(pastLaunches);
  const reuseHistoryData = reuseHistory(pastLaunches);
  const launchpadCountData = launchpadCount(pastLaunches);
  const turnaroundsData = turnarounds(pastLaunches);
  const payloadsData = payloads(pastLaunches);
  const peopleData = people();
  const timelinesData = timelines();

  return {
    nextLaunch: [{
      title: nextLaunchesData.nextLaunch.payloadName,
      tabTitle: 'Next Launch',
      type: 'countdown',
      data: moment(nextLaunchesData.nextLaunch.date).unix(),
      text: nextLaunchesData.nextLaunch.payloadDesc,
    }],


    launchCount: [{
      title: 'Total',
      tabTitle: 'Total',
      type: 'integer',
      data: {'value': launchCountData.totalLaunches, 'subtitle': 'Flights'},
      text: `As of October 2017, SpaceX has launched ${launchCountData.totalLaunches} rockets,
            carrying a variety of payloads to multiple destinations;including LEO, GTO, L1, and the ISS.
            SpaceX currently has a manifest of over 70 flights that will fly over the coming years.`,
    }, {
      title: 'Falcon 9',
      tabTitle: 'Falcon 9',
      type: 'integer',
      data: {'value': launchCountData.totalFalcon9, 'subtitle': 'Flights'},
      text: `Nearly 3/4's the height of the Saturn V, yet thinner than a Space Shuttle SRB,
            Falcon 9 is the workhorse of SpaceX's rocket fleet. Able to carry
            13,150kg to LEO and 5,300kg to GTO with first stage reusability.
            It has launched ${launchCountData.totalFalcon9} times and is not far
            from its last iteration (Falcon 9 v1.2) enabling rapid reusability.`,
    }, {
      title: 'Falcon Heavy',
      tabTitle: 'Falcon Heavy',
      type: 'integer',
      data: {'value': launchCountData.totalBFR, 'subtitle': 'Flights'},
      text: `When Falcon Heavy launches at the end of 2017, it will become the world's
            most powerful rocket, able to carry up to 64 metric tonnes to LEO
            in full expendable mode, rising on its 27 first stage Merlin 1D engines.
            Only the mighty Saturn V has delivered more payload to orbit.`,
    }, {
      title: 'Falcon 1',
      tabTitle: 'Falcon 1',
      type: 'integer',
      data: {'value': launchCountData.totalFalcon1, 'subtitle': 'Flights'},
      text: `Falcon 1 was SpaceX's original two stage rocket - the first stage
            equipped with a single Merlin 1A engine, and later, the venerable Merlin 1C.
            Launched exclusively from Kwajalein, it was able to lift 670kg to LEO
            and became the first privately-developed rocket to reach Earth orbit.
            It launched ${launchCountData.totalFalcon1} times over approximately 2 years.`,
    }, {
      title: 'BFR',
      tabTitle: 'BFR',
      type: 'integer',
      data: {'value': launchCountData.totalBFR, 'subtitle': 'Flights'},
      text: `BFR will stand 106 meters tall, 9 meters wide, and will be able
            to carry up to 150 tonnes (reusable) to Low Earth Orbit.
            This will be the single largest rocket ever designed, developed and then built.`,
    }],


    launchHistory: [{
      title: 'Launches Per Year',
      tabTitle: 'Launches Per Year',
      type: 'barchart',
      data: launchHistoryData.flightsPerYear.data,
      options: launchHistoryData.flightsPerYear.options,
      text: `With an ever-increasing launch cadence, SpaceX is on track to equal
            or surpass other launch providers by annual vehicles launched
            and continues, nearly year-on-year, to set vehicle flight records.`,
    }],


    reuseHistory: [{
      title: 'Landed',
      tabTitle: 'Landed',
      type: 'integer',
      data: {'value': reuseHistoryData.totalLanded, 'subtitle': 'Landed'},
      text: `For SpaceX to succeed at reducing the cost of getting payload to orbit,
            reusability of launch vehicles is imperative. The first phase of this
            involves returning the first stage of the rocket back safely to
            Earth intact - an incredibly difficult task involving a combination
            of three burns that must be executed perfectly.`,
    }, {
      title: 'Reflown',
      tabTitle: 'Reflown',
      type: 'integer',
      data: {'value': reuseHistoryData.totalReflown, 'subtitle': 'Reflown'},
      text: `Once on the ground, the booster must be able to be refurbished and
            reflown in minimal time and with minimal cost. Only then can they be
            reflown, reducing launch costs significantly.`,
    }],


    launchpadCount: [{
      title: 'Cape Canaveral',
      tabTitle: 'Cape Canaveral',
      type: 'integer',
      data: {'value': launchpadCountData.totalSLC40, 'subtitle': 'Launches'},
      text: `Cape Canaveral Air Force Station Space Launch Complex 40 (SLC-40),
            is the launch site of Falcon 9 carrying Dragon towards the
            International Space Station, and the starting point for many
            satellites heading into Geostationary Earth Orbit.`,
    }, {
      title: 'KSC',
      tabTitle: 'KSC',
      background: 'fh.jpg',
      type: 'integer',
      data: {'value': launchpadCountData.totalHLC39A, 'subtitle': 'Launches'},
      text: `In April 2014, SpaceX signed an agreement with NASA for a 20 year
            lease on the historic Pad 39A at Kennedy Space Center. Since then,
            SpaceX has constructed a horizontal integration hangar capable of
            holding up to 5 Falcon cores. The Amos-6 anomaly damaged SLC-40
            in September 2016 which in turn accelerated the preparation of LC-39A.
            CRS-10 was the first mission to launch from pad 39A on February 19th, 2017.`,
    }, {
      title: 'Vandenberg',
      tabTitle: 'Vandenberg',
      background: 'cassiopelaunch.jpg',
      type: 'integer',
      data: {'value': launchpadCountData.totalVAFB, 'subtitle': 'Launches'},
      text: `Vandenberg AFB Space Launch Complex 4E (SLC-4E) in California is
            SpaceX's departure point for satellites (mostly scientific and Earth
            observation) seeking a polar orbit around the Earth. SLC-4E was last
            used in 2005 for the final flight of the Titan IV rocket.`,
    }, {
      title: 'Boca Chica',
      tabTitle: 'Boca Chica',
      background: 'bocachica.jpg',
      type: 'integer',
      data: {'value': launchpadCountData.totalBocaChica, 'subtitle': 'Launches'},
      text: `Boca Chica Beach, Texas is the location of SpaceX's new commercial-only
            private launch site designed to handle LEO & GEO launches on a tight
            schedule, freeing up other launch sites for other uses. It is expected
            to become operational not earlier than 2018.`,
    }, {
      title: 'Kwajalein',
      tabTitle: 'Kwajalein',
      background: 'kwaj.jpg',
      type: 'integer',
      data: {'value': launchpadCountData.totalKwajalein, 'subtitle': 'Launches'},
      text: `Omelek Island in Kwajalein Atoll was SpaceX's first launch site,
            used exclusively to launch the Falcon 1. Surrounded by vast amounts
            of sea and open ocean, making it the perfect site to launch untested
            demonstration rockets. Ironically, this climate also led to the
            failure of the first Falcon 1 launch, during which the engine failed
            25 seconds into flight due to a corroded bolt.`,
    }],


    turnarounds: [{
      title: 'Quickest (same pad)',
      tabTitle: 'Quickest',
      type: 'duration',
      data: turnaroundsData.quickestTurnaround.turnaround,
      text: `The quickest turnaround ever on the same pad was between the
            ${turnaroundsData.quickestTurnaround.mission1} and
            ${turnaroundsData.quickestTurnaround.mission2} missions at
            ${turnaroundsData.quickestTurnaroundPadName}.`,
    }, {
      title: 'Since Last Launch',
      tabTitle: 'Since Last Launch',
      type: 'timer',
      data: turnaroundsData.lastLaunchDate,
      text: '',
    }, {
      title: 'LC-39A',
      tabTitle: 'LC-39A',
      type: 'duration',
      data: turnaroundsData.quickestTurnaroundHLC39A.turnaround,
      text: `The quickest turnaround for this pad was between the
            ${turnaroundsData.quickestTurnaroundHLC39A.mission1} and
            ${turnaroundsData.quickestTurnaroundHLC39A.mission2} missions.`,
    }, {
      title: 'SLC-40',
      tabTitle: 'SLC-40',
      type: 'duration',
      data: turnaroundsData.quickestTurnaroundSLC40.turnaround,
      text: `The quickest turnaround for this pad was between the
            ${turnaroundsData.quickestTurnaroundSLC40.mission1} and
            ${turnaroundsData.quickestTurnaroundSLC40.mission2} missions.`,
    }, {
      title: 'SLC-4E',
      tabTitle: 'SLC-4E',
      type: 'duration',
      data: turnaroundsData.quickestTurnaroundSLC4E.turnaround,
      text: `The quickest turnaround for this pad was between the
            ${turnaroundsData.quickestTurnaroundSLC4E.mission1} and
            ${turnaroundsData.quickestTurnaroundSLC4E.mission2} missions.`,
    }, {
      title: 'Day intervals',
      tabTitle: 'Day intervals',
      type: 'barchart',
      data: turnaroundsData.daysBetweenLaunches.data,
      options: turnaroundsData.daysBetweenLaunches.options,
      text: `With an ever-increasing launch cadence, SpaceX is on track to equal
            or surpass other launch providers by annual vehicles launched
            and continues, nearly year-on-year, to set vehicle flight records.`,
    }],


    payloads: [{
      title: 'Total',
      tabTitle: 'Total',
      type: 'integer',
      data: {'value': payloadsData.totalPayloads, 'subtitle': 'Payloads'},
      text: `SpaceX has launched ${payloadsData.totalPayloads} payloads in total
            for many different customers.`,
    }, {
      title: 'Total Mass',
      tabTitle: 'Total Mass',
      type: 'integer',
      data: {'value': payloadsData.totalMass, 'subtitle': 'Kilograms'},
      text: `These satellites can have a variety of masses, from the smallest
            cubesats which can weigh less than 1 kilogram, to huge comsats
            over 5 tonnes.`,
    }, {
      title: 'Heaviest',
      tabTitle: 'Heaviest',
      type: 'integer',
      data: {'value': payloadsData.heaviestPayload.mass, 'subtitle': 'Kilograms'},
      text: `${payloadsData.heaviestPayload.mission}, launched for
            ${payloadsData.heaviestPayload.customers} represents the heaviest
            payload SpaceX has lofted into orbit.`,
    }, {
      title: 'Heaviest to GTO',
      tabTitle: 'Heaviest to GTO',
      type: 'integer',
      data: {'value': payloadsData.heaviestPayloadGTO.mass, 'subtitle': 'Kilograms'},
      text: `Geostationary Orbit serves as the nest for heavy communications
            satellites, where they can orbit the Earth at the same speed as the
            Earth rotates.${payloadsData.heaviestPayloadGTO.mission}, launched for
            ${payloadsData.heaviestPayloadGTO.customers} represents the heaviest
            payload SpaceX has lofted into GTO.`,
    }, {
      title: 'Starlink',
      tabTitle: 'Starlink',
      type: 'integer',
      data: {'value': payloadsData.internetConstellation, 'subtitle': 'Satellites'},
      text: `SpaceX's constellation of satellites will provide high speed internet
            anywhere on the globe. Built in Seattle, they will be launched from
            a variety of locations, potentially allowing Falcon to become the
            most launched rocket in history.`,
    }, {
      title: 'Customers',
      tabTitle: 'Customers',
      type: 'piechart',
      data: payloadsData.customersChart.data,
      options: payloadsData.customersChart.options,
      text: `SpaceX has many commercial customers as well as public agencies
            such as NASA and USAF.`,
    }],


    people: [{
      title: 'DragonRiders In Space',
      tabTitle: 'In space',
      type: 'integer',
      data: {'value': peopleData.dragonridersInSpace, 'subtitle': 'DragonRiders'},
      text: `No SpaceX astronauts have flown yet. Dragon 2, being developed as
            part of NASA's Commercial Crew Transportation Capability (CCtCap)
            program, performed a pad abort test in May 2015. The first orbital
            test is still TBD.`,
    }, {
      title: 'DragonRiders Cumulative',
      tabTitle: 'Cumulative',
      type: 'integer',
      data: {'value': peopleData.dragonridersCumulative, 'subtitle': 'DragonRiders'},
      text: `No SpaceX astronauts have flown yet. Dragon 2, being developed as
            part of NASA's Commercial Crew Transportation Capability (CCtCap)
            program, performed a pad abort test in May 2015. The first orbital
            test is still TBD.`,
    }, {
      title: 'Mars Population Count',
      tabTitle: 'Mars Population',
      background: 'mars.jpg',
      type: 'integer',
      data: {'value': peopleData.marsPopulation, 'subtitle': 'People'},
      text: 'No one\'s there yet ;-)',
    }, {
      title: 'Employees Count',
      tabTitle: 'Employees',
      background: 'tankland.jpg',
      type: 'integer',
      data: {'value': peopleData.employees, 'subtitle': 'People'},
      text: '',
    }],


    timelines: [{
      title: 'Elon Musk\'s Bet',
      tabTitle: 'Elon Musk\'s Bet',
      type: 'countdown',
      data: timelinesData.elonMuskBet,
      text: `In April 2009, Michael S. Malone revealed, while interviewing Elon
            Musk, that the two had a bet that SpaceX would put a man on Mars by
            "2020 or 2025". Musk has continued to reiterate this rough timeframe
            since. This countdown clock expires on 1 January 2026, at 00:00 UTC.
            No pressure, Elon.`,
    }, {
      title: 'Time Since Founding',
      tabTitle: 'Time Since Founding',
      background: 'spacexhq.jpg',
      type: 'timer',
      data: timelinesData.foundingDate,
      text: `SpaceX was incorporated on March 14, 2002, with their headquarters
            at a hotel, in downtown Los Angeles. By the end of the year, they
            were 14 employees strong. Their second facility was an enormous
            warehouse in El Segundo, where they built the Falcon 1. When they
            outgrew that, they moved to their current facility in Hawthorne.`,
    }, {
      title: 'Falcon Heavy',
      tabTitle: 'Falcon Heavy',
      background: 'fh-launch.jpg',
      type: 'countdown',
      data: timelinesData.falconHeavyLaunchDate,
      text: 'When will Falcon Heavy launch?',
    }, {
      title: 'Hours Worked',
      tabTitle: 'Hours Worked',
      background: 'rollout.jpg',
      type: 'text',
      data: 'Countless',
      text: `Since 14 March 2002, thousands of SpaceX employees and Elon Musk
            have worked tirelessly to push the boundaries of engineering and
            technology, ultimately providing humanity with cheaper, faster,
            more reliable access to space. Thank you.`,
    }],
  };
};

export default computeStats;
