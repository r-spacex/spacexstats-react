const reuseHistory = (pastLaunches) => {
  let totalReflown = 0;
  const totalFairingsReflown = 0;
  const cores = {};
  let quickestTurnaround = null;
  let quickestTurnaroundCore = null;
  let mostReflownCore = null;
  let quickestTurnaroundMission1 = null;
  let quickestTurnaroundMission2 = null;

  const notFalcon1Launches = pastLaunches.filter(launch => launch.rocket.rocket_id !== 'falcon1');

  // List cores
  notFalcon1Launches.forEach((launch) => {
    const launchDate = new Date(launch.launch_date_utc).getTime() / 1000;
    let turnaround = null;

    launch.rocket.first_stage.cores.forEach((core) => {
      const coreSerial = core.core_serial;

      if (!(coreSerial in cores)) {
        cores[coreSerial] = {
          reflown: false,
          launches: [],
        };
      } else {
        totalReflown += 1;
        cores[coreSerial].reflown = true;
        const previousLaunches = cores[coreSerial].launches;
        const previousLaunch = previousLaunches[previousLaunches.length - 1];
        turnaround = launchDate - previousLaunch.date;

        // Check for most reflown core
        if (mostReflownCore === null
          || previousLaunches.length + 1 > cores[mostReflownCore].launches.length) {
          mostReflownCore = coreSerial;
        }

        // Check for quickest turnaround
        if (quickestTurnaround === null
          || turnaround < quickestTurnaround) {
          quickestTurnaround = turnaround;
          quickestTurnaroundCore = coreSerial;
          quickestTurnaroundMission1 = previousLaunch.name;
          quickestTurnaroundMission2 = launch.rocket.second_stage.payloads[0].payload_id;
        }
      }

      cores[coreSerial].launches.push({
        name: launch.rocket.second_stage.payloads[0].payload_id,
        date: launchDate,
        turnaround,
      });
    });
  });

  // Get mission names of most reflown core
  const mostReflownCoreMissions = [];
  cores[mostReflownCore].launches.forEach((launch) => {
    mostReflownCoreMissions.push(launch.name);
  });

  return {
    totalReflown,
    totalFairingsReflown,
    quickestReuseTurnaround: {
      core: quickestTurnaroundCore,
      mission1: quickestTurnaroundMission1,
      mission2: quickestTurnaroundMission2,
      turnaround: quickestTurnaround,
    },
    mostReflownCore: {
      launches: cores[mostReflownCore].launches.length,
      missions: mostReflownCoreMissions.join(', '),
      core: mostReflownCore,
    },
  };
};

export default reuseHistory;
