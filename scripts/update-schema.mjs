#!/usr/bin/env node
// Downloads the latest netex-jsonschema-full-2.0.json from GitHub releases
// Run: node scripts/update-schema.mjs
import { createWriteStream } from 'fs';
import { get } from 'https';
import { pipeline } from 'stream/promises';

const API_URL = 'https://api.github.com/repos/entur/netex-typescript-model/releases/latest';
const ASSET_NAME = 'netex-jsonschema-full-2.0.json';
const OUT_PATH = 'public/netex-schema.json';

async function fetchJson(url) {
  return new Promise((resolve, reject) => {
    get(url, { headers: { 'User-Agent': 'netex-json-browser/1.0' } }, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => resolve(JSON.parse(body)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

const release = await fetchJson(API_URL);
const asset = release.assets.find(a => a.name === ASSET_NAME);
if (!asset) throw new Error(`Asset ${ASSET_NAME} not found in ${release.tag_name}`);

console.log(`Downloading ${ASSET_NAME} from ${release.tag_name}…`);

await new Promise((resolve, reject) => {
  function follow(url) {
    get(url, { headers: { 'User-Agent': 'netex-json-browser/1.0' } }, res => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        follow(res.headers.location);
      } else {
        pipeline(res, createWriteStream(OUT_PATH)).then(resolve).catch(reject);
      }
    }).on('error', reject);
  }
  follow(asset.browser_download_url);
});

console.log(`Written to ${OUT_PATH}`);
