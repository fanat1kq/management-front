const getApiBaseUrl = () => {
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        return 'http://176.109.106.218:3002';
    }
    return 'http://localhost:3002';
};

const API_BASE_URL = getApiBaseUrl();
const AUTH_API_URL = `${API_BASE_URL}/api/auth`;
const TASKS_API_URL = `${API_BASE_URL}/api/tasks`;

// Функции для работы с аутентификацией
export const authAPI = {
    async login(credentials) {
        console.log('🔐 Sending login request...', credentials);

        const response = await fetch(`${AUTH_API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials)
        });

        console.log('📥 Response status:', response.status);

        const responseText = await response.text();
        console.log('📥 RAW response text:', responseText);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${responseText}`);
        }

        let authData;
        try {
            authData = JSON.parse(responseText);
            console.log('✅ Parsed JSON response:', authData);
        } catch (parseError) {
            console.error('❌ Not JSON. Raw response:', responseText);
            if (responseText.trim().length > 0) {
                console.log('📝 Response is plain text, might be token directly');
                authData = { accessToken: responseText.trim() };
            } else {
                throw new Error('Empty response from server');
            }
        }

        const token = authData.access_token || authData.accessToken || authData.token || authData.jwt;

        if (!token) {
            console.error('❌ No token found in response. Available fields:', Object.keys(authData));
            throw new Error('No JWT token received from server');
        }

        console.log('🎉 JWT Token received');
        return {
            token,
            user: {
                id: authData.userId || authData.id,
                username: authData.username || credentials.username,
                email: authData.email || `${credentials.username}@example.com`,
                name: authData.name || credentials.username,
                role: authData.role || 'Пользователь',
                department: authData.department || 'Отдел разработки'
            }
        };
    },

    async register(userData) {
        console.log('📝 Sending registration request...', userData);

        const response = await fetch(`${AUTH_API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: userData.username,
                email: userData.email,
                password: userData.password,
                name: userData.username
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка регистрации');
        }

        console.log('✅ Registration successful');
        return await response.json();
    },

    async validate(token) {
        console.log('🔍 Validating token...');

        const response = await fetch(`${AUTH_API_URL}/validate`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Token validation failed');
        }

        const userData = await response.json();
        console.log('✅ Token validated, user data:', userData);
        return userData;
    }
};

// Функции для работы с задачами
export const tasksAPI = {
    async getAllTasks(token) {
        console.log('📡 Loading all tasks from server');

        const response = await fetch(`${TASKS_API_URL}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('📥 Tasks response status:', response.status);

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('UNAUTHORIZED');
            }
            throw new Error(`Failed to load tasks: ${response.status}`);
        }

        const tasks = await response.json();
        console.log('✅ Tasks loaded:', tasks);
        return tasks;
    },

    async createTask(token, taskData) {
        console.log('📝 Creating task:', taskData);

        const response = await fetch(`${TASKS_API_URL}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('UNAUTHORIZED');
            }
            throw new Error(`Failed to create task: ${response.status}`);
        }

        const newTask = await response.json();
        console.log('✅ Task created:', newTask);
        return newTask;
    },

    async updateTask(token, taskId, updates) {
        console.log('🔄 Updating task:', taskId, updates);

        const response = await fetch(`${TASKS_API_URL}/${taskId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updates)
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('UNAUTHORIZED');
            }
            throw new Error(`Failed to update task: ${response.status}`);
        }

        console.log('✅ Task updated successfully');
        return await response.json();
    },

    async deleteTask(token, taskId) {
        console.log('🗑️ Deleting task:', taskId);

        const response = await fetch(`${TASKS_API_URL}/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('UNAUTHORIZED');
            }
            throw new Error(`Failed to delete task: ${response.status}`);
        }

        console.log('✅ Task deleted successfully');
        return true;
    }
};

// Вспомогательные функции
export const apiHelpers = {
    getToken() {
        return localStorage.getItem('jwt');
    },

    setToken(token) {
        localStorage.setItem('jwt', token);
    },

    removeToken() {
        localStorage.removeItem('jwt');
    },

    handleAuthError(error, logoutCallback) {
        if (error.message === 'UNAUTHORIZED') {
            console.error('❌ 401 Unauthorized - token is invalid or expired');
            this.removeToken();
            if (logoutCallback) {
                logoutCallback();
            }
            return true;
        }
        return false;
    }
};

export default {
    auth: authAPI,
    tasks: tasksAPI,
    helpers: apiHelpers
};