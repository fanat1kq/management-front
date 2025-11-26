export const TASK_STATUSES = {
    NEW: 'NEW',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED'
};

export const TASK_PRIORITIES = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high'
};

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/register',
        VALIDATE: '/api/auth/validate'
    },
    TASKS: {
        BASE: '/api/tasks',
        BY_ID: (id) => `/api/tasks/${id}`
    }
};