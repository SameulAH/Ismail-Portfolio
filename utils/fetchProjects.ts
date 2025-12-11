// DEPRECATED: Data is now static in pages/index.tsx
import { Project } from "../typings";

/**
 * @deprecated This function is no longer used. Data is static.
 */
export const fetchProjects = async(): Promise<Project[]> => {
    throw new Error('fetchProjects is deprecated - data is now static');
}