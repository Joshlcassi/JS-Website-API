const monsterSection = document.querySelector("#MCC");
const faveMonsterSection = document.querySelector('#favs');
const monsterList = [];
const zeldaURL = 'https://botw-compendium.herokuapp.com/api/v3/compendium/all';
const getFavorites = getFaveLocalStor();




// Count common locations
const commonLocationsCounter = {};

// Display the top three common locations and their counts
const commLocalSect = document.querySelector('#CLS');
const topLocationsList = document.createElement('ul');

// Local Storage
function getFaveLocalStor() {
  const favorites = localStorage.getItem('favorites');
  return favorites ? JSON.parse(favorites):[];
}

function saveFavesToLocal(favorites) {
  localStorage.setItem('favorites',JSON.stringify(favorites));
}

function addToFaves(id) {
  const favorites = getFaveLocalStor();
  favorites.push(id);
  saveFavesToLocal(favorites);
}

function removeFromFaves(id) {
  let favorites = getFaveLocalStor();
  favorites = favorites.filter(favId => favId !== id);
  saveFavesToLocal(favorites);
}


// Move Monster Card section
const updateCollection = (id,direction) =>{

  const monsterItem = document.getElementById(id);
  const iconElement = monsterItem.querySelector('i');

  if (direction === "toMonsterSection") {
    monsterSection.append(monsterItem);
    iconElement.classList.remove("fa-solid", "red");
    iconElement.classList.add('fa-regular');
    removeFromFaves(id);
  
  } else if (direction === "toFavesSection"){
    faveMonsterSection.append(monsterItem);
    iconElement.classList.remove('fa-regular');
    iconElement.classList.add("fa-solid", "red");
    if (getFavorites.includes(id)) {
      removeFromFaves(id);
    }
    addToFaves(id);
  }
};

//Sort monster section
const sortBtn = document.querySelectorAll('.sortBtn');

if (!monsterSection) {
  throw new Error("Section is not found");  
}

const fetchAllMonsters = () => 
  fetch(zeldaURL)
  .then((res) =>res.json())
  .then((res)=> res.data);
      
    
const buildMonsterCard = (Monster) =>{
  const $card = document.createElement("div");
  $card.setAttribute('id',Monster.name);
  $card.classList.add("monster-Card");

  let commonLocationsList = '';

  if (Monster.common_locations && Monster.common_locations.length > 0) {
    commonLocationsList = Monster.common_locations.map(location => `<li>${location}</li>`).join('');
  } else {
    commonLocationsList = '<li>No common locations available</li>';
  }

  let monsterDropList = '';

  if (Monster.drops && Monster.drops.length > 0) {
    monsterDropList = Monster.drops.map(drops => `<li>${drops}</li>`).join('');
  } else {
    monsterDropList = '<li>No Monster Drops available</li>';
  }


  $card.innerHTML = `
    <div class="monster-card-header">
      <h3 class="monster-Name">${Monster.name}</h3>
      <button class="btn-favorites favorites">
        <i class="fa-regular fa-heart"></i>
      </button>
    </div>
    
    <div class="monster-Content">
      <div class="monster-Card-Top">
        <div class="monster-img">
          <img src=${Monster.image} alt="monster image">
        </div>

        <div class="monster-Desc">
          <h4 class="card-titles">Monster Description</h4>
          <p>${Monster.description}</p>
        </div>
      </div>
      
      <div class="monster-Card-Bottom">
        <div class="monster-location"> 
          <h4 class="card-titles">Common Locations</h4>
          <ul class="monster-items">
            ${commonLocationsList}
            
          </ul>
        </div>

        <div class="monster-drops"> 
          <h4 class="card-titles">Monster Drops</h4>
          <ul class="monster-items monster-drops">
            ${monsterDropList}
          
          </ul>
        </div>
      </div>
    </div>
    `

  return $card;
};

//Monster counter Section
fetchAllMonsters().then((monsters)=>{
  let monstCharacters = monsters.filter((onlyMonst)=>{
    return onlyMonst.category === "monsters";
  })

  const monstCards = monstCharacters.map((monst)=>buildMonsterCard(monst));
  for (let card of monstCards){
    monsterSection.append(card);
    
  }

   // Count common locations
   if (monstCharacters && monstCharacters.length>0) {
    monstCharacters.forEach((monst) => {
      if (monst.common_locations&&(monst.common_locations).length>0) {
        monst.common_locations.forEach((location) => {
          commonLocationsCounter[location] = (commonLocationsCounter[location] || 0) + 1;
        });
      }
    });
   };
   
 
   // Sort common locations by count in descending order
   const sortedCommonLocations = Object.entries(commonLocationsCounter)
     .sort((a, b) => b[1] - a[1])
     .slice(0, 3); // Get the top three
 
   // Display the top three common locations and their counts
   topLocationsList.classList.add('TLList');
   sortedCommonLocations.forEach(([location, count]) => {
     const li = document.createElement('li');
     li.textContent = `${location}: ${count}`;
     topLocationsList.appendChild(li);
   });
   const topLocationsContainer = document.createElement('div');
   topLocationsContainer.classList.add('top-locations-container');
   topLocationsContainer.innerHTML = `
     <h4 class="card-titles">Top 3 Common Locations</h4>
   `;
 
  topLocationsContainer.appendChild(topLocationsList);
  
  if ( commLocalSect) {
    commLocalSect.appendChild(topLocationsContainer);
  }
  
  // Move Monster Card section
  const allMonsterCards = document.querySelectorAll(".monster-Card");
  getFavorites.forEach(favemonst => {
    updateCollection(favemonst,'toFavesSection')
  });
  
  allMonsterCards.forEach(item =>{
    item.addEventListener('click',()=>{
      const collection = item.parentElement.id;
      const itemId = item.id;
      let direction;
    
      if (collection === 'MCC') {
        direction = 'toFavesSection';

      } else if(collection === 'favs'){
        direction = 'toMonsterSection';
      }
      updateCollection(itemId,direction);
    })
  });


  //Sort monster section
  const sortData = (direction) => {
    const newArr = Array.from(allMonsterCards);
    newArr.sort((a,b) =>{
      const idA = String(a.id)
      const idB = String(b.id)

      if (direction === 'asc') {
        return idA.localeCompare(idB) ;
    
      } else if (direction === 'desc') {
        return idB.localeCompare(idA) ;
      }
    });

    newArr.forEach((item) => {
      let parID = item.parentElement.id;
      if (parID === 'MCC') {
         monsterSection.append(item);
      } else if (parID === 'favs') {
        faveMonsterSection.append(item);
      }
     
    })
  }

  sortBtn.forEach(item => {
    item.addEventListener('click',() => {
      sortData(item.getAttribute('data-sortdir'));
    })
  });
});



