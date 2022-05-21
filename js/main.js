//query elements from HTML
let elForm = $(".js-form");
let elSearchInput = $(".js-search-input");
let elKinolarList = $(".js-kinolar-list");
let elSearchReytingInput = $(".js-search-reyting-input");
let elSearchSelectCategories = $("#categories");
let elSearchSort = $("#tartib");
let elTemplate = $("#js-template").content;


movies.splice(100);
//Nusxa olish
let normalizeMovies =  movies.map((movie, i) =>{
  return {
    id: i,
    title: movie.Title.toString(),
    fulltitle: movie.fulltitle,
    categories: movie.Categories.split("|").join(", "),
    summary: movie.summary,
    imdb_rating: movie.imdb_rating,
    runtime: movie.runtime,
    language: movie.language,
    trailer: `https://www.youtube.com/watch?v=${movie.ytid}`,
    smallPoster: `http://i3.ytimg.com/vi/${movie.ytid}/hqdefault.jpg`,
    bigPoster: `https://i3.ytimg.com/vi/${movie.ytid}/maxresdefault.jpg`
  }
}) 

//Tamplatega qiymatlar berish funksiyasi
let logMovies = function(film){
  let elTemplateClone = elTemplate.cloneNode(true);

  $(".js-kino-img", elTemplateClone).src = film.smallPoster;
  $(".js-kino-img", elTemplateClone).alt = film.title;
  $(".js-kino-title", elTemplateClone).textContent = `Title: ${film.title}`;
  //$(".js-kino-fulltitle", elTemplateClone).textContent = film.fulltitle;
  $(".js-kino-categories", elTemplateClone).textContent = `Categories: ${film.categories}`;
  $(".js-kino-reytinggi", elTemplateClone).textContent = `Reyting: ${film.imdb_rating}`;
  $(".js-kino-trailer", elTemplateClone).href = film.trailer;

  return elTemplateClone;
}

//Render funkisyasi
let renderKinolar = function(normalizeMovies){
  elKinolarList.innerHTML = "";
  let fragment = document.createDocumentFragment();

  normalizeMovies.forEach((film) => {
    fragment.append(logMovies(film));
  })
  elKinolarList.append(fragment);
}
renderKinolar(normalizeMovies);


//Reyting boyicha qidirish funksiyasi
let reytingSearch = function(){
  let a = [];
   normalizeMovies.forEach((movie) => {
    if(movie.imdb_rating >= elSearchReytingInput.value.trim()){
      a.push(movie);
    }
  })
  return a;
}


//Kategoryalarni topish funksiyasi 
let numberCategorie = [];
let numberCategories = function(){
  
  normalizeMovies.forEach((movie) => {
    movie.categories.split(", ").forEach((categori) => {
      if(!numberCategorie.includes(categori)){
        numberCategorie.push(categori);
      }
    })
  })
  numberCategorie.unshift("All");
   return numberCategorie
}
numberCategories();


//Categoria boyicha opshin yaratish function
numberCategorie.forEach((categoria) => {
  let newOption = document.createElement("option");
  newOption.textContent = categoria;
  newOption.value = categoria;
  newOption.name = categoria;

  elSearchSelectCategories.append(newOption);
})


//Functsion categoriya boyicha qidirish
let searchCategoriess = function(){
  let k = [];
  normalizeMovies.forEach((film) => {
     let categoriArry =  film.categories.split(", ");
      if(categoriArry.includes(elSearchSelectCategories.value)){
        k.push(film);
      }
  })
  return k
}

//Function Alifbo va reyting boyicha tartiblashda optionlar yaratish chiqarish
let sortAlifboReytingCreatOption = function(){

let elSortTitleOption = document.createElement("option");
elSortTitleOption.textContent = "A-Z";
elSortTitleOption.value = "A-Z";

let elSortReversTitleOption = document.createElement("option");
elSortReversTitleOption.textContent = "Z-A";
elSortReversTitleOption.value = "Z-A";

let elSortReytingOption = document.createElement("option");
elSortReytingOption.textContent = "Reytingi =>";
elSortReytingOption.value = "Reytingi =>";

let elSortReverseReytingOption = document.createElement("option");
elSortReverseReytingOption.textContent = "Reytingi <=";
elSortReverseReytingOption.value = "Reytingi <=";

elSearchSort.append(elSortTitleOption,elSortReversTitleOption,elSortReytingOption,elSortReverseReytingOption);
}

sortAlifboReytingCreatOption()



elSearchInput.addEventListener("change", (evt) => {
  evt.preventDefault();

  let search = new RegExp(elSearchInput.value.trim(), "gi");

  let searchfilter = normalizeMovies.filter((movie) => {
    if(movie.title.match(search)){
      return movie.title.match(search);
    }
  })

  renderKinolar(searchfilter);
})


elSearchReytingInput.addEventListener("change", (evt) => {
  evt.preventDefault();
  
  renderKinolar(reytingSearch());
})


elSearchSelectCategories.addEventListener("change", (evt) => {
  evt.preventDefault();

  
  renderKinolar(searchCategoriess());
  if(elSearchSelectCategories.value=="All"){
    renderKinolar(normalizeMovies);
  }
})


elSearchSort.addEventListener("change", (evt) => {
  evt.preventDefault();

  let sortArry = [];
  let sortTitleReyting = [];
if(elSearchSort.value == "A-Z"){
  normalizeMovies.forEach((film) => {
    sortArry.push(film.title);
  })
  sortArry.sort();

  sortArry.forEach((title) => {
    normalizeMovies.forEach((a) => {
       if(a.title == title){
        sortTitleReyting.push(a);
       }
    })
  })
}
else if(elSearchSort.value == "Z-A"){
  normalizeMovies.forEach((film) => {
    sortArry.push(film.title);
  })
  sortArry.sort().reverse();

  sortArry.forEach((title) => {
    normalizeMovies.forEach((a) => {
       if(a.title == title){
        sortTitleReyting.push(a);
       }
    })
  })
}
else if(elSearchSort.value == "Reytingi =>"){
  normalizeMovies.forEach((film) => {
    sortArry.push(film.imdb_rating);
  })

  sortArry.sort(function(a,b){
    return a-b
  })

  sortArry.forEach((reyting) => {
    normalizeMovies.forEach((film) => {
      if(film.imdb_rating == reyting){
        sortTitleReyting.push(film);
      }
    })
  })
}
else if(elSearchSort.value == "Reytingi <="){
  normalizeMovies.forEach((film) => {
    sortArry.push(film.imdb_rating);
  })

  sortArry.sort(function(a,b){
    return b-a
  })

  sortArry.forEach((reyting) => {
    normalizeMovies.forEach((film) => {
      if(film.imdb_rating == reyting){
        sortTitleReyting.push(film);
      }
    })
  })
}

  renderKinolar(sortTitleReyting);
})