export interface Project {
    id: string;
    projectName: string;
    createdOn: string; // ISO date string
    updatedOn: string; // ISO date string
    description: string;
}

export interface NewProject {
    projectName: string;
    width: number;
    height: number;
    unit: string;
    description: string;
}