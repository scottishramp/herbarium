import { specimens } from './specimens.js';

const bibleId = 206;
const appKey = 'DTC93gaDqwk0eGrbxObUyAGRQGDTGbZylaskdXh6ASTmbs77';
const passages = new Map();
const $ = id => document.getElementById(id);
const plantLinks = specimens.map((plant, i) => {
  const link = document.createElement('a');
  link.href = '#' + plant.slug;
  link.dataset.number = String(i + 1).padStart(2, '0');
  link.textContent = plant.name;
  const item = document.createElement('li');
  item.append(link);
  $('plants').append(item);
  return link;
});
let activeRequest;

function selectLink(link, selected) {
  if (selected) link.setAttribute('aria-current', 'true');
  else link.removeAttribute('aria-current');
}

async function readPassage(id) {
  activeRequest?.abort();
  const request = new AbortController();
  activeRequest = request;
  $('verse').textContent = '';
  $('status').textContent = 'Loading passage…';
  $('retry').hidden = true;
  const timeout = setTimeout(() => request.abort(), 12000);
  try {
    let content = passages.get(id);
    if (!content) {
      const url = 'https://api.youversion.com/v1/bibles/' + bibleId + '/passages/' + id + '?format=text';
      const response = await fetch(url, {
        headers: { 'X-YVP-App-Key': appKey },
        signal: request.signal
      });
      if (!response.ok) throw new Error('Passage unavailable');
      const data = await response.json();
      if (typeof data.content !== 'string' || !data.content.trim()) throw new Error('Empty passage');
      content = data.content.trim();
      passages.set(id, content);
    }
    if (request !== activeRequest) return;
    $('verse').textContent = content;
    $('status').textContent = '';
  } catch {
    if (request !== activeRequest) return;
    $('status').textContent = 'The passage could not be loaded. Check your connection and try again.';
    $('retry').hidden = false;
  } finally {
    clearTimeout(timeout);
  }
}

function openFolio() {
  const [slug, ref] = location.hash.slice(1).split('/');
  const plant = specimens.find(specimen => specimen.slug === slug) || specimens[0];
  const [id] = plant.passages.find(([code]) => code === ref) || plant.passages[0];
  plantLinks.forEach((link, i) => selectLink(link, specimens[i] === plant));
  const plateNumber = plantLinks[specimens.indexOf(plant)].dataset.number;
  $('plate-number').textContent = 'Plate ' + plateNumber;
  $('illustration').src = './plates/' + plant.slug + '.webp';
  $('illustration').alt = plant.alt;
  $('plant-name').textContent = plant.name;
  $('scientific-name').textContent = plant.scientificName;
  $('plate-creator').textContent = plant.creator;
  $('plate-source').href = plant.sourceUrl;
  $('plate-source').textContent = plant.book + ' ↗';
  plant.passages.forEach(([code, reference], i) => {
    const link = $('passages').children[i];
    link.href = '#' + plant.slug + '/' + code;
    link.textContent = reference;
    selectLink(link, code === id);
  });
  $('chapter').href = 'https://www.bible.com/bible/' + bibleId + '/' + id.split('.').slice(0, 2).join('.');
  document.title = plant.name + ' · Herbarium · CreativeTech Lab';
  readPassage(id);
}

window.addEventListener('hashchange', openFolio);
$('retry').addEventListener('click', openFolio);
openFolio();
