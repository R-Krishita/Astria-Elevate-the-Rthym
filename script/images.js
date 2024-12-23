async function getImage(){
    let a = await fetch ("http://127.0.0.1:3000/album-covers/")
    let img = await a.json();
    console.log(img)
    images.forEach(image => {
        console.log(`http://127.0.0.1:3000/album-covers/${image}`);
    });
}

async function main(){
    let image = await getImage();
    console.log(image)
}