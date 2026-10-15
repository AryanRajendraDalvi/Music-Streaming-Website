const fs = require('fs');
const path = require('path');
const https = require('https');

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return resolve(downloadFile(response.headers.location, dest));
      }
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: status ${response.statusCode}`));
      }
      const fileStream = fs.createWriteStream(dest);
      response.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve(dest);
      });
      fileStream.on('error', (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
    }).on('error', reject);
  });
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (response) => {
      let data = '';
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return resolve(fetchJson(response.headers.location));
      }
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

const songsList = [
  { term: "The Weeknd Blinding Lights", slug: "blinding-lights", genre: "Pop" },
  { term: "Harry Styles Watermelon Sugar", slug: "watermelon-sugar", genre: "Pop" },
  { term: "Dua Lipa Levitating", slug: "levitating", genre: "Pop" },
  { term: "Olivia Rodrigo good 4 u", slug: "good-4-u", genre: "Pop Rock" },
  { term: "The Kid LAROI Justin Bieber Stay", slug: "stay", genre: "Pop" },
  { term: "Glass Animals Heat Waves", slug: "heat-waves", genre: "Indie Pop" },
  { term: "The Weeknd Starboy", slug: "starboy", genre: "R&B, Pop" },
  { term: "Harry Styles As It Was", slug: "as-it-was", genre: "Pop" },
  { term: "Taylor Swift Cruel Summer", slug: "cruel-summer", genre: "Pop" },
  { term: "Billie Eilish bad guy", slug: "bad-guy", genre: "Electropop" },
  { term: "Ed Sheeran Shape of You", slug: "shape-of-you", genre: "Pop" },
  { term: "Dua Lipa Don't Start Now", slug: "dont-start-now", genre: "Disco, Pop" }
];

const artistsList = [
  { name: "The Weeknd", wiki: "The_Weeknd", slug: "the-weeknd", genre: "R&B, Pop", followers: "85.2M" },
  { name: "Dua Lipa", wiki: "Dua_Lipa", slug: "dua-lipa", genre: "Pop, Dance", followers: "73.1M" },
  { name: "Harry Styles", wiki: "Harry_Styles", slug: "harry-styles", genre: "Pop, Rock", followers: "68.9M" },
  { name: "Olivia Rodrigo", wiki: "Olivia_Rodrigo", slug: "olivia-rodrigo", genre: "Pop, Alternative", followers: "45.3M" },
  { name: "Taylor Swift", wiki: "Taylor_Swift", slug: "taylor-swift", genre: "Pop, Country", followers: "92.4M" },
  { name: "Billie Eilish", wiki: "Billie_Eilish", slug: "billie-eilish", genre: "Alternative, Pop", followers: "62.7M" },
  { name: "Ed Sheeran", wiki: "Ed_Sheeran", slug: "ed-sheeran", genre: "Pop, Acoustic", followers: "78.5M" },
  { name: "Glass Animals", wiki: "Glass_Animals", slug: "glass-animals", genre: "Indie Rock", followers: "18.3M" }
];

async function main() {
  console.log("Starting media download...");
  const processedSongs = [];

  for (let i = 0; i < songsList.length; i++) {
    const item = songsList[i];
    try {
      console.log(`Fetching: ${item.term}...`);
      const searchUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(item.term)}&entity=song&limit=1`;
      const searchRes = await fetchJson(searchUrl);
      if (searchRes.results && searchRes.results.length > 0) {
        const track = searchRes.results[0];
        const audioPath = path.join(__dirname, '..', 'public', 'audio', `${item.slug}.m4a`);
        const coverPath = path.join(__dirname, '..', 'public', 'covers', `${item.slug}.jpg`);
        
        const highResCover = track.artworkUrl100.replace('100x100bb', '600x600bb');
        
        console.log(`Downloading audio & cover for ${track.trackName} - ${track.artistName}...`);
        await Promise.all([
          downloadFile(track.previewUrl, audioPath),
          downloadFile(highResCover, coverPath)
        ]);

        const durationSec = Math.round(track.trackTimeMillis / 1000);
        const mins = Math.floor(durationSec / 60);
        const secs = durationSec % 60;
        const durationStr = `${mins}:${secs.toString().padStart(2, '0')}`;

        processedSongs.push({
          id: (i + 1).toString(),
          title: track.trackName,
          artist: track.artistName,
          album: track.collectionName,
          genre: item.genre,
          duration: durationStr,
          coverUrl: `/covers/${item.slug}.jpg`,
          audioUrl: `/audio/${item.slug}.m4a`,
          plays: 1200000 - i * 50000,
          likes: 45000 - i * 1500,
          liked: i % 2 === 0
        });
      }
    } catch (err) {
      console.error(`Error processing song ${item.term}:`, err.message);
    }
  }

  console.log("Fetching artists...");
  const processedArtists = [];
  for (let i = 0; i < artistsList.length; i++) {
    const artist = artistsList[i];
    try {
      console.log(`Fetching artist photo: ${artist.name}...`);
      const wikiRes = await fetchJson(`https://en.wikipedia.org/api/rest_v1/page/summary/${artist.wiki}`);
      if (wikiRes.thumbnail && wikiRes.thumbnail.source) {
        const artistPhotoPath = path.join(__dirname, '..', 'public', 'artists', `${artist.slug}.jpg`);
        await downloadFile(wikiRes.thumbnail.source, artistPhotoPath);
        processedArtists.push({
          id: (i + 1).toString(),
          name: artist.name,
          genre: artist.genre,
          followers: artist.followers,
          imageUrl: `/artists/${artist.slug}.jpg`,
          verified: true
        });
      }
    } catch (err) {
      console.error(`Error processing artist ${artist.name}:`, err.message);
    }
  }

  fs.writeFileSync(path.join(__dirname, 'processed_media.json'), JSON.stringify({
    songs: processedSongs,
    artists: processedArtists
  }, null, 2));

  console.log("Successfully fetched all media and saved metadata to scripts/processed_media.json!");
}

main();
