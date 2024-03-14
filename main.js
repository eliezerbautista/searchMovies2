const apiKey = "86768493";
const searchInput = document.getElementById("searchInput");
const result = document.getElementById("listItems");
const detail = document.getElementById("detail");
const list = document.getElementById("favorites");

let cont = 0;
let data = null;

searchInput.addEventListener("input", searchMovies);

async function searchMovies() {
  const searchTems = searchInput.value;

  if (searchTems.length > 3) {
    const url = `https://www.omdbapi.com/?s=${searchTems}&apikey=${apiKey}`;
    try {
      const response = await fetch(url);
      const data = await response.json();

      data.Search ? showMovies(data.Search) : cleanMovies();
    } catch (error) {
      console.log("Error", error);
    }
  } else {
    cleanMovies();
  }
}

async function selectMovie(id) {
  const url = `https://www.omdbapi.com/?i=${id}&apikey=${apiKey}`;

  try {
    const resp = await fetch(url);
    data = await resp.json();
    const poster = data.Poster == "N/A" ? "./img/generica_32.png" : data.Poster;

    detail.innerHTML = `<img src="${poster}" style="width:200px;height:250px;">
                        <h1>${data.Title}</h1>
                        <p>${data.Released} - ${data.Runtime}</p>
                        <p>${data.Genre}</p>
                        <div> <img src="./img/EstrellaIMDB.png" style="width:20px;height:20px;"></img>  ${data.imdbRating} IMDP rating</div>
                        <p><em>${data.Plot}</em></p>
                        <p>${data.Actors}</p>
                        <p>Directed by ${data.Director}</p>
                        `;

    const button = document.createElement("button");
    button.innerHTML = "Add to List";
    button.type = "button";
    button.classList.add("button-add");
    button.addEventListener("click", addFavorites);
    detail.appendChild(button);
    document.getElementById("detail").style.opacity = 1;
    document.getElementById("favorites").style.opacity = 1;
  } catch (error) {
    console.log("Error", error);
  }
}

function addFavorites(event) {
  const items = list.getElementsByClassName("fav-item");


  for (let index = 0; index < items.length; index++) {
    if (items[index].getAttribute("data-value") == data.imdbID) {
      items[index].remove();
    }
  }

  const url = data.Poster == "N/A" ? "./img/generica_32.png" : data.Poster;
  
  cont++;
  const newFav = `
      <div class="fav-item" id="${cont}" data-value="${data.imdbID}">

        <div id="poster"><img src="${url}" style="width: 82px; height: 120px;"">
           <div id="title"><label> ${data.Title} </br> ${data.Released} - ${data.Runtime} </br><em>${data.Genre}</em> </br> </br><img src="./img/EstrellaIMDB.png" style="width:10px;height:10px;"></img>  ${data.imdbRating} IMDP rating</label></div>   
           <div id="icon"><img src="./img/cancelar.png" id="${cont}""></div>
        </div>
      </div>
  `;
  list.innerHTML += newFav;

  document.getElementById("titleFav").innerHTML = "Mis Peliculas Favoritas";

  }

function deleteFav(id) {
  const items = list.getElementsByClassName("fav-item");
  list.removeChild(document.getElementById(id));

  if(items.length == 0){

      document.getElementById("titleFav").innerHTML = "No tienes Favoritos";
  }
}
function cleanMovies() {
  result.innerHTML = " ";
  detail.innerHTML = " ";
  document.getElementById("detail").style.opacity = 0;
  document.getElementById("favorites").style.opacity = 0;
}

function showMovies(data) {
  result.innerHTML = "";
  data.forEach((movie) => {

    const url = movie.Poster == "N/A" ? "./img/generica_32.png" : movie.Poster;
    const item = document.createElement("li");
    item.setAttribute("id", movie.imdbID);
    item.innerHTML = `
          <img src="${url}" id="${movie.imdbID}" >
          <p id="${movie.imdbID}" >${movie.Title}</p>
          <p id="${movie.imdbID}" >${movie.Year}</p>`;

    result.appendChild(item);
    //<!-- onclick="selectMovie('${movie.imdbID}')-->
  });
}
list.addEventListener("click", (event) => {
  if (event.srcElement.nodeName == "IMG") {
    deleteFav(event.srcElement.id);
  }
});

result.addEventListener("click", (event) => {
  selectMovie(event.target.getAttribute("id"));
});
