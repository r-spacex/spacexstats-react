export const fromUnix = (unixDate) => new Date(unixDate * 1000);

export const formatDuration = (durationInSeconds) => {
  const SECONDS_PER_DAY = 24 * 3600;
  const days = Math.floor(durationInSeconds / SECONDS_PER_DAY);
  const hours = Math.floor((durationInSeconds - SECONDS_PER_DAY * days) / 3600);

  return `${days} days and ${hours} hours`;
};
