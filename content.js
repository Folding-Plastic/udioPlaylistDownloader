// content.js
console.log("Content.js loading...");
let downloadButton = null; // Track the button element
let downloadReady = false;

function monitorForSongIds() {
    console.log("Starting continuous monitoring for songId URLs...");

    const checkedUrls = new Set(); // Keep track of already processed URLs
    let combinedData = {}; // Object to store combined responses

    // Periodically check for new entries
    setInterval(() => {
        const entries = performance.getEntriesByType("resource");

        // Find new playlist URLs
        entries
            .filter(entry => entry.name.includes("/api/songs?songIds=") && !checkedUrls.has(entry.name))
            .forEach(entry => {
                console.log("Found new playlist URL:", entry.name);
                checkedUrls.add(entry.name); // Mark the URL as processed

                // Fetch the playlist data
                fetch(entry.name)
                    .then(response => response.json())
                    .then(data => {
                        console.log("Fetched playlist data:", data);

                        // Combine responses
                        combinedData = combineResponses(combinedData, data);

                        // Send the combined data to the background script
                        chrome.runtime.sendMessage({ action: "store_playlist_data", data: combinedData }, (response) => {
                            console.log("Response from background script:", response);
                            downloadReady = true;
                            addDownloadButton(downloadReady);
                        });
                    })
                    .catch(error => {
                        console.error("Error fetching playlist data:", error);
                    });
            });
    }, 5000); // Check every 5 seconds
}

// Combine responses into one object
function combineResponses(existingData, newData) {
    for (const key in newData) {
        if (Array.isArray(newData[key])) {
            existingData[key] = (existingData[key] || []).concat(newData[key]);
        } else {
            existingData[key] = newData[key];
        }
    }
    return existingData;
}




// Inject the "Download Playlist" button on page load
window.addEventListener("load", () => {
     monitorForSongIds(); // Start monitoring for new songId URLs
     addDownloadButton(downloadReady);
     
});

function addDownloadButton(downloadState) {
    // Check if the button already exists
    if (document.getElementById("udio-download-btn")) {
        document.getElementById("udio-download-btn").remove();
} else {}


    // Create a button
    const downloadButton = document.createElement("button");
    downloadButton.id = "udio-download-btn";
    
    downloadButton.style.marginLeft = "15px"; // More horizontal spacing
    downloadButton.style.padding = "8px 16px";
    if (downloadState == true) {
    downloadButton.textContent = "Download Playlist";
    downloadButton.style.backgroundColor = "#e30b5d"; // Updated button color to match UI
    downloadButton.style.color = "white";
    } else {
    downloadButton.textContent = "Retry Download";
    downloadButton.style.backgroundColor = "#b6094a"; // Updated button color to match UI
    downloadButton.style.color = "#cf7897";
}
    downloadButton.style.border = "none";
    downloadButton.style.borderRadius = "5px";
    downloadButton.style.cursor = "pointer";
    downloadButton.style.fontSize = "14px";
    downloadButton.style.display = "inline-block"; // Keep it inline with the existing button
    downloadButton.style.verticalAlign = "middle"; // Align vertically with the existing button
    
// Hover effects
    if (downloadState == true) {
    downloadButton.addEventListener("mouseover", () => {
        downloadButton.style.backgroundColor = "#b5084a"; // Lighter pink on hover
        downloadButton.style.transform = "scale(1.05)"; // Slight scale effect
    });

    downloadButton.addEventListener("mouseout", () => {
        downloadButton.style.backgroundColor = "#e30b5d"; // Original color
        downloadButton.style.transform = "scale(1)"; // Reset scale
    });

    // Add the click event handler
    downloadButton.addEventListener("click", () => {
    	downloadButton.textContent = "Downloading";
    	downloadButton.style.backgroundColor = "#b6094a";
    	downloadButton.style.color = "white";
        const pageTitle = document.title; // Get the current page title
        console.log("Sending message to background script to download playlist with title:", pageTitle);

        chrome.runtime.sendMessage(
            { action: "download_playlist", pageTitle: pageTitle },
            (response) => {
                if (chrome.runtime.lastError) {
                    console.error("Error sending message:", chrome.runtime.lastError.message);
                } else {
                    console.log("Response from background script:", response);
                }
                downloadButton.textContent = "Download Playlist";
                downloadButton.style.backgroundColor = "#e30b5d"; 
                downloadButton.style.color = "white";
            }
        );
    });
} else{}
    // Locate the target element
    const targetElement = document.querySelector(
        'div.duration-200.ease-in-out.hover\\:scale-110'
    );
    if (targetElement) {
        // Insert the button to the right of the play button
        targetElement.parentElement.style.display = "flex"; // Ensure buttons align horizontally
        targetElement.parentElement.style.alignItems = "center"; // Align them vertically
        targetElement.parentElement.appendChild(downloadButton);
        console.log("Download button injected next to target element.");
    } else {
        console.error("Target element not found. Cannot inject download button.");
    }
}

// Monitor URL changes and inject the button on matching pages
let lastUrl = window.location.href;
setInterval(() => {
    if (window.location.href !== lastUrl) {
        lastUrl = window.location.href;
        if (window.location.href.startsWith("https://www.udio.com/playlists/")) {
            addDownloadButton();
        } else {
            const existingButton = document.getElementById("udio-download-btn");
            if (existingButton) {
                existingButton.remove();
                console.log("Download button removed.");
            }
        }
    }
}, 1000); // Check every second