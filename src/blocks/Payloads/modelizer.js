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
    NRO: 0,
  };

  // Custom years for upmass
  const yearsUpmassStart = 2012; // Going beyond suborbital a decade before BO
  const yearsUpmassEnd = new Date().getFullYear();
  const yearsUpmass = [];
  for (let i = yearsUpmassStart; i <= yearsUpmassEnd; i++) {
    yearsUpmass.push(i);
  }
  const upmassPerOrbit = {
    LEO: new Array(yearsUpmass.length).fill(0),
    ISS: new Array(yearsUpmass.length).fill(0),
    Polar: new Array(yearsUpmass.length).fill(0),
    GTO: new Array(yearsUpmass.length).fill(0),
    Interplanetary: new Array(yearsUpmass.length).fill(0),
    Other: new Array(yearsUpmass.length).fill(0),
  };

  const successfulLaunches = pastLaunches.filter(
    (launch) => launch.launch_success,
  );

  successfulLaunches.forEach((launch) => {
    launch.rocket.second_stage.payloads.forEach((payload) => {
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
            customers: payload.customers.join('/'),
          };
        }

        if (
          payload.orbit === 'GTO' &&
          payload.payload_mass_kg > heaviestPayloadGTO.mass
        ) {
          heaviestPayloadGTO = {
            mass: payload.payload_mass_kg,
            mission: payload.payload_id,
            customers: payload.customers.join('/'),
          };
        }
      }

      // Add upmass to orbit
      const upmass = payload.payload_mass_kg;
      const yearUpmassIndex = launch.launch_year - yearsUpmassStart;
      switch (payload.orbit) {
        case 'VLEO':
        case 'LEO':
        case 'MEO':
          upmassPerOrbit.LEO[yearUpmassIndex] += upmass;
          break;
        case 'ISS':
          upmassPerOrbit.ISS[yearUpmassIndex] += upmass;
          break;
        case 'PO':
          upmassPerOrbit.Polar[yearUpmassIndex] += upmass;
          break;
        case 'GTO':
        case 'HEO':
        case 'SSO':
          upmassPerOrbit.GTO[yearUpmassIndex] += upmass;
          break;
        case 'ES-L1':
        case 'HCO':
          upmassPerOrbit.Interplanetary[yearUpmassIndex] += upmass;
          break;

        default:
          upmassPerOrbit.Other[yearUpmassIndex] += upmass;
      }
    });
  });

  const totalLaunches = Object.values(customers).reduce(
    (total, currentValue) => total + currentValue,
    0,
  );
  const options = JSON.parse(JSON.stringify(settings.DEFAULTCHARTOPTIONS)); // Clone object
  options.tooltips = {
    mode: 'label',
    callbacks: {
      label: (tooltipItem, data) => {
        const { index } = tooltipItem;
        const customer = data.labels[index];
        const missions = customers[customer];

        return `${customer}: ${missions} (${parseInt(
          (100 * missions) / totalLaunches,
          10,
        )}%)`;
      },
    },
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
            chartColors.orange,
          ],
        },
      ],
    },
    options,
  };

  const barchartOptions = JSON.parse(
    JSON.stringify(settings.DEFAULTBARCHARTOPTIONS),
  ); // Clone object
  const optionsUpmassPerYear = JSON.parse(JSON.stringify(barchartOptions));
  optionsUpmassPerYear.tooltips = {
    mode: 'label',
    callbacks: {
      afterTitle: () => {
        window.launchTotal = 0;
      },
      label: (tooltipItem, data) => {
        const dataset = data.datasets[tooltipItem.datasetIndex];
        const count = parseFloat(dataset.data[tooltipItem.index]);
        window.launchTotal += count;

        if (count === 0) {
          return '';
        }
        return `${dataset.label}: ${count.toLocaleString()}kg`;
      },
      footer: () => `TOTAL: ${window.launchTotal.toLocaleString()}kg`,
    },
  };

  const upmassPerYear = {
    data: {
      labels: yearsUpmass,
      datasets: [
        {
          label: 'LEO',
          backgroundColor: chartColors.blue,
          data: upmassPerOrbit.LEO,
        },
        {
          label: 'ISS',
          backgroundColor: chartColors.lightblue,
          data: upmassPerOrbit.ISS,
        },
        {
          label: 'Polar',
          backgroundColor: chartColors.yellow,
          data: upmassPerOrbit.Polar,
        },
        {
          label: 'GTO',
          backgroundColor: chartColors.orange,
          data: upmassPerOrbit.GTO,
        },
        {
          label: 'Interplanetary',
          backgroundColor: chartColors.red,
          data: upmassPerOrbit.Interplanetary,
        },
        {
          label: 'Other',
          backgroundColor: chartColors.white,
          data: upmassPerOrbit.Other,
        },
      ],
    },
    options: optionsUpmassPerYear,
  };

  return {
    totalMass: parseInt(totalMass, 10).toLocaleString(),
    heaviestPayload,
    heaviestPayloadGTO,
    customersChart,
    upmassPerYear,
  };
};

export default modelizer;
