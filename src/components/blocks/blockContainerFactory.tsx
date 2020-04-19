import React from 'react';
import { SpaceXData } from 'types';

const blockContainerFactory = (
  Component: React.FC<SpaceXData>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modelizer: (data: SpaceXData) => any,
) => {
  const Container = (data: SpaceXData) => {
    const modelizedData = modelizer(data);

    return <Component {...modelizedData} />;
  };

  Container.displayName = `${Component.name}Container`;

  return Container;
};

export default blockContainerFactory;
