// Sanity client removed - using static data instead
// This file is kept for reference but is no longer used

export const config = {
    dataset: 'production',
    projectId: 'unused',
    apiVersion: '2021-03-25',
    useCdn: false,
};

// These exports are kept to prevent import errors in any remaining code
// They should not be used - all data is now static
export const sanityClient = null;
export const urlFor = (source: unknown) => ({
    url: () => '/hero-avatar.svg', // Fallback image
});