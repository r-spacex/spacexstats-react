// eslint-disable-next-line
const fetch = require('node-fetch');

const API_URL = 'https://api.spacexdata.com/v3';

const apiGet = async (endpoint) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    mode: 'cors',
  });
  const data = await response.json();
  return data;
};

exports.sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest,
}) => {
  const [launches, cores] = await Promise.all([
    apiGet('/launches'),
    apiGet('/cores'),
  ]);

  const data = { launches, cores };

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
