# Midterm Project — React + TypeScript

A personal portfolio / midterm web app built with **Next.js 16 + TypeScript + Tailwind CSS + shadcn/ui**.

Pages: **Home** · **Profile** · **Game (Tic-Tac-Toe)**

---

## 🚀 Run Locally

### Prerequisites
- **Node.js** ≥ 20 — [nodejs.org](https://nodejs.org)
- **npm** (comes with Node.js)

### Steps

```bash
# 1. Install dependencies (only needed once, or after adding new packages)
npm install

# 2. Start the development server
npm run dev
```

Then open **http://localhost:3000** in your browser. The page hot-reloads on every file save.

---

## 🏗️ Build for Production

```bash
npm run build
```

This generates a fully static site in the **`out/`** folder. You can serve it with any static file host.

---

## 🌐 Deploy to GitHub Pages

The project is already set up for automatic GitHub Pages deployment.

### One-time setup
1. Push this project to a **GitHub repository**.
2. Go to **Settings → Pages** in your repo.
3. Under **Source**, select **"GitHub Actions"**.
4. That's it! Every push to `main` will auto-deploy.

### How it works
- The workflow at `.github/workflows/deploy.yml` runs on every push to `main`.
- It installs dependencies, runs `npm run build`, and deploys the `out/` folder to GitHub Pages.
- The base path is automatically set to `/<your-repo-name>` — no manual config needed.

### Your live URL will be:
```
https://<your-github-username>.github.io/<your-repo-name>/
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx       # Root layout (fonts, metadata)
│   ├── page.tsx         # Main page (hash-based routing)
│   └── globals.css      # Global styles & CSS variables
└── components/
    ├── home.tsx          # Home page
    ├── profile.tsx       # Profile page
    ├── tic-tac-toe.tsx   # Game page
    ├── navbar.tsx        # Navigation bar
    └── ui/               # shadcn/ui components
```

---

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| [Next.js 16](https://nextjs.org) | React framework (static export mode) |
| [TypeScript](https://typescriptlang.org) | Type safety |
| [Tailwind CSS v4](https://tailwindcss.com) | Utility-first styling |
| [shadcn/ui](https://ui.shadcn.com) | Component library |
| [Framer Motion](https://framer-motion.com) | Animations |
| [Recharts](https://recharts.org) | Charts |
