import settings from 'settings';

const payloads = (pastLaunches) => {
  let heaviestPayload = {mass: null, mission: '', customers: ''};
  let heaviestPayloadGTO = {mass: null, mission: '', customers: ''};
  let totalMass = 0;
  const internetConstellation = 0;
  const customers = {};

  for (let i = 0; i < pastLaunches.length; i++) {
    const launch = pastLaunches[i];

    // Exclude Dragon flights for the following stats
    if (!launch.launch_success) {
      continue;
    }

    for (let j = 0; j < launch.payloads.length; j++) {
      // Only consider first customer
      const payload = launch.payloads[j];
      const customer = payload.customers[0];
      if (!customers[customer]) {
        customers[customer] = 0;
      }
      customers[customer]++;

      // Exclude Dragon flights for the following stats
      if (launch.payloads[0].payload_type.indexOf('Dragon') !== -1) {
        continue;
      }

      totalMass += payload.payload_mass_kg;

      if (heaviestPayload.mass === null || payload.payload_mass_kg > heaviestPayload.mass) {
        heaviestPayload = {
          mass: payload.payload_mass_kg,
          mission: payload.payload_id,
          customers: payload.customers.join('/'),
        };
      }

      if (payload.orbit === 'GTO' && (heaviestPayloadGTO.mass === null || payload.payload_mass_kg > heaviestPayloadGTO.mass)) {
        heaviestPayloadGTO = {
          mass: payload.payload_mass_kg,
          mission: payload.payload_id,
          customers: payload.customers.join('/'),
        };
      }
    }
  }

  // Clean customers list
  customers.Others = 0;
  for (const customer in customers) {
    if (customers[customer] < 2) {
      customers.Others += customers[customer];
      customers[customer] = customers[customer] - 1;
      delete customers[customer];
    }
    if (customer.indexOf('NASA') !== -1 && customer !== 'NASA') {
      customers.NASA += customers[customer];
      delete customers[customer];
    }
  }

  const options = JSON.parse(JSON.stringify(settings.DEFAULTCHARTOPTIONS)); // Clone object
  const customersChart = {
    data: {
      labels: Object.keys(customers),
      datasets: [{
        data: Object.values(customers),
        backgroundColor: [
          settings.COLORS.white, settings.COLORS.yellow, settings.COLORS.green,
          settings.COLORS.blue, settings.COLORS.orange, settings.COLORS.red,
          settings.COLORS.lightblue, settings.COLORS.brown, settings.COLORS.black,
          // Default colors from highcharts, less colourblind-friendly but we need lots of colors
          '#2f7ed8', '#0d233a', '#8bbc21', '#910000', '#1aadce',
          '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a',
        ],
      }],
    },
    options: options,
  };

  return {
    totalMass,
    heaviestPayload,
    heaviestPayloadGTO,
    internetConstellation,
    customersChart,
  };
};

export default payloads;
