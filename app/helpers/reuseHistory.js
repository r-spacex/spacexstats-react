const reuseHistory = (pastLaunches) => {
  let totalReflown = 0;
  const totalFairingsReflown = 0;
  const cores = {};
  let quickestTurnaround = null;
  let quickestTurnaroundCore = null;
  let mostReflownCore = null;
  let quickestTurnaroundMission1 = null;
  let quickestTurnaroundMission2 = null;

  // List cores
  for (let i = 0; i < pastLaunches.length; i++) {
    const launch = pastLaunches[i];
    const launchDate = new Date(launch.launch_date_utc).getTime() / 1000;
    let turnaround = null;

    // Ignore Falcon 1
    if (launch.rocket.rocket_id === 'falcon1') {
      continue;
    }

    if (!(launch.core_serial in cores)) {
      cores[launch.core_serial] = {
        'reflown': false,
        'launches': new Array(),
      };
    } else {
      totalReflown++;
      cores[launch.core_serial].reflown = true;
      const previousLaunches = cores[launch.core_serial].launches;
      const previousLaunch = previousLaunches[previousLaunches.length - 1];
      turnaround = launchDate - previousLaunch.date;

      // Check for most reflown core
      if (mostReflownCore === null
        || previousLaunches.length + 1 > cores[mostReflownCore].launches.length) {
        mostReflownCore = launch.core_serial;
      }

      // Check for quickest turnaround
      if (quickestTurnaround === null
        || turnaround < quickestTurnaround) {
        quickestTurnaround = turnaround;
        quickestTurnaroundCore = launch.core_serial;
        quickestTurnaroundMission1 = previousLaunch.name;
        quickestTurnaroundMission2 = launch.payloads[0].payload_id;
      }
    }

    cores[launch.core_serial].launches.push({
      name: launch.payloads[0].payload_id,
      date: launchDate,
      turnaround,
    });
  }

  // Get mission names of most reflown core
  const mostReflownCoreMissions = [];
  for (let i = 0; i < cores[mostReflownCore].launches.length; i++) {
    mostReflownCoreMissions.push(cores[mostReflownCore].launches[i].name);
  }

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
