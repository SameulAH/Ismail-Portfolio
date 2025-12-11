// DEPRECATED: Data is now static in pages/index.tsx
import { PageInfo } from "../typings";

/**
 * @deprecated This function is no longer used. Data is static.
 */
export const fetchPageInfo = async(): Promise<PageInfo> => {
    throw new Error('fetchPageInfo is deprecated - data is now static');
}