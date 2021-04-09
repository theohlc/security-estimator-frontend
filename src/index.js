function populateProperties(propertiesObj) {
    const properties = document.getElementById("Properties")
    for (let i = 0; i < propertiesObj.length; i++) {
        const property = propertiesObj[i];
        
        let div = properties.appendChild(
            document.createElement("div")
        )
        div.className = "property"

        let h2 = document.createElement("h2")
        h2.innerText = property.name

        div.appendChild(h2)

        const buildings = property["buildings"]
        
        for (let j = 0; j < buildings.length; j++) {
            const building = buildings[j];
            //let buildingDiv =
            
        }
    }
    console.log("hello")
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