import { PROJECTS } from "./data";
import { CONCEPT_PROJECTS } from "./concepts";

/** Keep the approved order: three real projects, then the ten design concepts. */
export const SHOWCASE_PROJECTS = [
  ...PROJECTS.map((project) => ({ ...project, kind: "live" as const })),
  ...CONCEPT_PROJECTS.map((project) => ({ ...project, kind: "concept" as const })),
];

export const HOME_PROJECTS = SHOWCASE_PROJECTS.slice(0, 5);
export const MORE_PROJECTS = SHOWCASE_PROJECTS.slice(5);
