const nextLaunches = upcomingLaunches => {
  // Find first launch with non-null launch date
  let i = 0;
  let launch = upcomingLaunches[i];
  while (launch.launch_date_utc === null && i < upcomingLaunches.length - 1) {
    launch = upcomingLaunches[i];
    i += 1;
  }

  const payloadNames = [];
  let payloadMass = 0;

  launch.rocket.second_stage.payloads.forEach(payload => {
    payloadNames.push(payload.payload_id);
    payloadMass += payload.payload_mass_kg;
  });
  const payloadName = payloadNames.join('/');

  let payloadDesc = '';
  if (launch.rocket.second_stage.payloads[0].payload_type.indexOf('Dragon') !== -1) {
    payloadDesc = `A SpaceX Dragon capsule will launch into LEO atop a
                  ${launch.rocket.rocket_name} rocket from
                  ${launch.launch_site.site_name_long}, carrying
                  ${payloadMass} kg of supplies and scientific cargo to the
                  International Space Station.`;
  } else {
    payloadDesc = `A SpaceX ${launch.rocket.rocket_name} rocket will launch from
                  ${launch.launch_site.site_name_long},
                  lofting the ${payloadMass > 0 ? `${payloadMass} kg ` : ''}
                  satellite${launch.rocket.second_stage.payloads.length > 1 ? 's ' : ' '}
                  ${payloadName} to a ${launch.rocket.second_stage.payloads[0].orbit} trajectory.`;
  }

  payloadDesc += ' ';
  const launchDate = launch.launch_date_utc !== 'TBD' ? new Date(launch.launch_date_utc).getTime() / 1000 : null;

  const nextLaunch = {
    date: launchDate,
    payloadName,
    payloadDesc
  };

  return {
    nextLaunch
  };
};

export default nextLaunches;
