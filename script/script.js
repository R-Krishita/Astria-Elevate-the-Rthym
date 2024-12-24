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
    let artists = response.split("\n").map(artists => artists.trim()).filter(artists => artists.length > 0)
    return artists
}


// function to play music
const playMusic = (track,artist) => {
    currentSong.src = "/songs/" + track
    currentSong.play()
    play.src = "/svg/pause.svg"
    document.querySelector(".playbar-info").innerHTML = `${track.replaceAll("%20"," ").replaceAll(".mp3","")}<br> ${artist}`;
    document.querySelector(".songTime").innerHTML = "00:00"
}


async function main(){
    let songs = await getSongs()

    let artists = await getArtists()

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
                            <img src="svg/playgreen.svg" alt="img" class = "invert" height = "35px" width = "35px">
                        </div>
                    </li>`;
    }

    // attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click",()=>{
            console.log(e.querySelector("div").firstElementChild.innerHTML)    //selects the first div element of the li element in songlist = track name
            console.log(e.querySelector("div").lastElementChild.innerHTML)    //selects the last div element of the li element in songlist = artist name
            playMusic(e.querySelector("div").firstElementChild.innerHTML + ".mp3",e.querySelector("div").lastElementChild.innerHTML)
        });
    });

    // attach event listener to previous,play and next button
    play.addEventListener("click", () => {
        if(currentSong.paused){
            currentSong.play()
            play.src = "/svg/pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "/svg/play.svg"
        }
    })
}
main()

