const launchpadCount = (pastLaunches) => {
  let totalSLC40 = 0;
  let totalHLC39A = 0;
  let totalVAFB = 0;
  const totalBocaChica = 0;
  let totalKwajalein = 0;

  for (let i = 0; i < pastLaunches.length; i++) {
    switch (pastLaunches[i].launch_site.site_id) {
      case 'ccafs_slc_40': totalSLC40++; break;
      case 'ksc_lc_39a': totalHLC39A++; break;
      case 'vafb_slc_4e': totalVAFB++; break;
      case 'kwajalein_atoll': totalKwajalein++; break;

      default:
    }
  }

  return {
    totalSLC40,
    totalHLC39A,
    totalVAFB,
    totalBocaChica,
    totalKwajalein,
  };
};

export default launchpadCount;
