// eslint-disable-next-line
const fetch = require('node-fetch');

const OLD_API_URL = 'https://api.spacexdata.com/v4';

const oldApiGet = async (endpoint) => {
  const response = await fetch(`${OLD_API_URL}${endpoint}`, {
    mode: 'cors',
  });
  const data = await response.json();
  return data;
};

const API_V2_DEV_URL = 'https://lldev.thespacedevs.com/2.2.0/';
const API_V2_PROD_URL = 'https://ll.thespacedevs.com/2.2.0/';
const SPACEX_AGENCY_ID = 121;
const url =
  process.env.NODE_ENV === 'production' ? API_V2_DEV_URL : API_V2_PROD_URL;
const apiGet = async (endpoint) => {
  const response = await fetch(`${endpoint}`, {
    mode: 'cors',
  });

  return response.json();
};

const apiGetAllPages = async (endpoint) => {
  let data = [];
  let response = null;

  while (response === null || response.next !== null) {
    response = await apiGet(response ? response.next : endpoint);
    data = data.concat(response.results);
  }

  return data.filter(
    (item) => item.launch_service_provider === SPACEX_AGENCY_ID,
  );
};

exports.sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest,
}) => {
  const [launches, cores, payloads, crew, starlink, company, roadster] =
    await Promise.all([
      // apiGetAllPages(`${url}launch/?format=json&search=SpaceX&limit=100`),
      oldApiGet('/launches'),
      oldApiGet('/cores'),
      oldApiGet('/payloads'),
      oldApiGet('/crew'),
      oldApiGet('/starlink'),
      oldApiGet('/company'),
      oldApiGet('/roadster'),
    ]);

  const data = {
    launches,
    cores,
    payloads,
    crew,
    starlink,
    company,
    roadster,
  };

  const { createNode } = actions;
  Object.keys(data).forEach((endpoint) => {
    const nodeData = { [endpoint]: data[endpoint] };
    const nodeContent = JSON.stringify(nodeData);

    const nodeMeta = {
      id: createNodeId(`spacex-data-${endpoint}`),
      parent: null,
      children: [],
      internal: {
        type: `spacexdata${endpoint}`,
        mediaType: `text/html`,
        content: nodeContent,
        contentDigest: createContentDigest(nodeData),
      },
    };

    const node = Object.assign({}, nodeData, nodeMeta);
    createNode(node);
  });

  return;
};
