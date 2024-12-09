let playlistData = null; // Cache the fetched playlist data

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "store_playlist_data") {
        console.log("Received playlist data from content script:", message.data);
        playlistData = message.data; // Cache the playlist data
        sendResponse({ status: "success", message: "Playlist data stored." });
    }

    if (message.action === "download_playlist") {
        console.log("Download playlist message received.");
        console.log(message.pageTitle);
        const zipFilename = `${sanitizeFilename(message.pageTitle || udio_songs)}.zip`;
        console.log("Download playlist message received. ZIP filename:", zipFilename);

        (async () => {
            try {
                // Ensure we have cached data
                if (!playlistData) {
                    throw new Error("No playlist data has been stored yet.");
                }
                console.log("Using cached playlist data:", playlistData);

                // Proceed with creating and downloading the ZIP
                await createAndDownloadZip(playlistData, message.pageTitle, zipFilename);
                sendResponse({ status: "success", message: "Download started successfully." });
            } catch (error) {
                console.error("Error during playlist download process:", error);
                sendResponse({ status: "error", message: "Failed to download playlist." });
            }
        })();

        return true; // Keep the message channel open for async response
    }
});

// Sanitize the filename (remove invalid characters)
function sanitizeFilename(filename) {
    // Replace illegal characters with safe equivalents
    return filename
        .replace(/\\/g, '-') // Backslash
        .replace(/\//g, '-') // Forward slash
        .replace(/:/g, '-') // Colon
        .replace(/\*/g, '-') // Asterisk
        .replace(/\?/g, '？') // Question mark (full-width)
        .replace(/"/g, "'") // Double quotes
        .replace(/\[/g, '(') // Left square bracket
        .replace(/\]/g, ')') // Right square bracket
        .replace(/\{/g, '(') // Left curly brace
        .replace(/\}/g, ')') // Right curly brace
        .replace(/</g, '(') // Less than
        .replace(/>/g, ')') // Greater than
        .replace(/\|/g, '-') // Vertical bar
        .trim(); // Remove leading and trailing spaces
}
function getAlbumTitle(pageTitle, artist) {
    // Ensure case-insensitivity for artist
    const lowerPageTitle = pageTitle.toLowerCase();
    const lowerArtist = artist.toLowerCase();

    // Look for " by {artist} | Udio"
    const index = lowerPageTitle.indexOf(" by " + lowerArtist + " | udio");
    if (index !== -1) {
        return pageTitle.substring(0, index).trim(); // Extract before " by "
    }

    // If " by {artist} | Udio" not found, return the full pageTitle trimmed
    return pageTitle.trim();
}
async function createAndDownloadZip(data, pageTitle, zipFilename) {
    console.log("Starting ZIP creation...");
    const zip = new JSZip();
    const folder = zip.folder(zipFilename);
    console.log("ZIP folder created.");
    
    const songs = data.songs
        .filter(song => song.song_path && song.title && song.artist && song.created_at && song.image_path ) 
                .map((song, index) => ({
            path: song.song_path,
            title: sanitizeFilename(song.title),
            artist: song.artist,
            album: getAlbumTitle(pageTitle, song.artist),
            genre: song.tags.filter(tag => tag.trim() !== "").join(", "),
            created_at: song.created_at,
            image_path: song.image_path,
            lyrics: song.lyrics && song.lyrics.trim() !== "" ? song.lyrics : "No lyrics available", // Fallback for empty lyrics
            trackNumber: index + 1 // Sanitize titles for safe filenames
        }));
console.log("Processed songs:", songs);
    for (const { path, title, artist, album, genre, created_at, image_path, lyrics, trackNumber } of songs) {
        
            console.log(`Fetching song: ${path}`);
            const response = await fetch(path);
            const arrayBuffer = await response.arrayBuffer();

            // Update the metadata (title) of the MP3 file
            let writer; // Declare writer in the broader function scope

    try {
        // Initialize writer
        writer = new ID3Writer(new Uint8Array(arrayBuffer));
        writer.setFrame('TIT2', title); // Set the title
        console.log(title);
        writer.setFrame('TPE1', [artist]);
        console.log([artist]);
        writer.setFrame('TALB', album);
        console.log(album);
        writer.setFrame('TXXX', {
            description: "Recording Date",
            value: created_at // Full date as a string
        });
        writer.setFrame('TCON', [genre]);
        console.log([genre]);
        writer.setFrame('COMM', {
            language: 'eng', // Language code
            description: 'Production Credits', // Description of the comment
            text: 'In collaboration with Udio.com' // The comment text
            });
        const response = await fetch(image_path);
        const imageBuffer = new Uint8Array(await response.arrayBuffer());
            
        writer.setFrame('APIC', {
                type: 3, // Cover (front)
                data: imageBuffer, // Album cover image
                description: 'Song Art', // Optional
                useUnicodeEncoding: true // Optional
            });
            writer.setFrame('USLT', {
                language: "eng", // Language
                description: "", // Short description
                lyrics: lyrics // The actual lyrics text
            });
        writer.setFrame('TRCK', `${trackNumber}`);
        writer.addTag();
        console.log("Metadata updated successfully.");

        // Get the updated MP3 file as a Blob
        const updatedBlob = writer.getBlob();
        console.log("Got blob");

        // Use the song title as the file name
        const sanitizedTitle = sanitizeFilename(title);
        const fileName = `${sanitizedTitle}.mp3`;
        folder.file(fileName, updatedBlob);
        console.log(`Added ${fileName} to ZIP with updated metadata.`);
    } catch (error) {
        console.error("Error processing metadata or adding to ZIP:", error);
    }
    }

    // Generate ZIP as a Blob
    console.log("Generating ZIP file...");
    const zipBlob = await zip.generateAsync({ type: "blob" });

    // Prompt the user to save the file
    const zipUrl = URL.createObjectURL(zipBlob);
    console.log("Prompting user to save file...");

    chrome.downloads.download(
        {
            url: zipUrl,
            filename: zipFilename,
            saveAs: true // Ask the user where to save the file
        },
        (downloadId) => {
            if (chrome.runtime.lastError) {
                console.error("Error starting download:", chrome.runtime.lastError.message);
            } else {
                console.log("Download started successfully with ID:", downloadId);
            }
        }
    );
}