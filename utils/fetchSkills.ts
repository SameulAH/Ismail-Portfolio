// DEPRECATED: Data is now static in pages/index.tsx
import { Skill } from "../typings";

/**
 * @deprecated This function is no longer used. Data is static.
 */
export const fetchSkills = async(): Promise<Skill[]> => {
    throw new Error('fetchSkills is deprecated - data is now static');
}