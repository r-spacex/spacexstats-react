const nextLaunches = (upcomingLaunches) => {
  // Find first launch with non-null launch date
  let i = 0;
  let launch = upcomingLaunches[i];
  while (launch.launch_date_unix === null && i < upcomingLaunches.length - 1) {
    launch = upcomingLaunches[i];
    i += 1;
  }

  const payloadNames = [];
  let payloadMass = 0;

  launch.rocket.second_stage.payloads.forEach((payload) => {
    payloadNames.push(payload.payload_id);
    payloadMass += payload.payload_mass_kg;
  });
  const payloadName = payloadNames.join('/');

  let payloadDesc = '';
  if (launch.rocket.second_stage.payloads[0].payload_type.indexOf('Dragon') !== -1) {
    payloadDesc = `SpaceX will launch a Dragon capsule to LEO, bringing
                  ${payloadMass}kg of supplies and scientific cargo to the ISS.`;
  } else {
    payloadDesc = `SpaceX will launch
                  the${payloadMass > 0 ? `${payloadMass}kg` : ''} communication
                  satellite${launch.rocket.second_stage.payloads.length > 1 ? 's ' : ' '}
                  ${payloadName} into a ${launch.rocket.second_stage.payloads[0].orbit} trajectory.`;
  }

  payloadDesc += ' ';
  const launchDate = launch.launch_date_unix !== 'TBD' ? launch.launch_date_unix : null;

  const nextLaunch = {
    date: launchDate,
    payloadName,
    payloadDesc,
  };

  return {
    nextLaunch,
  };
};

export default nextLaunches;
