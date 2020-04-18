const modelizer = ({ pastLaunches }) => {
  let totalSLC40 = 0;
  let totalHLC39A = 0;
  let totalVAFB = 0;
  const totalBocaChica = 0;
  let totalKwajalein = 0;

  pastLaunches.forEach((launch) => {
    switch (launch.launch_site.site_id) {
      case 'ccafs_slc_40':
        totalSLC40 += 1;
        break;
      case 'ksc_lc_39a':
        totalHLC39A += 1;
        break;
      case 'vafb_slc_4e':
        totalVAFB += 1;
        break;
      case 'kwajalein_atoll':
        totalKwajalein += 1;
        break;

      default:
    }
  });

  // Subtract 1 for Amos-6
  totalSLC40 -= 1;

  return {
    totalSLC40,
    totalHLC39A,
    totalVAFB,
    totalBocaChica,
    totalKwajalein,
  };
};

export default modelizer;
