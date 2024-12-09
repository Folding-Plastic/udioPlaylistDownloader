# Udio Playlist Downloader Extension

## Features
- Adds a "Download Playlist" button to Udio.com playlist pages
- Downloads all songs in a playlist with a single click
- Embeds song artwork, creator name, and lyrics into the metadata
- Works on desktop and mobile devices

## Installation
Desktop:
1. Clone this repository

For Chrome (Recommended)
2. Open browser and go to `chrome://extensions/`
3. Click "Load Unpacked"
4. Navigate to the folder of the cloned repository
5. Click "Select Folder"

For Firefox
2. Open browser and go to `about:debugging`
3. Click "This Firefox"
4. Click "Load Temporary Add-on"
5. Select the `manifest.json` file

Mobile (Kiwi browser recommended)
1. Download the zip file of this repo.
2. Open the broswer and go to `kiwi://extensions/`
3. Click "+ (from .zip/.crx/.user.js)"
4. Select the zip file 

## Usage
1. Navigate to a playlist on Udio.com
2. Look for the "Download Playlist" button next to the play button. Refresh the page if it doesn't appear within 10s.
3. Click the button to start downloading all songs
4. A zip file containing mp3 copies of the playlist songs will download (may take 15-30s depending on device)

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
