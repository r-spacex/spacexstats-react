import settings from 'settings';
import { chartColors } from 'stylesheet';

const modelizer = ({ pastLaunches }) => {
  let heaviestPayload = { mass: 0, mission: '', customers: '' };
  let heaviestPayloadGTO = { mass: 0, mission: '', customers: '' };
  let totalMass = 0;
  const customers = {
    NASA: 0,
    Commercial: 0,
    SpaceX: 0,
    USAF: 0,
    NRO: 0
  };
  const successfulLaunches = pastLaunches.filter(launch => launch.launch_success);

  successfulLaunches.forEach(launch => {
    launch.rocket.second_stage.payloads.forEach(payload => {
      // Only consider first customer
      const customer = payload.customers[0];
      if (customer.includes('NASA')) {
        customers.NASA += 1;
      } else if (customer in customers) {
        customers[customer] += 1;
      } else {
        customers.Commercial += 1;
      }

      // Exclude Dragon flights for the following stats
      if (payload.payload_type.indexOf('Dragon') === -1) {
        totalMass += payload.payload_mass_kg;

        if (payload.payload_mass_kg > heaviestPayload.mass) {
          heaviestPayload = {
            mass: payload.payload_mass_kg,
            mission: payload.payload_id,
            customers: payload.customers.join('/')
          };
        }

        if (payload.orbit === 'GTO' && payload.payload_mass_kg > heaviestPayloadGTO.mass) {
          heaviestPayloadGTO = {
            mass: payload.payload_mass_kg,
            mission: payload.payload_id,
            customers: payload.customers.join('/')
          };
        }
      }
    });
  });

  const totalLaunches = Object.values(customers).reduce((total, currentValue) => total + currentValue, 0);
  const options = JSON.parse(JSON.stringify(settings.DEFAULTCHARTOPTIONS)); // Clone object
  options.tooltips = {
    mode: 'label',
    callbacks: {
      label: (tooltipItem, data) => {
        const { index } = tooltipItem;
        const customer = data.labels[index];
        const missions = customers[customer];

        return `${customer}: ${missions} (${parseInt((100 * missions) / totalLaunches, 10)}%)`;
      }
    }
  };
  const customersChart = {
    data: {
      labels: Object.keys(customers),
      datasets: [
        {
          data: Object.values(customers),
          backgroundColor: [
            chartColors.blue,
            chartColors.lightblue,
            chartColors.white,
            chartColors.yellow,
            chartColors.orange
          ]
        }
      ]
    },
    options
  };

  return {
    totalMass,
    heaviestPayload,
    heaviestPayloadGTO,
    customersChart
  };
};

export default modelizer;
