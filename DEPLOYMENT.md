# Deployment guide (GitHub CI/CD)

The repository ships with three workflow files:

| File                                          | Trigger                     | Purpose                                            |
| --------------------------------------------- | --------------------------- | -------------------------------------------------- |
| `.github/workflows/ci.yml`                    | Every push and pull request | Lint, type-check, test, build                      |
| `.github/workflows/deploy.yml`                | Push to `main`, manual run  | Verify, then deploy to **GitHub Pages** (Option A) |
| `.github/workflows/vercel-deploy.yml.example` | Inactive until renamed      | Verify, then deploy to **Vercel** (Option B)       |

Pick **one** deployment option. Both produce a public HTTPS URL that you can open on a phone.

---

## 1. Prerequisites

- A GitHub account and [Git](https://git-scm.com/) installed locally
- Node.js **20.19+**. `.nvmrc` pins Node 20, and CI uses the same version.
- Local checks passing:

  ```bash
  npm ci
  npm run lint && npm run typecheck && npm test && npm run build
  ```

## 2. Create the GitHub repository and push

1. On GitHub, click **New repository**.
   - Name: e.g. `contract-request-wizard`
   - Visibility: **Public**. GitHub Pages on free plans requires a public repository, and the assignment asks for one.
   - Do **not** initialise it with a README, `.gitignore` or license. This repo already has them.
2. Push the existing history. The repo already has an atomic commit log on `main`.

   ```bash
   cd contract-request-wizard
   git remote add origin https://github.com/<your-user>/contract-request-wizard.git
   git push -u origin main
   ```

3. Open the **Actions** tab. The **CI** workflow should start immediately and turn green.

---

## Option A: GitHub Pages (recommended, no third-party account)

### A1. Enable Pages with GitHub Actions as the source

1. Go to **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**. Do not choose "Deploy from a branch".
3. No other setting is needed. `deploy.yml` uses the official `actions/configure-pages`, `actions/upload-pages-artifact` and `actions/deploy-pages` actions.

### A2. How the workflow works

`deploy.yml` runs on every push to `main`, or manually via **Actions → Deploy to GitHub Pages → Run workflow**.

**`build` job:**

1. `npm ci`
2. lint, type-check and test. A failing check blocks the deployment.
3. `npm run build` with `BASE_PATH=/<repo-name>/`
4. upload `dist/` as the Pages artifact

**`deploy` job:** publishes the artifact to the `github-pages` environment.

A project page is served from a sub-path: `https://<user>.github.io/<repo>/`. `vite.config.ts` reads `base: process.env.BASE_PATH ?? '/'`, so asset URLs are emitted with the correct prefix. The workflow fills in the repository name automatically:

```yaml
env:
  BASE_PATH: /${{ github.event.repository.name }}/
```

> Using a **custom domain** or a **user/organisation page** (`<user>.github.io` repo)? Those are served from the root, so change `BASE_PATH` to `/`.

### A3. Trigger the first deployment

Either push a commit to `main` or run the workflow manually. When it finishes:

- the `deploy` job shows the live URL
- the URL also appears under **Settings → Pages** and as the `github-pages` environment on the repo home page

```
https://<your-user>.github.io/contract-request-wizard/
```

The app has no client-side router, so no 404/SPA fallback is required.

---

## Option B: Vercel via GitHub Actions

Use this option if you prefer Vercel's CDN, preview deployments per pull request, or a root-path URL.

### B1. Create the Vercel project and collect IDs

1. Install the CLI and log in:

   ```bash
   npm i -g vercel
   vercel login
   ```

2. From the project folder, run `vercel link`. Create a new project and accept the detected Vite settings: build command `npm run build`, output directory `dist`.
3. Open `.vercel/project.json` (this file is git-ignored by Vercel) and copy `orgId` and `projectId`.
4. Create a token at **vercel.com → Account Settings → Tokens**.
5. In the Vercel project settings, under **Git**, disconnect automatic Git deployments if Vercel's GitHub app is connected. Otherwise every push deploys twice.

### B2. Add repository secrets

Add these three under **GitHub → Settings → Secrets and variables → Actions → New repository secret**:

| Secret              | Value                                   |
| ------------------- | --------------------------------------- |
| `VERCEL_TOKEN`      | the token from step 4                   |
| `VERCEL_ORG_ID`     | `orgId` from `.vercel/project.json`     |
| `VERCEL_PROJECT_ID` | `projectId` from `.vercel/project.json` |

### B3. Activate the workflow

```bash
git mv .github/workflows/vercel-deploy.yml.example .github/workflows/vercel-deploy.yml
git rm .github/workflows/deploy.yml        # or keep it and disable it in the Actions tab
git commit -m "ci: deploy to Vercel"
git push
```

The workflow behaves differently by trigger:

| Trigger        | Result                                                       |
| -------------- | ------------------------------------------------------------ |
| Pull request   | Verify, then deploy a **preview** (URL shown in the job log) |
| Push to `main` | Verify, then deploy to **production**                        |

`BASE_PATH` is not set here, so the app is served from `/`.

---

## 3. Verify on a mobile device

1. Open the deployed URL on a phone, or scan a QR code generated from it.
2. Smoke test:
   - **Validation:** tap **Next** on an empty step 1. Errors appear and the step does not advance.
   - **Keyboard:** focus the email field. The sticky action bar sits directly above the keyboard and the field is not covered.
   - **Draft restore:** fill a few fields, move to step 2 and pull to refresh. The step and values are restored, and a "Draft restored" toast appears.
   - **Dynamic list:** add, edit and remove services. Duplicate services are blocked.
   - **Submit:** on step 3, submit. The success screen appears, and a reload starts with an empty form, which shows the draft was cleared.
3. Optional: run **Lighthouse → Mobile** in Chrome DevTools against the URL.

## 4. Troubleshooting

| Symptom                                           | Fix                                                                                                          |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Blank page; 404s for `/assets/*.js`               | `BASE_PATH` does not match the URL path. For project pages it must be `/<repo-name>/` with both slashes.     |
| `deploy` job fails with "Pages not enabled" / 404 | Set **Settings → Pages → Source** to **GitHub Actions**, then re-run the workflow.                           |
| `deploy` job waits for approval                   | **Settings → Environments → github-pages** has protection rules. Approve the run or allow the `main` branch. |
| `npm ci` fails with an engine or lockfile error   | Commit `package-lock.json` and use Node 20.19+ (`.nvmrc`).                                                   |
| Vercel: `Error: No existing credentials found`    | Check that `VERCEL_TOKEN` is set as a secret, not a variable, and has not expired.                           |
| Vercel: deployment goes to the wrong project      | Re-check `VERCEL_ORG_ID` / `VERCEL_PROJECT_ID` against `.vercel/project.json`.                               |
| Every push deploys twice on Vercel                | Disconnect Vercel's Git integration (step B1.5).                                                             |
