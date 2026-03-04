# Push this project to GitHub (public)

## 1. Create a new repository on GitHub

1. Go to **https://github.com/new**
2. **Repository name:** e.g. `hrms-lite-api` (or any name you like)
3. **Public**
4. Do **not** add a README, .gitignore, or license (this repo already has them)
5. Click **Create repository**

## 2. Add remote and push

Replace `YOUR_USERNAME` and `YOUR_REPO` with your GitHub username and the repo name you chose (e.g. `hrms-lite-api`):

```bash
cd /Users/amit/New_project/BE
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

Example if your username is `amitguptaa1999` and repo is `hrms-lite-api`:

```bash
git remote add origin https://github.com/amitguptaa1999/hrms-lite-api.git
git branch -M main
git push -u origin main
```

Your code will be on GitHub as a **public** repo. The `.env` file (with your MongoDB password) is **not** included; it stays only on your machine.
