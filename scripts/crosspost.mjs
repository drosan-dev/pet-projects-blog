import fs from 'node:fs/promises';
import matter from 'gray-matter';

const file = process.argv[2];
if (!file) throw new Error('Usage: node scripts/crosspost.mjs <markdown-file>');

const source = await fs.readFile(file, 'utf8');
const { data } = matter(source);
if (data.draft || data.announce === false) {
  console.log(`Skip ${file}: draft or announce=false`);
  process.exit(0);
}

const slug = file.split(/[\\/]/).pop().replace(/\.mdx?$/, '');
const baseUrl = (process.env.SITE_URL ?? '').replace(/\/$/, '');
const basePath = (process.env.BASE_PATH ?? '').replace(/^\/?/, '/').replace(/\/$/, '');
if (!baseUrl) throw new Error('SITE_URL is required');
const url = `${baseUrl}${basePath}/projects/${slug}/`;
const text = `${data.title}\n\n${data.description}\n\n${url}`;

const jobs = [];

if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
  jobs.push(fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text, disable_web_page_preview: false })
  }).then(assertOk('Telegram')));
} else {
  console.log('Telegram skipped: secrets are not configured');
}

if (process.env.VK_ACCESS_TOKEN && process.env.VK_GROUP_ID) {
  const form = new URLSearchParams({
    owner_id: `-${process.env.VK_GROUP_ID.replace(/^-/, '')}`,
    from_group: '1',
    message: text,
    access_token: process.env.VK_ACCESS_TOKEN,
    v: '5.199'
  });
  jobs.push(fetch('https://api.vk.com/method/wall.post', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: form
  }).then(assertVk));
} else {
  console.log('VK skipped: secrets are not configured');
}

await Promise.all(jobs);

function assertOk(service) {
  return async (response) => {
    const body = await response.json();
    if (!response.ok || body.ok === false) throw new Error(`${service}: ${body.description ?? response.statusText}`);
    console.log(`${service}: published`);
  };
}

async function assertVk(response) {
  const body = await response.json();
  if (!response.ok || body.error) throw new Error(`VK: ${body.error?.error_msg ?? response.statusText}`);
  console.log('VK: published');
}
