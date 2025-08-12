  
const videoPlayers = document.querySelectorAll(".videoPlayer");
const buttonLikes = document.querySelectorAll(".like");
const uploadButton = document.getElementById("uploader-button");
const videoInput = document.getElementById("video-uploader");

// Select the search input field
const searchInput = document.getElementById("searchInput");

// Add an event listener for the search input
searchInput.addEventListener("input", (event) => {
  const query = event.target.value.toLowerCase().trim(); // Get the search query

  // Call the filter function with the query
  filterVideos(query);
});

// Function to filter videos based on the search query
function filterVideos(query) {
  mainVideoDivs.forEach((div, index) => {
    const videoContainer = videoContainers[index];

    // Check if video container or title exists
    if (videoContainer) {
      const videoTitle = div.getAttribute("data-title") || ""; // Assuming data-title contains video titles
      const matchesQuery = videoTitle.toLowerCase().includes(query);

      // Show or hide the video div based on the query match
      if (matchesQuery) {
        div.style.display = "flex"; // Show matching video div
      } else {
        div.style.display = "none"; // Hide non-matching video div
      }
    }
  });
}

const logoutButton = document.getElementById("logout-button");

logoutButton.addEventListener("click", () => {
  const confirmLogout = confirm("Are you sure you want to logout?");
  if (confirmLogout) {
    // Clear session storage or local storage
    sessionStorage.clear();
    localStorage.clear();

    // Redirect to the login page
    window.location.href = "login.html"; // Replace with the actual path to your login page
  }
});


// PLAY AND PAUSE
videoPlayers.forEach((videoPlayer) => {
  videoPlayer.addEventListener("click", () => {
    if (videoPlayer.paused == false) {
      videoPlayer.pause();
      videoPlayer.nextElementSibling.classList.add("show");
    } else {
      videoPlayer.play();
      videoPlayer.nextElementSibling.classList.remove("show");
    }
  });
});

// LIKES
buttonLikes.forEach((like) => {
  like.addEventListener("click", () => {
    like.classList.toggle("love");
  });
});

// Video and container references
const videoContainers = [
  document.getElementById("video1"),
  document.getElementById("video2"),
  document.getElementById("video3"),
  document.getElementById("video4"),
  document.getElementById("video5"),
];

const mainVideoDivs = [
  document.getElementById("mainVideoDiv1"),
  document.getElementById("mainVideoDiv2"),
  document.getElementById("mainVideoDiv3"),
  document.getElementById("mainVideoDiv4"),
  document.getElementById("mainVideoDiv5"),
];

// Initially set all sections to be hidden (CSS: display: none)
mainVideoDivs.forEach((div) => {
  div.style.display = "none";
});

async function fetchVideos() {
  try {
    const response = await fetch(
      "http://127.0.0.1:5000/videos/upload"
    );
  
  

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json(); // The response object with a "videos" key
    console.log(data); // Debugging the response

    // Check if the "videos" array exists and has at least one video
    if (!data.videos || data.videos.length === 0) {
      throw new Error("No videos found in the response.");
    }

    // Iterate through the videos and update their respective containers
    data.videos.forEach((video, index) => {
      if (
        video &&
        video.video_url &&
        mainVideoDivs[index] &&
        videoContainers[index]
      ) {
        mainVideoDivs[index].style.display = "flex"; // Show the div
        videoContainers[index].src = video.video_url; // Set the video URL
      }
    });
  } catch (error) {
    console.error("Error fetching videos:", error.message);
  }
}

fetchVideos();

// uploadButton.addEventListener("click", () => {
//   // Trigger the file input dialog
//   videoInput.click();
// });

// videoInput.addEventListener("change", async (event) => {
//   const file = event.target.files[0];

//   if (!file) {
//     alert("No file selected.");
//     return;
//   }

//   // Create a FormData object to send the video file
//   const formData = new FormData();
//   formData.append("file", file);
//   formData.append("title", "Sample Video");
//   formData.append("uploaded_by", "Creator");

//   try {
//     const response = await fetch(
//       "http://127.0.0.1:5000/videos/upload",
//       {
//         method: "POST",
//         body: formData,
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     const result = await response.json();
//     alert("Video uploaded successfully!");
//     console.log("Upload result:", result);
//   } catch (error) {
//     console.error("Error uploading video:", error.message);
//     alert("Failed to upload video.");
//   }
// });

async function addComment(videoId) {
  const inputField = document.getElementById(`comment-input`);
  const commentText = inputField.value.trim();

  if (!commentText) {
    alert("Comment cannot be empty!");
    return;
  }

  try {
    const response = await fetch(
      "http://127.0.0.1:5000/comments/upload",
      
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          video_id: videoId,
          user: "Anonymous", // Replace with actual user data if available
          comment: commentText,
        }),
      }
    );

    if (response.ok) {
      alert("Comment uploaded Successfully");
    }

    if (!response.ok) {
      throw new Error(`Error posting comment: ${response.status}`);
    }

    // Clear input field and refresh comments
    inputField.value = "";
    // fetchComments(videoId);
  } catch (error) {
    console.error(error);
    alert("Failed to add comment. Please try again later.");
  }
}

const popup = document.getElementById("comment-popup");
const commentInput = document.getElementById("comment-input");

function openCommentPopup() {
  popup.classList.remove("hidden");
}

function closeCommentPopup() {
  popup.classList.add("hidden");
}

function postComment() {
  const commentText = commentInput.value.trim();
  if (!commentText) {
    alert("Comment cannot be empty!");
    return;
  }
  console.log("Comment Posted:", commentText); // Replace with API call
  commentInput.value = ""; // Clear the input field
  closeCommentPopup();
  addComment("aknq3riqhriq3"); // Close the popup
  alert("Comment posted successfully!");
}
