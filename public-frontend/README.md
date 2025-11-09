# Next.js Project with Docker Support

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Docker Setup

To run the frontend with Docker, two Dockerfiles are provided: `Dockerfile` for production (with build) and `Dockerfile.dev` for development (no build, hot-reload via volumes).

### Development Mode (Hot-Reload, No Build)
1. Ensure Docker and Docker Compose are installed.
2. In the `public-frontend` directory, run:
   ```bash
   docker compose up --build
   ```
   This uses `Dockerfile.dev`, installs deps, runs `npm run dev`, and mounts volumes for live code changes (src/public). Access at http://localhost:3000. Changes to code will hot-reload without rebuilding the image.

3. To stop: `docker compose down`.

### Production Mode (With Build)
1. Build the image:
   ```bash
   docker build -f Dockerfile -t frontend-prod .
   ```
2. Run the container:
   ```bash
   docker run -p 3000:3000 -e NODE_ENV=production frontend-prod
   ```
   Access at http://localhost:3000.

### Logs and Monitoring
- View logs: `docker compose logs -f` (dev) or `docker logs <container-id>` (prod).
- Healthcheck is built-in; container restarts if unhealthy.

For more details, see the [Dockerfile](Dockerfile), [Dockerfile.dev](Dockerfile.dev), and [docker-compose.yml](docker-compose.yml).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
