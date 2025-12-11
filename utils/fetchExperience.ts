// DEPRECATED: Data is now static in pages/index.tsx
import { Experience } from "../typings";

/**
 * @deprecated This function is no longer used. Data is static.
 */
export const fetchExperiences = async(): Promise<Experience[]> => {
    throw new Error('fetchExperiences is deprecated - data is now static');
}