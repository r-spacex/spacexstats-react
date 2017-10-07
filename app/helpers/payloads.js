import settings from 'settings';

const payloads = (pastLaunches) => {
  let heaviestPayload = {mass: null, mission: '', customers: ''};
  let heaviestPayloadGTO = {mass: null, mission: '', customers: ''};
  let totalMass = 0;
  const internetConstellation = 0;
  const customers = {};

  for (let i = 0; i < pastLaunches.length; i++) {
    const launch = pastLaunches[i];
    if (!launch.launch_success) {
      continue;
    }

    for (let j = 0; j < launch.payloads.length; j++) {
      const payload = launch.payloads[j];
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

      // Only consider first customer
      const customer = payload.customers[0];
      if (!customers[customer]) {
        customers[customer] = 0;
      }
      customers[customer]++;
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
        // Default colors from highcharts, chartjs doesn't have ones
        backgroundColor: [
          '#2f7ed8', '#0d233a', '#8bbc21', '#910000', '#1aadce',
          '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a',
          '#4572A7', '#AA4643', '#89A54E', '#80699B', '#3D96AE',
          '#DB843D', '#92A8CD', '#A47D7C', '#B5CA92',
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
