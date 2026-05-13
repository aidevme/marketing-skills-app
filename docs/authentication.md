# Authentication

This document describes the supported authentication methods for the Marketing Skills App and how to configure each one.

---

## Table of Contents

1. [Standard (Email & Password)](#1-standard-email--password)
2. [Microsoft Entra ID (Organizational)](#2-microsoft-entra-id-organizational)
3. [Microsoft Entra External ID (Customer-Facing)](#3-microsoft-entra-external-id-customer-facing)
4. [GitHub OAuth](#4-github-oauth)
5. [LinkedIn OAuth](#5-linkedin-oauth)
6. [Comparison Summary](#6-comparison-summary)

---

## 1. Standard (Email & Password)

### Overview

Users register and sign in with an email address and a password stored in the application's own user database.

### Flow

```
User → Submit email + password → Server validates credentials → Issue JWT/session → Authenticated
```

### Implementation Notes

- Passwords must be hashed using **bcrypt** (min cost factor 12) or **Argon2id** before storage. Never store plain text or MD5/SHA-1 hashes.
- Enforce a minimum password length of 12 characters.
- Rate-limit login attempts (e.g., 5 attempts per 15 minutes per IP) to prevent brute-force attacks.
- Provide a secure password-reset flow: generate a cryptographically random token, store its hash, expire it after 1 hour, and send it via email as a one-time link.
- Consider requiring email verification before the first login.

### Required Environment Variables

| Variable | Description |
|---|---|
| `JWT_SECRET` | Secret key for signing JSON Web Tokens (min 256-bit entropy) |
| `JWT_EXPIRES_IN` | Token expiry duration (e.g. `1h`, `7d`) |
| `SMTP_HOST` | SMTP server for sending password-reset emails |
| `SMTP_PORT` | SMTP port (typically `587` for STARTTLS) |
| `SMTP_USER` | SMTP username |
| `SMTP_PASS` | SMTP password |

### Security Checklist

- [ ] Passwords hashed with bcrypt/Argon2id
- [ ] Rate limiting on `/login` and `/reset-password`
- [ ] HTTPS enforced (no credentials over HTTP)
- [ ] Password-reset tokens are single-use and expire
- [ ] Email enumeration prevented (same response for unknown email)

---

## 2. Microsoft Entra ID (Organizational)

### Overview

Microsoft **Entra ID** (formerly Azure Active Directory) enables sign-in for users who belong to a Microsoft 365 / Azure AD tenant. This is suited for **internal/enterprise users** — employees or contractors with organizational accounts.

### Authentication Protocol

**OpenID Connect (OIDC)** on top of **OAuth 2.0** using the authorization code flow with PKCE.

### Flow

```
User → Redirect to Entra ID login → User authenticates with org credentials
→ Entra issues authorization code → App exchanges code for tokens
→ Validate ID token → Authenticated
```

### App Registration (Azure Portal)

1. Go to **Azure Portal → Microsoft Entra ID → App registrations → New registration**.
2. Set **Redirect URI** to `https://<your-app>/auth/entra/callback` (type: Web).
3. Under **Certificates & secrets**, create a client secret.
4. Under **API permissions**, add `openid`, `profile`, `email` (Microsoft Graph, delegated).
5. Note the **Application (client) ID** and **Directory (tenant) ID**.

### Required Environment Variables

| Variable | Description |
|---|---|
| `ENTRA_TENANT_ID` | Azure AD tenant ID (or `common` for multi-tenant) |
| `ENTRA_CLIENT_ID` | Application (client) ID from app registration |
| `ENTRA_CLIENT_SECRET` | Client secret value |
| `ENTRA_REDIRECT_URI` | Callback URL registered in the app |

### OIDC Discovery Endpoint

```
https://login.microsoftonline.com/{ENTRA_TENANT_ID}/v2.0/.well-known/openid-configuration
```

### Security Checklist

- [ ] Validate `iss`, `aud`, `exp`, and `nonce` claims in the ID token
- [ ] Use PKCE (`code_challenge_method=S256`) for the authorization code flow
- [ ] Store client secret in Azure Key Vault or equivalent — never in source code
- [ ] Restrict app registration to your tenant (set **Supported account types** to single tenant unless multi-tenant is required)
- [ ] Enable **Conditional Access** policies in Entra ID for MFA enforcement

---

## 3. Microsoft Entra External ID (Customer-Facing)

### Overview

**Entra External ID** (formerly Azure AD B2C / External Identities) is Microsoft's CIAM (Customer Identity and Access Management) platform. Unlike organizational Entra ID, it is designed for **external users** — customers, partners, and public sign-ups — with customizable user flows and branding.

### Key Differences from Entra ID

| Feature | Entra ID | Entra External ID |
|---|---|---|
| Target audience | Employees / org members | Customers / external users |
| Directory | Corporate Azure AD tenant | Dedicated external tenant |
| Self-service sign-up | No | Yes |
| Custom branding | Limited | Fully customizable |
| Social identity providers | Via B2B | Built-in (Google, Facebook, etc.) |

### Authentication Protocol

**OpenID Connect / OAuth 2.0** via user flows (sign-up/sign-in policies) or custom policies (Identity Experience Framework).

### Flow

```
User → Redirect to Entra External ID user flow
→ User signs up or signs in (email OTP, social, etc.)
→ External ID issues authorization code → App exchanges for tokens
→ Validate ID token → Authenticated
```

### Setup

1. Create a **new external tenant** in the Azure Portal (separate from your organizational tenant).
2. Register an application in the external tenant under **App registrations**.
3. Create a **User flow**: Sign up and sign in → select identity providers (Email OTP, social logins).
4. Customize the sign-in page under **Company branding**.
5. Set the **Redirect URI** to `https://<your-app>/auth/entra-external/callback`.

### Required Environment Variables

| Variable | Description |
|---|---|
| `ENTRA_EXT_TENANT_NAME` | External tenant name (e.g. `contoso`) |
| `ENTRA_EXT_TENANT_ID` | External tenant ID (GUID) |
| `ENTRA_EXT_CLIENT_ID` | Application client ID in the external tenant |
| `ENTRA_EXT_CLIENT_SECRET` | Client secret |
| `ENTRA_EXT_REDIRECT_URI` | Callback URL |
| `ENTRA_EXT_USER_FLOW` | User flow name (e.g. `B2C_1_signupsignin`) |

### OIDC Discovery Endpoint

```
https://{ENTRA_EXT_TENANT_NAME}.ciamlogin.com/{ENTRA_EXT_TENANT_ID}/v2.0/.well-known/openid-configuration
```

### Security Checklist

- [ ] Use a dedicated external tenant — do not reuse the organizational tenant
- [ ] Enable MFA in the user flow
- [ ] Configure token lifetimes appropriate for public users (shorter access tokens)
- [ ] Enable **email verification** in the sign-up flow
- [ ] Review and restrict the API permissions granted to the app

---

## 4. GitHub OAuth

### Overview

Users sign in with their **GitHub account** using OAuth 2.0. Suitable for developer-focused products. GitHub does not support OIDC natively — identity is confirmed by calling the GitHub API with the access token.

### Authentication Protocol

**OAuth 2.0** authorization code flow.

### Flow

```
User → Redirect to github.com/login/oauth/authorize
→ User authorizes the app → GitHub issues authorization code
→ App exchanges code for access token (POST to github.com/login/oauth/access_token)
→ App calls api.github.com/user to retrieve user identity
→ Authenticated
```

### GitHub App Registration

1. Go to **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App**.
2. Set **Homepage URL** to your app's URL.
3. Set **Authorization callback URL** to `https://<your-app>/auth/github/callback`.
4. Note the **Client ID** and generate a **Client Secret**.

### Required Environment Variables

| Variable | Description |
|---|---|
| `GITHUB_CLIENT_ID` | OAuth App client ID |
| `GITHUB_CLIENT_SECRET` | OAuth App client secret |
| `GITHUB_REDIRECT_URI` | Callback URL registered on GitHub |

### Scopes

Request only the minimum required scopes:

| Scope | Purpose |
|---|---|
| `read:user` | Read the user's public profile (name, avatar, username) |
| `user:email` | Access the user's email addresses (required if email is not public) |

### Security Checklist

- [ ] Validate the `state` parameter on callback to prevent CSRF
- [ ] Store client secret securely — never expose it client-side
- [ ] Request only necessary scopes (`read:user`, `user:email`)
- [ ] Handle the case where the user's email is not verified on GitHub (`email.verified === false`)
- [ ] Use HTTPS for all redirect URIs

---

## 5. LinkedIn OAuth

### Overview

Users sign in with their **LinkedIn account** using OAuth 2.0 with OIDC. Suited for professional/B2B products. LinkedIn supports the OpenID Connect flow via the **Sign In with LinkedIn using OpenID Connect** product.

### Authentication Protocol

**OpenID Connect** on top of **OAuth 2.0** authorization code flow.

### Flow

```
User → Redirect to linkedin.com/oauth/v2/authorization
→ User authorizes → LinkedIn issues authorization code
→ App exchanges code for tokens (POST to linkedin.com/oauth/v2/accessToken)
→ Validate ID token or call userinfo endpoint
→ Authenticated
```

### LinkedIn App Registration

1. Go to **LinkedIn Developer Portal → Create App** (https://developer.linkedin.com).
2. Associate the app with a LinkedIn Page.
3. Under **Auth**, add `https://<your-app>/auth/linkedin/callback` as an **Authorized Redirect URL**.
4. Under **Products**, request access to **Sign In with LinkedIn using OpenID Connect**.
5. Note the **Client ID** and **Client Secret** from the Auth tab.

### Required Environment Variables

| Variable | Description |
|---|---|
| `LINKEDIN_CLIENT_ID` | LinkedIn app client ID |
| `LINKEDIN_CLIENT_SECRET` | LinkedIn app client secret |
| `LINKEDIN_REDIRECT_URI` | Callback URL registered on LinkedIn |

### Scopes

| Scope | Purpose |
|---|---|
| `openid` | Required for OIDC flow |
| `profile` | User's name and profile photo |
| `email` | User's email address |

### OIDC Discovery Endpoint

```
https://www.linkedin.com/oauth/.well-known/openid-configuration
```

### Security Checklist

- [ ] Validate the `state` parameter to prevent CSRF
- [ ] Validate `iss`, `aud`, `exp` claims in the ID token
- [ ] Only request `openid profile email` — avoid requesting advertising or write scopes
- [ ] LinkedIn access tokens are short-lived (~60 days); handle token refresh or re-authentication gracefully
- [ ] Store client secret securely

---

## 6. Comparison Summary

| | Email/Password | Entra ID | Entra External ID | GitHub | LinkedIn |
|---|---|---|---|---|---|
| **Protocol** | Custom | OIDC / OAuth 2.0 | OIDC / OAuth 2.0 | OAuth 2.0 | OIDC / OAuth 2.0 |
| **Best for** | Any user | Org employees | Customers / public | Developers | Professionals / B2B |
| **Self-service sign-up** | Yes | No | Yes | Yes | Yes |
| **MFA support** | App-managed | Entra Conditional Access | Configurable in user flow | GitHub account setting | LinkedIn account setting |
| **Email verified by provider** | No (app must verify) | Yes | Configurable | Partial | Yes |
| **Requires own user DB** | Yes | Optional | Optional | Optional | Optional |
| **Custom branding** | Full | Limited | Full | No | No |
