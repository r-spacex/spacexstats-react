const nextLaunches = (upcomingLaunches) => {
  const launch = upcomingLaunches[0];

  const payloadNames = [];
  let payloadMass = 0;
  for (let i = 0; i < launch.payloads.length; i++) {
    payloadNames.push(launch.payloads[i].payload_id);
    payloadMass += launch.payloads[i].payload_mass_kg;
  }
  const payloadName = payloadNames.join('/');

  let payloadDesc = '';
  if (launch.payloads[0].payload_type.indexOf('Dragon') !== -1) {
    payloadDesc = `SpaceX will launch a Dragon capsule to LEO, bringing
                  ${payloadMass}kg of supplies and scientific cargo to the ISS.`;
  } else {
    payloadDesc = `SpaceX will launch the${payloadMass > 0 ? payloadMass + 'kg' : ''} communication
                  satellite${launch.payloads.length > 1 ? 's ' : ' '}
                  ${payloadName} into a ${launch.payloads[0].orbit} trajectory.`;
  }

  payloadDesc += ' ';

  const nextLaunch = {
    date: (new Date(launch.launch_date_utc).getTime() / 1000),
    payloadName,
    payloadDesc
  };

  return {
    nextLaunch,
  };
};

export default nextLaunches;
