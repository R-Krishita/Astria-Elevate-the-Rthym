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

// function to get songs (we are doing this bcz it is client side scripting. when we do backend coding we take data using api)

async function getSongs(){
    let a =await fetch("http://127.0.0.1:3000/songs/")
    let response =await a.text();
    // console.log(response)
    let element = document.createElement("div")
    element.innerHTML  = response;
    let anchor = element.getElementsByTagName("a")
    console.log(anchor)
    let songs = []
    for (let index = 0; index < anchor.length; index++) {
        const element = anchor[index];
            if(element.href.endsWith(".mp3")){
                songs.push(element.href)
        }
    }
    return songs
}


async function main(){
    let songs = await getSongs()
    console.log(songs)

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    // songUL.innerHTML = ""
    for (const song of songs) {
        let songName = song.split("/").pop().replaceAll("%20"," ").replaceAll(".mp3","");
        songUL.innerHTML = songUL.innerHTML + `<li>${songName}</li>`;
    }

    // play the song only when the user clicks play button
    var audio = new Audio(songs[0]);
    document.getElementById("play").addEventListener("click",function() {
        audio.play().catch(function(error){
            console.log("Error occured while playing the song!",error);
        });
    });

    // pause the song only when the user clicks pause button

    // document.getElementById("pause").addEventListener("click",function(){
    //     audio.pause();
    // })

    audio.addEventListener("loadeddata",() => {
        console.log(audio.duration, audio.currentSrc,audio.currentTime)
    });

    }

main()

