// Real Outlook integration via Microsoft Graph + MSAL (browser).
//
// This is genuine integration — it performs a real OAuth sign-in and calls the
// Microsoft Graph API. It only activates when you provide an Azure AD (Entra)
// app registration via env vars (see .env.example and docs/OUTLOOK-INTEGRATION.md):
//   VITE_MS_CLIENT_ID  — the app registration's Application (client) ID
//   VITE_MS_TENANT     — your tenant ID, or "organizations" / "common"
//
// If no client ID is configured, the inbox falls back to representative demo
// emails so the email→task flow can still be demonstrated.
import { PublicClientApplication } from '@azure/msal-browser';

const clientId = import.meta.env.VITE_MS_CLIENT_ID;
const tenant = import.meta.env.VITE_MS_TENANT || 'common';
const SCOPES = ['Mail.Read'];

export const isOutlookConfigured = () => Boolean(clientId);

let msalInstance = null;
let initialized = false;

function getInstance() {
    if (!clientId) throw new Error('Outlook is not configured (set VITE_MS_CLIENT_ID).');
    if (!msalInstance) {
        msalInstance = new PublicClientApplication({
            auth: {
                clientId,
                authority: `https://login.microsoftonline.com/${tenant}`,
                redirectUri: window.location.origin,
            },
            cache: { cacheLocation: 'localStorage' },
        });
    }
    return msalInstance;
}

async function getToken() {
    const pca = getInstance();
    if (!initialized) {
        await pca.initialize();
        initialized = true;
    }
    let account = pca.getActiveAccount() || pca.getAllAccounts()[0];
    if (!account) {
        const result = await pca.loginPopup({ scopes: SCOPES });
        account = result.account;
        pca.setActiveAccount(account);
    }
    try {
        const result = await pca.acquireTokenSilent({ scopes: SCOPES, account });
        return result.accessToken;
    } catch {
        const result = await pca.acquireTokenPopup({ scopes: SCOPES });
        return result.accessToken;
    }
}

// Fetch recent messages and map them to the shape OutlookInboxModal expects.
export async function fetchOutlookMessages(top = 8) {
    const token = await getToken();
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
