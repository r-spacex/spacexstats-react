import settings from '~/settings';

const payloads = (pastLaunches) => {
  let heaviestPayload = { mass: 0, mission: '', customers: '' };
  let heaviestPayloadGTO = { mass: 0, mission: '', customers: '' };
  let totalMass = 0;
  const internetConstellation = 2;
  const customers = {};
  const successfulLaunches = pastLaunches.filter(launch => launch.launch_success);

  successfulLaunches.forEach((launch) => {
    launch.rocket.second_stage.payloads.forEach((payload) => {
      // Only consider first customer
      const customer = payload.customers[0];
      if (!customers[customer]) {
        customers[customer] = [];
      }
      customers[customer].push(payload.payload_id);

      // Exclude Dragon flights for the following stats
      if (payload.payload_type.indexOf('Dragon') === -1) {
        totalMass += payload.payload_mass_kg;

        if (payload.payload_mass_kg > heaviestPayload.mass) {
          heaviestPayload = {
            mass: payload.payload_mass_kg,
            mission: payload.payload_id,
            customers: payload.customers.join('/'),
          };
        }

        if (payload.orbit === 'GTO' && payload.payload_mass_kg > heaviestPayloadGTO.mass) {
          heaviestPayloadGTO = {
            mass: payload.payload_mass_kg,
            mission: payload.payload_id,
            customers: payload.customers.join('/'),
          };
        }
      }
    });
  });

  // Clean customers list
  customers.Others = [];
  const customerKeys = Object.keys(customers);
  customerKeys.forEach((customer) => {
    if (customers[customer].length < 2) {
      customers.Others = customers.Others.concat(customers[customer]);
      delete customers[customer];
    }
    if (customer.indexOf('NASA') !== -1 && customer !== 'NASA') {
      customers.NASA = customers.NASA.concat(customers[customer]);
      delete customers[customer];
    }
  });

  const options = JSON.parse(JSON.stringify(settings.DEFAULTCHARTOPTIONS)); // Clone object
  options.tooltips = {
    mode: 'label',
    callbacks: {
      label: (tooltipItem, data) => {
        const { index } = tooltipItem;
        const customer = data.labels[index];
        const missions = customers[customer];

        if (missions.length > 3) {
          // Get last 3 missions
          const displayedMissions = missions.slice(missions.length - 3).reverse();
          return `${customer}: ${missions.length} (${displayedMissions.join(', ')} and ${missions.length - 3} more)`;
        }
        return `${customer}: ${missions.length} (${missions.join(', ')})`;
      },
    },
  };
  const customersChart = {
    data: {
      labels: Object.keys(customers),
      datasets: [{
        data: Object.values(customers).map(customersList => (customersList.length)),
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
    options,
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
