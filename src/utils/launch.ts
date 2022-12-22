import { Launch, Payload, Core } from 'types';

export const launchYear = (launch: Launch) => launch.date.getFullYear();

export const getPayload = (launch: Launch): Payload | null =>
  launch.payloads[0] ?? null;

export const getMissions = (core: Core, allLaunches: Launch[]) =>
  allLaunches.filter((launch) => core.launches.includes(launch.id));
