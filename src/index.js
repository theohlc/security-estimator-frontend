const properties = document.getElementById("Properties")

function populateProperties(propertiesObj) {
    for (let i = 0; i < propertiesObj.length; i++) {
        renderProperty(propertiesObj[i])
    }
}

function renderProperty(propertyObj) {
    const div = properties.appendChild(
        document.createElement("div")
    )
    div.className = "property"

    let h1 = document.createElement("h1")
    h1.innerText = propertyObj.name

    div.appendChild(h1)

    const buildings = propertyObj["buildings"]
    
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

    const form = document.createElement("form");

    const num_ground_windows = document.createElement("input");
    num_ground_windows.setAttribute("type", "integer");
    num_ground_windows.setAttribute("name", "num_ground_windows");

    const num_high_windows   = document.createElement("input");
    num_high_windows.setAttribute("type", "integer");
    num_high_windows.setAttribute("name", "num_high_windows");

    const name               = document.createElement("input");
    name.setAttribute("type", "text");
    name.setAttribute("name", "name");

    const num_doors          = document.createElement("input");
    num_doors.setAttribute("type", "integer");
    num_doors.setAttribute("name", "num_doors");

    const num_vehicle_doors  = document.createElement("input");
    num_vehicle_doors.setAttribute("type", "integer");
    num_vehicle_doors.setAttribute("name", "num_vehicle_doors");

    const building_submit    = document.createElement("button");
    building_submit.setAttribute("type", "button");
    building_submit.textContent = "Add Building"

    const br = document.createElement("br");

    div.appendChild(form);
    form.appendChild(name);
    form.appendChild(br.cloneNode());
    form.appendChild(num_ground_windows);
    form.appendChild(br.cloneNode());
    form.appendChild(num_high_windows);
    form.appendChild(br.cloneNode());
    form.appendChild(num_doors);
    form.appendChild(br.cloneNode());
    form.appendChild(num_vehicle_doors);
    form.appendChild(br.cloneNode());
    form.appendChild(br.cloneNode());
    form.appendChild(building_submit);

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
            "fence_length"  : propertyData.fence_length.value}

      })
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(object) {
        renderProperty(object)
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