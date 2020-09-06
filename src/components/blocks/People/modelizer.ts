import { SpaceXData, CrewStatus, Roadster } from 'types';

export interface ModelizedSectionData {
  dragonriders: number;
  currentlyInSpace: string;
  moonPopulation: number;
  marsPopulation: number;
  employees: number;
  starman: Roadster;
}

export const modelizer = ({
  company,
  crew,
  roadster,
}: SpaceXData): ModelizedSectionData => {
  const currentlyInSpace = crew
    .filter((person) => person.status === CrewStatus.active)
    .map((person) => person.name);
  const currentlyInSpaceDetails =
    currentlyInSpace.length > 0
      ? `There are ${
          currentlyInSpace.length
        } people sent by SpaceX currently in space: ${currentlyInSpace.join(
          ', ',
        )}.`
      : '';

  return {
    dragonriders: crew.reduce(
      (sum, currentCrew) => sum + currentCrew.launches.length,
      0,
    ),
    currentlyInSpace: currentlyInSpaceDetails,
    moonPopulation: 0,
    marsPopulation: 0,
    employees: company.employees,
    starman: roadster,
  };
};
