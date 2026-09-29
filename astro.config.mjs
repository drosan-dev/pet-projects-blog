import { defineConfig } from 'astro/config';

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const owner = process.env.GITHUB_REPOSITORY_OWNER ?? 'your-github-name';
const isUserSite = repository === `${owner}.github.io`;

export default defineConfig({
  site: process.env.SITE_URL ?? `https://${owner}.github.io`,
  base: process.env.BASE_PATH ?? (repository && !isUserSite ? `/${repository}` : '/'),
  output: 'static',
  trailingSlash: 'always'
});
