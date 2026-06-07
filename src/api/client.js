// Central API client for NeuroSync.
//
// Base URL can be overridden with a VITE_API_BASE env var (see .env.example) —
// e.g. point it at your local backend during development. Defaults to the
// deployed Azure API.
const API_BASE = (import.meta.env.VITE_API_BASE || 'https://neurosync.azurewebsites.net/api').replace(/\/+$/, '');

const TOKEN_KEY = 'neurosync_jwt';
const USER_KEY = 'neurosync_user';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => { if (token) localStorage.setItem(TOKEN_KEY, token); };

// The signed-in user's display name + email, shown in the header.
export const setUser = (user) => { if (user) localStorage.setItem(USER_KEY, JSON.stringify(user)); };
export const getUser = () => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)) || null; } catch { return null; }
};

export const clearAuth = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem(USER_KEY);
};

export class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
    const headers = { 'Content-Type': 'application/json' };
    if (auth) {
        const token = getToken();
        if (token) headers.Authorization = `Bearer ${token}`;
    }

    let response;
    try {
        response = await fetch(`${API_BASE}${path}`, {
            method,
            headers,
            credentials: 'include',
            body: body !== undefined ? JSON.stringify(body) : undefined,
        });
    } catch {
        throw new ApiError('Network error — could not reach NeuroSync. Check your connection and try again.', 0);
    }

    if (response.status === 401) {
        clearAuth();
        throw new ApiError('Your session has expired. Please log in again.', 401);
    }

    // Some endpoints return JSON, some return plain text — handle both safely.
    const text = await response.text();
    let data = null;
    if (text) {
        try { data = JSON.parse(text); } catch { data = text; }
    }

    if (!response.ok) {
        const message =
            (data && typeof data === 'object' && data.message) ||
            (typeof data === 'string' && data) ||
            `Request failed (${response.status}).`;
        throw new ApiError(message, response.status);
    }

    return data;
}

export const api = {
    login: (email, password) =>
        request('/Auth/login', { method: 'POST', body: { email, password }, auth: false }),

    register: (email, fullName, password) =>
        request('/Auth/register', { method: 'POST', body: { email, fullName, password }, auth: false }),

    // Breaks a raw task / pasted text into AI-generated micro-steps.
    createTask: (rawText) =>
        request('/Tasks/create-task', { method: 'POST', body: { rawText } }),

    // The backend binds a raw JSON string ([FromBody] string), so we send the
    // text directly — JSON.stringify wraps it in quotes exactly as required.
    analyzeDocument: (text) =>
        request('/Summarizer/analyze', { method: 'POST', body: text }),

    // --- Task persistence ---
    getMyTasks: () => request('/Tasks/my-tasks'),
    quickCreateTask: (title, description = '', dueDate = null) =>
        request('/Tasks/quick', { method: 'POST', body: { title, description, dueDate } }),
    breakdownTask: (rawText) =>
        request('/Tasks/breakdown', { method: 'POST', body: { rawText } }),
    updateTask: (id, payload) =>
        request(`/Tasks/${id}`, { method: 'PUT', body: payload }),
    deleteTask: (id) =>
        request(`/Tasks/${id}`, { method: 'DELETE' }),

    // --- Per-user settings persistence ---
    getSettings: () => request('/UserSettings'),
    saveSettings: (settings) =>
        request('/UserSettings', { method: 'PUT', body: settings }),
};

export { API_BASE };
