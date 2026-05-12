# Deploying to Azure Web App

This guide covers deploying the Marketing Skills App (Vite + React) to Azure App Service as a static web application served by Node.js.

---

## Prerequisites

- [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli) installed and authenticated (`az login`)
- Node.js v22 or higher
- An active Azure subscription

---

## 1. Build the App

```bash
npm install
npm run build
```

The production output is written to `dist/`.

---

## 2. Add a Server Entry Point

Azure App Service (Node.js) needs an HTTP server to serve the static files. Create a minimal Express server at the project root:

```bash
npm install express --save
```

Create `server.js` in the project root:

```js
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static(join(__dirname, 'dist')));

// Return index.html for all routes (SPA fallback)
app.get('*', (_req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}`));
```

Update `package.json` to set the production start command:

```json
"scripts": {
  "start": "vite",
  "start:prod": "node server.js",
  "build": "tsc && vite build"
}
```

---

## 3. Create Azure Resources

### 3a. Create a Resource Group

```bash
az group create \
  --name marketing-skills-rg \
  --location eastus
```

### 3b. Create an App Service Plan

```bash
az appservice plan create \
  --name marketing-skills-plan \
  --resource-group marketing-skills-rg \
  --sku B1 \
  --is-linux
```

### 3c. Create the Web App

```bash
az webapp create \
  --name marketing-skills-app \
  --resource-group marketing-skills-rg \
  --plan marketing-skills-plan \
  --runtime "NODE:22-lts"
```

> **Note:** Replace `marketing-skills-app` with a globally unique name. The app will be available at `https://<app-name>.azurewebsites.net`.

---

## 4. Configure the Startup Command

Tell Azure to run the production server:

```bash
az webapp config set \
  --name marketing-skills-app \
  --resource-group marketing-skills-rg \
  --startup-file "node server.js"
```

---

## 5. Deploy

### Option A: Deploy via ZIP (quickest)

```bash
# Build first
npm run build

# Create a zip of the required files
Compress-Archive -Path dist, server.js, package.json, package-lock.json -DestinationPath deploy.zip -Force

# Deploy
az webapp deploy \
  --name marketing-skills-app \
  --resource-group marketing-skills-rg \
  --src-path deploy.zip \
  --type zip
```

### Option B: Deploy via GitHub Actions (recommended for CI/CD)

1. In the Azure Portal, go to your Web App → **Deployment Center**.
2. Choose **GitHub** as the source and authorize access.
3. Select your repository (`aidevme/marketing-skills-app`) and branch (`main`).
4. Azure will generate a `.github/workflows/azure-webapps-node.yml` workflow file and commit it to your repo.
5. Push to `main` to trigger automatic deployments.

Alternatively, generate the publish profile manually:

```bash
az webapp deployment list-publishing-profiles \
  --name marketing-skills-app \
  --resource-group marketing-skills-rg \
  --xml > publish-profile.xml
```

Add the contents as a GitHub secret named `AZURE_WEBAPP_PUBLISH_PROFILE` and reference it in your workflow.

---

## 6. Set Environment Variables (if needed)

```bash
az webapp config appsettings set \
  --name marketing-skills-app \
  --resource-group marketing-skills-rg \
  --settings NODE_ENV=production
```

---

## 7. Verify the Deployment

```bash
az webapp browse \
  --name marketing-skills-app \
  --resource-group marketing-skills-rg
```

This opens `https://marketing-skills-app.azurewebsites.net` in your default browser.

---

## 8. Enable HTTPS Only (recommended)

```bash
az webapp update \
  --name marketing-skills-app \
  --resource-group marketing-skills-rg \
  --https-only true
```

---

## Useful Commands

| Task | Command |
|---|---|
| Stream live logs | `az webapp log tail --name marketing-skills-app --resource-group marketing-skills-rg` |
| Restart the app | `az webapp restart --name marketing-skills-app --resource-group marketing-skills-rg` |
| View app settings | `az webapp config appsettings list --name marketing-skills-app --resource-group marketing-skills-rg` |
| Delete all resources | `az group delete --name marketing-skills-rg --yes` |

---

## References

- [Azure App Service documentation](https://learn.microsoft.com/en-us/azure/app-service/)
- [Deploy a Node.js app to Azure](https://learn.microsoft.com/en-us/azure/app-service/quickstart-nodejs)
- [GitHub Actions for Azure Web Apps](https://learn.microsoft.com/en-us/azure/app-service/deploy-github-actions)
