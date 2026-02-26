# Next.js Project with TypeScript, Tailwind CSS, and shadcn/ui

This is a modern web application built with Next.js, TypeScript, Tailwind CSS v4, and shadcn/ui components.

## Tech Stack

- **Next.js 16.1.6** - React framework with App Router
- **TypeScript 5.9.3** - Type-safe JavaScript
- **Tailwind CSS 4.2.1** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible component library
- **React 19.2.4** - Latest React with Server Components

## Getting Started

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Lint

```bash
npm run lint
```

## Project Structure

```
cropvideo/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page
│   │   └── globals.css     # Global styles with Tailwind
│   ├── components/
│   │   └── ui/             # shadcn/ui components
│   └── lib/
│       └── utils.ts        # Utility functions
├── public/                 # Static assets
├── components.json         # shadcn/ui configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── next.config.ts         # Next.js configuration
```

## Adding shadcn/ui Components

To add new shadcn/ui components:

```bash
npx shadcn@latest add [component-name]
```

Examples:
```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
```

Browse all available components at [ui.shadcn.com](https://ui.shadcn.com).

## Tailwind CSS v4

This project uses Tailwind CSS v4 with the new PostCSS plugin. The configuration uses:

- CSS variables for theme colors
- Dark mode support (class-based)
- Custom color palette compatible with shadcn/ui
- Responsive design utilities

## TypeScript

TypeScript is configured for strict type checking with:
- Strict mode enabled
- Path aliases (`@/*` maps to `src/*`)
- Next.js plugin for enhanced types

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

## License

ISC
