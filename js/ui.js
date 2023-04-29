//Service Worker
if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/sw.js')
    .then((reg) => console.log('service worker registered', reg))
    .catch((err) => console.log('service worker not registered', err))
}

//Side Menu in Navigator
document.addEventListener('DOMContentLoaded', function() {
    
    const menus = document.querySelectorAll('.side-menu');
    M.Sidenav.init(menus,{edge: 'left'});
});

//Searching restaurants through location
const search = () => {
    //Using trim function to remove spaces at the end of the search text
    const searchText = document.getElementById("search-bar").value.trim().toUpperCase();
    const storeRestaurants = document.getElementById("card-panel-container");
    const restaurant = document.querySelectorAll(".card-panel");
    const rlocation = storeRestaurants.getElementsByTagName("p");

    for(var i=0; i < rlocation.length; i++){
        let match = restaurant[i].getElementsByTagName("p")[0];

        if(match){
           let textvalue = match.textContent || match.innerHTML

           if(textvalue.toUpperCase().indexOf(searchText) > -1){
                restaurant[i].style.display = "";
           }

           else{
            restaurant[i].style.display = "none";
           }
        }
    }

}

