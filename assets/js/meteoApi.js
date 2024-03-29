//Récupération des différents éléments de mon html
const inputTxt = document.getElementById('inputTxt');
const form = document.getElementById('form');
const divVille = document.getElementById('divVille');
const divMeteo = document.getElementById('divMeteo');


//Afficher une date correctemement à partir d'une Date()
function uneBelleDate(laDate){
    //je récupère l'heure
    let lHeureZero = laDate.getHours();
    //Je gère le problème quand l'heure est inférieure à 10 et qu'il manque un zéro
    let lHeure = (laDate.getHours()).toLocaleString().split('');
    if(lHeure.length==1){
        lHeureZero = "0" + lHeure;
    }
    //Je retourne une belle date.
    return laDate.toLocaleString('fr', {  weekday: 'long' }) + " " 
            + laDate.getDate() + " " 
            + laDate.toLocaleString('fr', {  month: 'long' }) + " " 
            + laDate.getFullYear() + " - "
            + lHeureZero + ":"
            + "00";
}


/**
 * Fonction qui remplit la div divVille
 * @param {} response 
 */
function remplirDivVille ( response) {
     //ajout du nom de ville
     const cityName = document.createElement("h3");
     cityName.textContent = response.city.name + " (" + response.city.country + ")";
     divVille.appendChild(cityName);
     //ajout des coordonnées
     const coord = document.createElement("div");
     coord.textContent = "latitude : " + response.city.coord.lat + ", longitude : " + response.city.coord.lon;
     divVille.appendChild(coord);
     //ajout population
     const pop = document.createElement("div");
     pop.textContent = response.city.population + " habitants";
     divVille.appendChild(pop);
     //Ajout date auj
     //let dateTime = response.list[0].dt;
     let dayToday = new Date();
     const dateDuJour = document.createElement("div");
     dateDuJour.textContent = "Aujourd'hui : " + uneBelleDate(dayToday);
     divVille.appendChild(dateDuJour);
 
     //ajout lever et coucher du soleil
     let lever = new Date(response.city.sunrise *1000);
     let coucher = new Date(response.city.sunset *1000);
     const leverCoucher = document.createElement("div");
     leverCoucher.textContent = " - Lever du soleil : " + lever.getHours() + ":" + lever.getMinutes()
         + " - Coucher du soleil : " + coucher.getHours() + ":" + coucher.getMinutes();
     divVille.appendChild(leverCoucher);

     //ajout des températures min et max
     let laDivTempMinMax = document.createElement('div');
     let leTxtTempMinMax = "min = " + response.list[0].main.temp_min + " degré, max = " + response.list[0].main.temp_max + " degré";
     laDivTempMinMax.textContent = leTxtTempMinMax;
     divVille.appendChild(laDivTempMinMax);

}


/**
 * Fonction qui remplit la div divMeteo
 * @param {*} response 
 */
function remplirDivMeteo(response){
    //faire une boucle sur les 6 premières infos 
    for(let i=0; i<6; i++){
        let divUneMeteo = document.createElement('div');
        divUneMeteo.setAttribute("class", "divUneMeteo");
        //création d'une nouvelle div
        let laDivDate = document.createElement('div');
        laDivDate.setAttribute("class", "laDivDate");
        //ajoute la date exacte
        let laDate = new Date(response.list[i].dt *1000);
        let laDt = uneBelleDate(laDate);
        laDivDate.textContent= laDt;
        divUneMeteo.appendChild(laDivDate);

        //ajoute la température
        let laDivTemp = document.createElement('div');
        laDivTemp.setAttribute("class", "laDivTemp");
        let laTemp = response.list[i].main.temp;;
        laDivTemp.textContent= "temp : " + laTemp + " degré";
        divUneMeteo.appendChild(laDivTemp);

        //ajoute le ciel qu'il fait
        let laDivCiel = document.createElement('div');
        laDivCiel.setAttribute('class', 'laDivCiel');
        let leCiel = response.list[i].weather[0].description;
        laDivCiel.textContent = "Ciel : " + leCiel;
        divUneMeteo.appendChild(laDivCiel);

        //Ajout de l'icon
        let lImgIcon = document.createElement('img');
        lImgIcon.setAttribute('class', 'lImgIcon');
        let lienIcon = response.list[i].weather[0].icon;
        lImgIcon.src = "http://openweathermap.org/img/w/" + lienIcon + ".png";
        divUneMeteo.appendChild(lImgIcon);

        //Ajout dans la div principale divMeteo
        divMeteo.appendChild(divUneMeteo);
    }
}

//J'affiche sur la page
const fetchInfoJson = (response) => {
    //Pour travailler sur la response
    console.log(response);

    //vider des divs
    divVille.innerHTML = null;
    divMeteo.innerHTML = null;

    //Création des infos sur la ville
    remplirDivVille(response);

    //Création des infos sur la météo
    remplirDivMeteo(response);
    
}

//fonction qui récupère la ville entrée sur le form 
//affiche le détail de la ville et de la météo
const envoyerForm = (event) => {
    event.preventDefault();
    
    let texte = event.target.inputTxt.value;
    fetch("https://api.openweathermap.org/data/2.5/forecast?q=Lille&lang=fr&units=metric&appid=93f6d5aef9483f8488f7bf06277403fd")
    .then( (response) => {
        return response.json();
    })
    .then( fetchInfoJson
    )
    .catch( (error) => {
        console.error(error);
    })


};

//Ecoute sur la validation du formulaire
form.addEventListener('submit', envoyerForm);

