// DEPRECATED: Data is now static in pages/index.tsx
import { Social } from "../typings";

/**
 * @deprecated This function is no longer used. Data is static.
 */
export const fetchSocials = async (): Promise<Social[]> => {
    throw new Error('fetchSocials is deprecated - data is now static');
};
