function populateProperties(propertiesObj) {
    const properties = document.getElementById("Properties")
    for (let i = 0; i < propertiesObj.length; i++) {
        const property = propertiesObj[i];
        
        const div = properties.appendChild(
            document.createElement("div")
        )
        div.className = "property"

        let h1 = document.createElement("h1")
        h1.innerText = property.name

        div.appendChild(h1)

        const buildings = property["buildings"]
        
        for (let j = 0; j < buildings.length; j++) {
            const building = buildings[j];
            const buildingDiv = div.appendChild(
                document.createElement("div")
            )
            buildingDiv.className = "buildings"
            
            let h2 = document.createElement("h2")
            h2.innerText = building.name
            let buildingBody = document.createElement("p")
            buildingBody.innerText = 
                `Cost to Secure: ${building.cost}`

            buildingDiv.appendChild(h2)
            buildingDiv.appendChild(buildingBody)
        }
    }
    console.log("hello")
}

function postProperty(propertyData) {
    fetch('http://localhost:3000/properties', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: "application/json"
      },
      body: JSON.stringify({
        "property_info" :
            {"name"         : propertyData.name.value,
            "fence_length"  : propertyData.fence_length.value,
            "owner"         : "McDonalds"}

      })
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(object) {
        console.log(object)
    })
}

document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:3000/properties")
        .then(function(response) {
            return response.json();
        })
        .then(function(object) {
                populateProperties(object)
        })
})

document.addEventListener("submit", (event) => {
    event.preventDefault();
    postProperty(event.target)
})