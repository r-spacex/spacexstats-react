import React from 'react';

const blockContainerFactory = (Component, modelizer) => {
  const Container = ({ pastLaunches, upcomingLaunches, ...rest }) => {
    let modelizedData = null;
    if (pastLaunches && upcomingLaunches) {
      modelizedData = modelizer({ pastLaunches, upcomingLaunches });
    }

    return <Component data={modelizedData} {...rest} />;
  };

  Container.displayName = `${Component.name}Container`;

  return Container;
};

export default blockContainerFactory;
