# Mindpal recruitment task

## Getting Started

Add environment variables to .env file:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://emjxerkukwkfxzqaimvr.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="sb_publishable_UmtjOfzRoA3SCrrw2eKNmQ_NX6amszk"
```

Install packages:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

## Architectural Decisions

The library utilizes the following architectural and technological solutions:

1. **Next.js (App Router)** - Chosen for its modern rendering model, performance optimizations, and support for React Server Components.
2. **Supabase (Auth & Database)** - Used for comprehensive authentication handling and persistent data storage (e.g., user favorites).
3. **TanStack Query (React Query)** - Manages server state, provides advanced caching mechanisms, and synchronizes data with the Rick and Morty API.
4. **Supabase Edge Functions** - Act as a proxy/adapter layer for the external GraphQL API, allowing better control over requests and security.
5. **Formik & Yup** - Used for form building and data validation, ensuring consistent error handling and code readability.
6. **HeroUI** - A UI component library utilizing Tailwind CSS, enabling fast creation of a modern and responsive design.
7. **Modular Structure** - Logic is extracted into custom hooks and components according to the Separation of Concerns (SoC) principle, making the application easier to maintain and scale.