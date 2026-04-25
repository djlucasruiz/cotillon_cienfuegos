# 🎉 Cotillón Cienfuegos Concordia

Tienda online de cotillón y artículos de fiesta, construida con Next.js, TypeScript y Tailwind CSS.

## 🚀 Tech Stack

- **[Next.js](https://nextjs.org/)** — React framework for production
- **[React 19](https://react.dev/)** — UI library
- **[TypeScript](https://www.typescriptlang.org/)** — Type-safe JavaScript
- **[Tailwind CSS v4](https://tailwindcss.com/)** — Utility-first CSS framework
- **[Lucide React](https://lucide.dev/)** — Icon library
- **[Vercel Analytics](https://vercel.com/analytics)** — Performance analytics

---

## 📦 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/cotilloncienfuegosconcordia.git
cd cotilloncienfuegosconcordia
```

### 2. Install dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your values.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 📁 Project Structure

```
cotilloncienfuegosconcordia/
├── app/              # Next.js App Router pages & layouts
├── components/       # Reusable UI components
├── public/           # Static assets
├── .env.example      # Environment variables template
├── next.config.js    # Next.js configuration
├── tailwind.config.js# Tailwind CSS configuration
└── tsconfig.json     # TypeScript configuration
```

---

## 🌐 Deployment

### Deploy on Vercel (recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push your code to GitHub
2. Import the repository at [vercel.com/new](https://vercel.com/new)
3. Add your environment variables in the Vercel dashboard
4. Click **Deploy**

Vercel will automatically detect Next.js and configure the build settings.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.
