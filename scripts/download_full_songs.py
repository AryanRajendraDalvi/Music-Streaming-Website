import os
import sys
import imageio_ffmpeg
import yt_dlp

ffmpeg_path = imageio_ffmpeg.get_ffmpeg_exe()
output_dir = os.path.join(os.path.dirname(__file__), "..", "public", "audio")
os.makedirs(output_dir, exist_ok=True)

songs = [
    {"query": "ytsearch1:The Weeknd Blinding Lights official audio", "slug": "blinding-lights"},
    {"query": "ytsearch1:Harry Styles Watermelon Sugar official audio", "slug": "watermelon-sugar"},
    {"query": "ytsearch1:Dua Lipa Levitating official audio", "slug": "levitating"},
    {"query": "ytsearch1:Olivia Rodrigo good 4 u official audio", "slug": "good-4-u"},
    {"query": "ytsearch1:The Kid LAROI Justin Bieber STAY official audio", "slug": "stay"},
    {"query": "ytsearch1:Glass Animals Heat Waves official audio", "slug": "heat-waves"},
    {"query": "ytsearch1:The Weeknd Starboy official audio", "slug": "starboy"},
    {"query": "ytsearch1:Harry Styles As It Was official audio", "slug": "as-it-was"},
    {"query": "ytsearch1:Taylor Swift Cruel Summer official audio", "slug": "cruel-summer"},
    {"query": "ytsearch1:Billie Eilish bad guy official audio", "slug": "bad-guy"},
    {"query": "ytsearch1:Ed Sheeran Shape of You official audio", "slug": "shape-of-you"},
    {"query": "ytsearch1:Dua Lipa Don't Start Now official audio", "slug": "dont-start-now"}
]

ydl_opts_base = {
    'format': 'ba/b',
    'ffmpeg_location': ffmpeg_path,
    'postprocessors': [{
        'key': 'FFmpegExtractAudio',
        'preferredcodec': 'mp3',
        'preferredquality': '192',
    }],
    'extractor_args': {'youtube': {'player_client': ['android', 'web']}},
    'js_runtimes': {'node': {}},
    'noplaylist': True,
    'quiet': False,
    'no_warnings': True,
}

print(f"Starting full song downloads using ffmpeg: {ffmpeg_path}...")
for i, item in enumerate(songs, 1):
    dest_path = os.path.join(output_dir, f"{item['slug']}.mp3")
    if os.path.exists(dest_path) and os.path.getsize(dest_path) > 1500000:
        print(f"[{i}/{len(songs)}] Already downloaded: {item['slug']} ({os.path.getsize(dest_path)} bytes)")
        continue
    
    print(f"[{i}/{len(songs)}] Downloading full track: {item['slug']}...")
    opts = dict(ydl_opts_base)
    opts['outtmpl'] = os.path.join(output_dir, f"{item['slug']}.%(ext)s")
    try:
        with yt_dlp.YoutubeDL(opts) as ydl:
            ydl.download([item['query']])
        print(f"Finished {item['slug']}: size = {os.path.getsize(dest_path)} bytes")
    except Exception as e:
        print(f"Error downloading {item['slug']}: {e}")

print("All full songs downloaded successfully!")
