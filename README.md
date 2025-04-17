# FIR Fitness App

A modern fitness application built with Next.js, TypeScript, TailwindCSS, and Supabase.

## 🚀 Features

- **Modern Stack**: Built with Next.js 15, React 19, TypeScript, and TailwindCSS
- **UI Components**: Using Shadcn UI components for a beautiful and consistent design
- **Authentication**: Powered by Supabase Auth
- **Responsive Design**: Fully responsive layout for all devices
- **Dark Mode**: Built-in dark mode support with next-themes
- **Form Handling**: Advanced form management with react-hook-form and zod validation
- **Data Visualization**: Interactive charts with Recharts
- **Date Handling**: Comprehensive date management with date-fns and react-day-picker

## 📦 Prerequisites

- Node.js 18.17 or later
- pnpm (recommended) or npm
- Supabase account

## 🛠️ Installation

1. Clone the repository:

```bash
git clone https://github.com/codeplaygroundspace/fir-fitness-app.git
cd fir-fitness-app
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env.local` file in the root directory with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:

```bash
pnpm dev
```

## 🏗️ Project Structure

```
├── app/              # Next.js app directory
├── components/       # Reusable UI components
├── contexts/         # React contexts
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and configurations
├── public/           # Static assets
└── styles/           # Global styles
```

## 🧪 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## 🎨 UI Components

The project uses [Shadcn UI](https://ui.shadcn.com/) components, which are built on top of Radix UI primitives and styled with TailwindCSS. This provides:

- Accessible components out of the box
- Customizable design system
- Dark mode support
- Responsive layouts

## 🔐 Authentication

Authentication is handled by Supabase Auth, providing:

- Email/password authentication
- Social authentication
- Session management
- Protected routes

## 📝 Code Style

- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety
- TailwindCSS for styling

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Supabase](https://supabase.com/)
- [React](https://react.dev/)
