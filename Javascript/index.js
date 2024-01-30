

// import {Monster} from "./types";
const monsterSection = document.querySelector("#MCC");
const monsterList = [];
const zeldaURL = 'https://botw-compendium.herokuapp.com/api/v3/compendium/all';

if (!monsterSection) {
  throw new Error("Section is not found");  
}

 const fetchAllMonsters = () => 
  fetch(zeldaURL)
    .then((res) =>res.json())
    .then((res)=> res.data);
    
    

const buildMonsterCard = (Monster) =>{
  const $card = document.createElement("div");
  $card.setAttribute('id',Monster.id);
  $card.classList.add("monster-Card");
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
            <li>${Monster.common_locations}</li>
            
          </ul>
        </div>

        <div class="monster-drops"> 
          <h4 class="card-titles">Monster Drops</h4>
          <ul class="monster-items">
            <li>${Monster.drops}</li>
          
          </ul>
        </div>
      </div>
    </div>
    `

  return $card;
};

fetchAllMonsters().then((monsters)=>{
  let monstCharacters = monsters.filter((onlyMonst)=>{
    return onlyMonst.category === "monsters";
  })
 const monstCards = monstCharacters.map((monst)=>buildMonsterCard(monst));
 for (let card of monstCards){
  monsterSection.append(card);
 }
})



// Move Monster Card section
document.addEventListener("DOMContentLoaded",()=>{
  
})
const allMonsterCards = document.querySelectorAll(".monster-Card");
const faveMonsterSection = document.querySelector('#favs');

console.log(allMonsterCards);
const updateCollection = (id,direction) =>{
  
  const monsterItem = document.getElementById(id);

  if (direction === "toMonsterSection") {
    monsterSection.append(monsterItem);

  } else if (direction === "toFavesSection"){
    faveMonsterSection.append(monsterItem);

  }
}
 
allMonsterCards.forEach(item =>{
  item.addEventListener('click',()=>{
    const collection = item.parentElement.id;
    console.log(collection);
    const itemId = item.id;
    let direction;
  
    if (collection === 'MCC') {
      direction = 'toFavesSection';

    } else if(collection === 'favs'){
      direction = 'toMonsterSection';
    }
    updateCollection(itemId,direction);
  })
})


//Sort monster section