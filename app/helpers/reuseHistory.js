const reuseHistory = (pastLaunches) => {
  let totalLanded = 0;
  let totalReflown = 0;

  for (let i = 0; i < pastLaunches.length; i++) {
    if (pastLaunches[i].land_success && pastLaunches[i].landing_type !== 'Ocean') {
      totalLanded++;
    }

    if (pastLaunches[i].reused) {
      totalReflown++;
    }
  }

  return {
    totalLanded,
    totalReflown,
  };
};

export default reuseHistory;
