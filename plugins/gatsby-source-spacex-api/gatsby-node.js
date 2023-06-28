// eslint-disable-next-line
const fetch = require('node-fetch');
// eslint-disable-next-line
const launches = require('./launches.json');

// The LL API can be quite slow to answer
// so we use local JSON files as a fallback to speed up development
// Change this to false if you want to use the LL dev API in your
// local dev environment
const USE_JSON_FALLBACK = true;

// The prod API is rate limited to 15 calls/hour so be careful with it
const USE_PROD_API = true;

const API_V2_DEV_URL = 'https://lldev.thespacedevs.com/2.2.0';
const API_V2_PROD_URL = 'https://ll.thespacedevs.com/2.2.0';
const SPACEX_AGENCY_ID = 121;

const apiGet = async (url) => {
  const response = await fetch(url, { mode: 'cors' });

  return response.json();
};

const apiGetAllPages = async (endpoint) => {
  let data = [];
  let response = null;
  let page = 1;

  while (response === null || response.next !== null) {
    console.log(`[DEBUG] Fetching page ${page}`);
    response = await apiGet(response ? response.next : endpoint);
    data = data.concat(response.results);
    page++;
  }

  const filteredResults = data.filter(
    (item) => item.launch_service_provider.id === SPACEX_AGENCY_ID,
  );

  console.log(`[DEBUG] Fetched ${filteredResults.length} results`);
  return filteredResults;
};

const endpoints = {
  launches: {
    url: '/launch/?format=json&limit=100&search=SpaceX',
    json: launches,
  },
};

const fetchEndpointData = async (endpoint) => {
  if (process.env.NODE_ENV === 'development' && USE_JSON_FALLBACK) {
    console.log('[DEBUG] Using local JSON fallback for fetching data');
    return endpoints[endpoint].json.results;
  }

  const fullUrl =
    (USE_PROD_API ? API_V2_PROD_URL : API_V2_DEV_URL) + endpoints[endpoint].url;
  console.log(`[DEBUG] Using remote API for fetching data (url: ${fullUrl})`);
  return apiGetAllPages(fullUrl);
};

exports.sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest,
}) => {
  const [launches] = await Promise.all([fetchEndpointData('launches')]);

  const data = {
    launches,
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
