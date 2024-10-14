var userName = "";

document.querySelector(".modal-input-name .btn-submit").addEventListener("click", () => {
    if(document.querySelector(".modal-input-name input").value.length < 3){
        return;
    }
    userName = document.querySelector(".modal-input-name input").value;
    document.querySelector("header.header > h1").innerText = "Bienvenue, " + userName;
    document.querySelector(".modal-input-name").classList.remove("active");
});

document.querySelector(".new-btn").addEventListener("click", () => {
    document.querySelector(".modal-input-post").classList.add("active");
});

document.querySelector(".modal-input-post").addEventListener("click", () => {
    document.querySelector(".modal-input-post").classList.remove("active");
});

document.querySelector(".modal-input-post .modal-content").addEventListener("click", (e) => {
    e.stopPropagation();
});

const serverUrl = "http://127.0.0.1:3000";

var posts = [];

function displayPosts(){
    document.querySelector(".posts-box").innerHTML = "";
    posts.forEach(p => {
        let pElt = document.createElement("div");
        pElt.classList.add("facebook-post");
        pElt.innerHTML = `<div class="post-header"><div class="user-info"><h3>${p.nom}</h3></div></div><div class="post-content" style="background-color: ${p.couleur_fond}"><p style="color: ${p.couleur_texte}">${p.texte}</p></div>`;
        document.querySelector(".posts-box").appendChild(pElt);
    });
}

async function fecthData(){
    let rep = await fetch(`${serverUrl}/publications`, {
        method: "GET",
    });
    let l = await rep.json();
    posts = l.data;
    displayPosts();
}
fecthData();

document.querySelector(".modal-input-post .btn-submit").addEventListener("click", async () => {
    let text = document.querySelector(".modal-input-post textarea").value;
    if(text.length < 3){
        return;
    }
    let rep = await fetch(`${serverUrl}/publications`, {
        method: "POST",
        headers:{'content-type': 'application/json'},
        body: JSON.stringify({
            nom: userName,
            texte: text,
            couleur_texte: "#FFFFFF",
            couleur_fond: "#365899"
        })
    });
    fecthData();
    document.querySelector(".modal-input-post").classList.remove("active");
    document.querySelector(".modal-input-post textarea").value = "";
});

async function fetchLasts(){
    if(posts.length == 0){
        return;
    }
    let rep = await fetch(`${serverUrl}/publications-after?id=${posts[0].id}`, {
        method: "GET",
    });
    let l = await rep.json();
    posts = [...l.data, ...posts];
    displayPosts();
}
setInterval(fetchLasts, 5000);