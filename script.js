console.log("Lets start working on Javascript");
let currentSong = new Audio();
let songs;
let currentFolder;

function renderSongList(songs) {
  let songUL = document.querySelector(".songlist ul");
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML += `<li>
      <img class="invert" src="media-player-music-music-symbol.svg" alt=""/>
      <div class="info">
        <div>${decodeURIComponent(song.split("%5C").pop())}</div>
        <div>Song Artist</div>
      </div>
      <div class="playnow">
        <span>Play Now</span>
        <img class="invert" src="media-player-ui-button-play.svg" alt=""/>
      </div>
    </li>`;
  }

  // Re-attach click listeners
  Array.from(document.querySelectorAll(".songlist li")).forEach((e, i) => {
    e.addEventListener("click", () => {
      playMusic(songs[i]);
    });
  });
}

function formatTime(seconds) {
  // Ensure we are working with a positive number
  let totalSeconds = Math.floor(seconds);
  let minutes = Math.floor(totalSeconds / 60);
  let remainingSeconds = totalSeconds % 60;
  let formattedSeconds = remainingSeconds.toString().padStart(2, "0");
  return `${minutes}:${formattedSeconds}`;
}
async function getSongs(folder) {
  let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href);
    }
  }
  return songs;
}

const playMusic = (track, pause = false) => {
  currentSong.src = track;
  if (!pause) {
    currentSong.play();
  }
  play.src = "img/pause.svg";
  document.querySelector(".songinfo").innerHTML = decodeURIComponent(
    track.split("%5C").pop(),
  );
  document.querySelector(".songtime").innerHTML = "00:00/00:00";
};

// async function displayAlbums(folder) {
//   let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/`);
//   let response = await a.text();
//   let div = document.createElement("div");
//   div.innerHTML = response;
//   // let c = decodeURIComponent(track.split("%5C"));
//   // console.log(c);

//   let b = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
//   let res = await b.json();
//   let cardContainer = document.querySelector(".cardContainer");
//   console.log(res);
//   cardContainer.innerHTML =
//     cardContainer.innerHTML +
//     `<div data-folder="dude" class="card">
//               <div class="play">
//                 <svg
//                   width="48"
//                   height="48"
//                   viewBox="0 0 48 48"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <circle cx="24" cy="24" r="24" fill="#1fdf64" />
//                   <path d="M32.5 24.0001L19 32V16L32.5 24.0001Z" fill="black" />
//                 </svg>
//               </div>
//               <img src="dude.jpg" alt="FINDING-HERE-IMG" />
//               <h2>${res.title}</h2>
//               <p>${res.description}
//               </p>
//             </div>`;
//   // let res = await a.json();
//   // console.log(res);
//   // let anchors = div.getElementsByTagName("a");
//   // // let folder = [];
//   // Array.from(anchors).forEach((e) => {
//   //   console.log(e.href);
//   // });
// }

async function main() {
  currentFolder = "dude";
  songs = await getSongs(currentFolder);
  playMusic(songs[0], true);
  renderSongList(songs);

  // DISPLAY ALL THE ALBUMS ON THE PAGE
  // displayAlbums(currentFolder);

  // ATTACH AN EVENT LISTENER TO PLAY, NEXT AND PREVIOUS
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "img/pause.svg";
    } else {
      currentSong.pause();
      play.src = "img/media-player-ui-button-play.svg";
    }
  });

  // LISTEN FOR TIMEUPDATE EVENT
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML =
      `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  // ADD AN EVENT LISTENER TO MOVE THE SEEKBAR CIRCLE
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });
}

// ADD AN EVENT LISTENER FOR HAMBURGER
document.querySelector(".hamburger").addEventListener("click", () => {
  document.querySelector(".left").style.left = "0%";
});
document.querySelector(".cross").addEventListener("click", () => {
  document.querySelector(".left").style.left = "-120%";
});
// ADD AN EVENT LISTENER TO PREVIOUS AND NEXT
previous.addEventListener("click", () => {
  let index = songs.indexOf(currentSong.src);
  if (index - 1 > 0) {
    playMusic(songs[index - 1]);
  }
});

next.addEventListener("click", () => {
  let index = songs.indexOf(currentSong.src);
  if (index + 1 < songs.length) {
    playMusic(songs[index + 1]);
  }
});

// ADD AN EVENT TO VOLUME
document
  .querySelector(".range")
  .getElementsByTagName("input")[0]
  .addEventListener("change", (e) => {
    // console.log(e, e.target.value);
    currentSong.volume = parseInt(e.target.value) / 100;
  });

//ADD AN EVENT TO PLAY THE ALBUM
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("click", async () => {
    currentFolder = card.dataset.folder;
    songs = await getSongs(currentFolder);
    playMusic(songs[0]);
    renderSongList(songs);
  });
});

//ADD EVENT TO MUTE THE TRACK
document.querySelector(".volume img").addEventListener("click", (e) => {
  console.log(e.target.src);
  if (e.target.src.includes("volume-icon.svg")) {
    e.target.src = "img/mute.svg";
    currentSong.volume = 0;
    document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
  } else {
    e.target.src = "img/volume-icon.svg";
    currentSong.volume = 0.1;
    document.querySelector(".range").getElementsByTagName("input")[0].value =
      10;
  }
});
main();
