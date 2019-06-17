import timelines from 'helpers/timelines';

const computeStats = () => {
  const timelinesData = timelines();

  return {
    timelines: [
      {
        title: "Elon Musk's Bet",
        tabTitle: "Elon Musk's Bet",
        type: 'countdown',
        data: timelinesData.elonMuskBet,
        text: `In April 2009, Michael S. Malone revealed, while interviewing Elon
            Musk, that the two had a bet that SpaceX would put a man on Mars by
            "2020 or 2025". Musk has continued to reiterate this rough timeframe
            since. This countdown clock expires on 1 January 2026, at 00:00 UTC.
            No pressure, Elon.`
      },
      {
        title: "Gwynne Shotwell's Bet",
        tabTitle: "Gwynne Shotwell's Bet",
        background: 'gwynneshotwell.jpg',
        type: 'countdown',
        data: timelinesData.gwynneShotwellBet,
        text: `In April 2018, SpaceX's COO Gwynne Shotwell declared during a TED
            interview that SpaceX would provide an Earth-to-Earth transportation
            system within ten years. The price would be a couple thousand dollars
            per person to fly New York to Shanghai. This countdown clock expires
            on 1 January 2029, at 00:00 UTC. No pressure, Gwynne.`
      },
      {
        title: 'Time Since Founding',
        tabTitle: 'Time Since Founding',
        background: 'spacexhq.jpg',
        type: 'timer',
        data: timelinesData.foundingDate,
        text: `SpaceX was incorporated on March 14, 2002, with their headquarters
            at a hotel, in downtown Los Angeles. By the end of the year, they
            were 14 employees strong. Their second facility was an enormous
            warehouse in El Segundo, where they built the Falcon 1. When they
            outgrew that, they moved to their current facility in Hawthorne.`
      },
      {
        title: 'Hours Worked',
        tabTitle: 'Hours Worked',
        background: 'rollout.jpg',
        type: 'text',
        data: 'Countless',
        text: `Since 14 March 2002, thousands of SpaceX employees and Elon Musk
            have worked tirelessly to push the boundaries of engineering and
            technology, ultimately providing humanity with cheaper, faster,
            more reliable access to space. Thank you.`
      }
    ]
  };
};

export default computeStats;
