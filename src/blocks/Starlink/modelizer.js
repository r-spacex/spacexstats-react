const modelizer = ({ pastLaunches }) => {
  const starlinkLaunches = pastLaunches.filter(launch =>
    launch.rocket.second_stage.payloads.some(payload => payload.payload_id.includes('Starlink'))
  );

  return {
    // Assumption that will work for now: 60 satellites per launch
    inSpace: starlinkLaunches.length * 60
  };
};

export default modelizer;
