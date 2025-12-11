// Static types for portfolio data (no Sanity dependency)

export interface PageInfo {
    _id: string;
    name: string;
    role: string;
    backgroundInformation: string;
    email: string;
    phoneNumber?: string;
    address?: string;
    heroImage: string; // Direct URL path
    profilePic: string; // Direct URL path
}

export interface Technology {
    _id: string;
    title: string;
    image: string; // Direct URL path
    progress?: number;
}

export interface Skill {
    _id: string;
    title: string;
    image: string; // Direct URL path
    progress: number;
}

export interface Experience {
    _id: string;
    company: string;
    companyImage: string; // Direct URL path
    dateStarted: string;
    dateEnded?: string | null;
    isCurrentlyWorkingHere: boolean;
    jobTitle: string;
    points: string[];
    technologies: Technology[];
}

export interface Project {
    _id: string;
    title: string;
    linkToBuild?: string;
    image: string; // Direct URL path
    summary: string;
    technologies: Technology[];
}

export interface Social {
    _id: string;
    title: string;
    url: string;
}