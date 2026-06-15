// Real Outlook integration via Microsoft Graph + MSAL (browser).
//
// Uses the REDIRECT flow (not popups): the whole tab navigates to Microsoft and
// back. This avoids the popup failures caused by Microsoft's Cross-Origin-Opener
// -Policy headers and background-tab timer throttling, which made loginPopup
// time out. Activates when an app registration is configured via env vars
// (see .env.example and docs/OUTLOOK-INTEGRATION.md):
//   VITE_MS_CLIENT_ID  — Application (client) ID
//   VITE_MS_TENANT     — "common" (personal + work) or a tenant ID
import { PublicClientApplication } from '@azure/msal-browser';

const clientId = (import.meta.env.VITE_MS_CLIENT_ID || '').trim();
const tenant = (import.meta.env.VITE_MS_TENANT || 'common').trim() || 'common';
const SCOPES = ['User.Read', 'Mail.Read'];

export const isOutlookConfigured = () => Boolean(clientId);

let msalInstance = null;
let initPromise = null;

function getInstance() {
    if (!clientId) throw new Error('Outlook is not configured (set VITE_MS_CLIENT_ID).');
    if (!msalInstance) {
        msalInstance = new PublicClientApplication({
            auth: {
                clientId,
                authority: `https://login.microsoftonline.com/${tenant}`,
                redirectUri: window.location.origin, // redirect flow returns to the app root
            },
            cache: { cacheLocation: 'localStorage' },
        });
    }
    return msalInstance;
}

// Call once on app startup (before rendering) so a redirect response is processed
// before React Router can strip the auth hash from the URL.
export async function initOutlook() {
    if (!clientId) return null;
    const pca = getInstance();
    if (!initPromise) {
        initPromise = pca.initialize().then(() => pca.handleRedirectPromise());
    }
    let result = null;
    try {
        result = await initPromise;
    } catch {
        result = null;
    }
    if (result?.account) pca.setActiveAccount(result.account);
    return result;
}

export function isOutlookSignedIn() {
    if (!clientId || !msalInstance) return false;
    return Boolean(msalInstance.getActiveAccount() || msalInstance.getAllAccounts()[0]);
}

// Start sign-in: full-page redirect to Microsoft, then back to the app.
export async function connectOutlook() {
    const pca = getInstance();
    await initOutlook();
    await pca.loginRedirect({ scopes: SCOPES });
}

async function getToken() {
    const pca = getInstance();
    await initOutlook();
    const account = pca.getActiveAccount() || pca.getAllAccounts()[0];
    if (!account) {
        await pca.loginRedirect({ scopes: SCOPES });
        return null; // navigating away to sign in
    }
    try {
        const res = await pca.acquireTokenSilent({ scopes: SCOPES, account });
        return res.accessToken;
    } catch {
        // Silent renewal failed (token expired, third-party cookies blocked, etc.)
        // — fall back to a full-page redirect re-auth instead of throwing a timeout.
        await pca.acquireTokenRedirect({ scopes: SCOPES, account });
        return null;
    }
}

// Sign out of Outlook locally so the user can connect a fresh account.
export async function disconnectOutlook() {
    if (!msalInstance) return;
    try {
        const account = msalInstance.getActiveAccount() || msalInstance.getAllAccounts()[0];
        await msalInstance.clearCache(account ? { account } : {});
    } catch { /* ignore */ }
    try { msalInstance.setActiveAccount(null); } catch { /* ignore */ }
}

// Fetch recent messages mapped to the inbox shape. Returns null if a sign-in
// redirect is in progress (the page is navigating away).
export async function fetchOutlookMessages(top = 8) {
    const token = await getToken();
    if (!token) return null;
    const url = `https://graph.microsoft.com/v1.0/me/messages?$top=${top}&$select=subject,bodyPreview,from,receivedDateTime`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error(`Microsoft Graph request failed (${res.status}).`);
    const data = await res.json();
    return (data.value || []).map((m) => ({
        id: m.id,
        sender: m.from?.emailAddress?.name || m.from?.emailAddress?.address || 'Unknown sender',
        subject: m.subject || '(no subject)',
        body: m.bodyPreview || '',
        time: m.receivedDateTime ? new Date(m.receivedDateTime).toLocaleDateString() : '',
    }));
}
