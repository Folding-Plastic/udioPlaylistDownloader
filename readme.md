# Udio Playlist Downloader Extension

<div style="display: flex; justify-content: space-between;">
    <img src="https://github.com/Folding-Plastic/udioPlaylistDownloader/blob/main/images/udio-download-button.jpg"
         alt="download-playlist-button" 
         style="width: 48%; height: auto;" />
</div>

## Features
- Adds a "Download Playlist" button to Udio.com playlist pages
- Downloads all songs in a playlist with a single click
- Works on desktop and mobile devices
- Backups your music in bulk with ease
- Can download massive playlists (tested up to 94 songs, 800mb output)
- Embeds song artwork, creator name, and lyrics into the metadata

## Usage
1. Navigate to a playlist on Udio.com
2. Look for the "Download Playlist" button next to the play button. Refresh the page if it doesn't appear within 10s.
3. Click the button to start downloading all songs
4. A zip file containing mp3 copies of the playlist songs will download (may take 15-30s depending on device)

## Installation
Desktop:
1. Clone this repository or download [the zip file](https://github.com/Folding-Plastic/udioPlaylistDownloader/archive/refs/heads/main.zip) and unpack it

For Chrome (Recommended)
1. Open browser and go to `chrome://extensions/`
2. Click "Load Unpacked"
3. Navigate to the folder of the cloned repository
4. Click "Select Folder"

<div style="display: flex; justify-content: space-between; margin-top: 20px;">
    <img src="https://github.com/Folding-Plastic/udioPlaylistDownloader/blob/main/images/chrome-extension-image.png"
         alt="chrome-extension-example" 
         style="width: 30%; height: auto;" />
</div>

For Firefox
1. Open browser and go to `about:debugging`
2. Click "This Firefox"
3. Click "Load Temporary Add-on"
4. Select the `manifest.json` file in the repo folder

<div style="display: flex; justify-content: space-between; margin-top: 20px;">
    <img src="https://github.com/Folding-Plastic/udioPlaylistDownloader/blob/main/images/firefox-extension-image.png"
         alt="firefox-extension-example" 
         style="width: 50%; height: auto;" />
</div>

Mobile (Kiwi browser recommended)
1. Download the zip file of this repo.
2. Open the broswer and go to `kiwi://extensions/`
3. Click "+ (from .zip/.crx/.user.js)"
4. Select the zip file

<div style="display: flex; justify-content: space-between; margin-top: 20px;">
    <img src="https://github.com/Folding-Plastic/udioPlaylistDownloader/blob/main/images/kiwi-extension-image.jpg"
         alt="kiwi-extension-example" 
         style="width: 30%; height: auto;" />
</div>

## Important Notes
⚠️ **LEGAL DISCLAIMER**:
- Only download content you have the rights to
- Respect copyright and intellectual property laws
- This extension is for personal use only

## Limitations
- Depends on Udio.com's current page structure
- May break if website design changes
- Mp3 downloads only, no wavs or stems

## Troubleshooting
- Refresh the page if the button doesn't appear after 10 seconds
- Check browser console for error messages
- Ensure you're on a valid Udio.com playlist page

## Development
- Requires Firefox or Chromium-based browser that allows extensions
- Uses WebExtensions API
- Manifest V2 compatible

## Future Improvements
- Pull requests welcome
