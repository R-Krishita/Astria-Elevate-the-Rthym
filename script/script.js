// function scrollLeft() {
//     const container = document.querySelector('.scroll-content');
//     container.scrollBy({
//         top: 0,
//         left: -100, // Adjust the value for scroll distance
//         behavior: 'smooth'
//     });
// }

// function scrollRight() {
//     const container = document.querySelector('.scroll-content');
//     container.scrollBy({
//         top: 0,
//         left: 100, // Adjust the value for scroll distance
//         behavior: 'smooth'
//     });
// }

let currentSong = new Audio()



// function to get songs (we are doing this bcz it is client side scripting. when we do backend coding we take data using api)

async function getSongs(){
    let a =await fetch("http://127.0.0.1:3000/songs/")
    let response =await a.text();
    // console.log(response)
    let element = document.createElement("div")
    element.innerHTML  = response;
    let anchor = element.getElementsByTagName("a")
    // console.log(anchor)
    let songs = []
    for (let index = 0; index < anchor.length; index++) {
        const element = anchor[index];
            if(element.href.endsWith(".mp3")){
                songs.push(element.href)
        }
    }
    return songs
}

//function to get artists

async function getArtists(){
    let a = await fetch("http://127.0.0.1:3000/artists/songArtist.txt");
    let response = await a.text();

    //map = creates a new array with the trimmed strings
    //filter = creates a new array that includes elements whose length is greater than zero.
    let artists = response.split("\n").map(artists => artists.trim()).filter(artists => artists.length > 0)
    return artists
}


// function to play music
const playMusic = (track,artist, pause = true) => {
    currentSong.src = "/songs/" + track
    if(!pause){
        currentSong.play()
    }
    play.src = "/svg/pause.svg"
    document.querySelector(".playbar-info").innerHTML = `${track.replaceAll("%20"," ").replaceAll(".mp3","")}<br> ${artist}`;
    document.querySelector(".songTime").innerHTML = currentSong.duration
}


//function to convert seconds to "minutes : seconds" format
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// main function
async function main(){

    let songs = await getSongs()
    
    let artists = await getArtists()
    
    let first_song = songs[0].split("/").pop().replaceAll("%20"," ").replaceAll(".mp3","")
    playMusic(first_song, artists[0], false)

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    // songUL.innerHTML = ""

    let artistUL = document.querySelector(".songList").getElementsByTagName("ul")[1]
    console.log(artistUL)
    for (i=0; i<songs.length; i++) {
        let song = songs[i];
        let artist = artists[i] || "Unknown Artist";
        let songName = song.split("/").pop().replaceAll("%20"," ").replaceAll(".mp3","");
        songUL.innerHTML = songUL.innerHTML + `<li class = "grid">
                        <img src="svg/music.svg" alt="img" width ="45px" height = "45px" class = "invert">
                        <div class="musicInfo">
                            <div>${songName}</div>
                            <div>${artist}</div>
                        </div>
                        
                        <div class="playnow">
                            <img src="svg/playgreen.svg" alt="img" class = "invert" height = "25px" width = "25px">
                        </div>
                    </li>`;
    }

    //set the initial song duration to zero
    document.querySelector(".songTime").innerHTML = "0:00 : 0:00";

    // attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click",()=>{
            console.log(e.querySelector("div").firstElementChild.innerHTML)    //selects the first div element of the li element in songlist = track name
            console.log(e.querySelector("div").lastElementChild.innerHTML)    //selects the last div element of the li element in songlist = artist name
            playMusic(e.querySelector("div").firstElementChild.innerHTML + ".mp3",e.querySelector("div").lastElementChild.innerHTML, false)
        });
    });





    // attach event listener to play button
    play.addEventListener("click", () => {
        if(currentSong.paused){
            currentSong.play()
            play.src = "/svg/pause.svg";
        }
        else{
            currentSong.pause()
            play.src = "/svg/play.svg";
        }
    })


    //attach event listener to update time
    currentSong.addEventListener("timeupdate",()=>{
        let currentTime = currentSong.currentTime;
        let duration = currentSong.duration;
        console.log(currentTime, duration);
        document.querySelector(".songTime").innerHTML = (isNaN(currentTime) || isNaN(duration)) ? "0:00 : 0:00" : formatTime(currentTime) + " : " + formatTime(duration);
        document.querySelector(".seekbar-fill").style.width = (currentTime / duration) * 100 + "%";
        document.querySelector(".circle").style.left = (currentTime / duration) * 100 + "%";

    })


    //attach an eventlistener to seekbar
    document.querySelector(".seekbar").addEventListener("click",(e)=>{
        let duration = currentSong.duration;
        let seekbar = document.querySelector(".seekbar");
        let rect = seekbar.getBoundingClientRect();
        let offsetX = e.clientX - rect.left;
        let seekTime = (offsetX / rect.width) * duration;
        currentSong.currentTime = seekTime;
    })



    //attach an event listener to next button
    next.addEventListener("click",() => {
        currentSong.pause()
        let nextIndex = songs.indexOf(currentSong.src) + 1;

        // debugging console.log statements
        // console.log("nextIndex = " + nextIndex)
        // console.log("songs.length = " + songs.length)
        // console.log("song split = " + songs[nextIndex].split("/songs/"))

        if(nextIndex >= songs.length ){
            nextIndex = 0;
            playMusic(songs[nextIndex].split("/songs/").pop(), artists[nextIndex], false);
            // console.log("if statement nextIndex = " + songs.length - 1)
        }else {
            playMusic(songs[nextIndex].split("/songs/").pop(), artists[nextIndex], false);
        }
    });


    //attach an event listener to previous button
    previous.addEventListener("click", () => {
        currentSong.pause();
        let currentIndex = songs.indexOf(currentSong.src);
        let previousIndex = currentIndex - 1;

        // debugging console.log statements
        // console.log("currentIndex = " + currentIndex)
        // console.log("previousIndex = " + previousIndex)
        // console.log("songs[previousIndex] = " + songs[previousIndex])
    
        if (previousIndex < 0) {
            previousIndex = 0;
            playMusic(songs[previousIndex].split("/songs/").pop(), artists[previousIndex], false);
        } else{
            playMusic(songs[previousIndex].split("/songs/").pop(), artists[previousIndex], false);
        }
    });


    //attach an event listener to hamburger-right
    document.getElementById("ham-right").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    //attach event listener to close button on left container
    document.getElementById("cross").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%";
    });

    //attach event listener to search button
    let isSearchBarOpen = false;
    document.getElementById("search-icon").addEventListener("click", () => {
        if (isSearchBarOpen) {
            document.querySelector(".searchbar").style.display = "none";
            document.querySelector(".search").style.width = "0";
            document.querySelector(".pfp").style.display = "block";
            document.querySelector(".pfp").style.left = "20vw";
        } else {
            document.querySelector(".searchbar").style.display = "block";
            document.querySelector(".search").style.width = "55vw";
            document.querySelector(".pfp").style.display = "none";
        }
        isSearchBarOpen = !isSearchBarOpen;
    });


    //attach event listener to volume button
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("click", (e) => {

        // debug console.log statements
        // console.log(document.querySelector(".playbar-right>img"))
        // console.log("Setting volume to", e.target.value, "/ 100")
        currentSong.volume = parseInt(e.target.value) / 100
        let volumeIcon = document.querySelector(".playbar-right>img");
        if (currentSong.volume === 0) {
            volumeIcon.src = "svg/volume-mute.svg";
        } else if (currentSong.volume > 0 && currentSong.volume <= 0.5) {
            volumeIcon.src = "svg/volume-low.svg";
        } else {
            volumeIcon.src = "svg/volume-high.svg";
        }
        });

        //attach an event listener to control volume 
        document.querySelector(".playbar-right>img").addEventListener("click", e=>{ 
            if(e.target.src.includes("svg/volume-high.svg")){
                e.target.src = e.target.src.replace("svg/volume-high.svg", "svg/volume-mute.svg")
                currentSong.volume = 0;
                document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
            }
            else if(e.target.src.includes("svg/volume-low.svg")){
                e.target.src = e.target.src.replace("svg/volume-low.svg", "svg/volume-mute.svg")
                currentSong.volume = 0.1;
                document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
            }
    
        })
}
main()

