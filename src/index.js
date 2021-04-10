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
    div.id        = propertyObj.id

    let h1 = document.createElement("h1")
    h1.innerText = propertyObj.name

    div.appendChild(h1)

    let x = document.createElement("button");
    x.setAttribute("type", "button");
    x.className = "property_destroy";
    x.textContent = "X";

    h1.appendChild(x)

    const buildings = propertyObj["buildings"]
    
    renderBuildingForm(div, propertyObj);
    showFormButton = document.createElement("button");
    showFormButton.setAttribute("type", "button");
    showFormButton.setAttribute("class", "showFormButton");
    showFormButton.setAttribute("id", propertyObj.id);
    showFormButton.textContent = "Add Building"
    div.appendChild(showFormButton)

    for (let j = 0; j < buildings.length; j++) {
        renderBuilding(buildings[j], div)
    }

}

function renderBuildingForm(div, propertyObj) {
    const form = document.createElement("form");
    form.className = "buildingForm";
    form.id = propertyObj.id
    form.style.display = "none"

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
    building_submit.className = "building_submit";
    building_submit.textContent = "Add Building";

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

function renderBuilding(buildingObj, div) {
    const buildingDiv = div.appendChild(
        document.createElement("div")
    )
    buildingDiv.className = "buildings";
    buildingDiv.id = buildingObj.id;
    
    let h2 = document.createElement("h2");
    h2.innerText = buildingObj.name;
    let x = document.createElement("button");
    x.setAttribute("type", "button");
    x.className = "building_destroy";
    x.textContent = "X";
    h2.appendChild(x)
    let buildingBody = document.createElement("p");
    buildingBody.innerText = 
        `Cost to Secure: ${buildingObj.cost}`;

    buildingDiv.appendChild(h2);
    buildingDiv.appendChild(buildingBody);
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

function postBuilding(buildingData, propertyDiv) {
    fetch('http://localhost:3000/buildings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: "application/json"
      },
      body: JSON.stringify({
        "building_info" :
            {"name"              : buildingData.name.value,
            "num_ground_windows" : buildingData.num_ground_windows.value,
            "num_high_windows"   : buildingData.num_high_windows.value,
            "num_doors"          : buildingData.num_doors.value,
            "num_vehicle_doors"  : buildingData.num_vehicle_doors.value,
            "property_id"        : buildingData.id
        }

      })
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(object) {

        renderBuilding(object, propertyDiv)
    })
}

function destroyProperty(propertyId, propertyDiv) {
    fetch(`http://localhost:3000/properties/${propertyId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Accept: "application/json"
        }
    });
    propertyDiv.remove();
}

function destroyBuilding(buildingId, buildingDiv) {
    fetch(`http://localhost:3000/buildings/${buildingId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Accept: "application/json"
        }
    });
    buildingDiv.remove();
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

document.addEventListener("click", (event) => {
    if (event.target.className == "building_submit") {
        postBuilding(event.target.parentElement, event.target.parentElement.parentElement);
        event.target.parentElement.style.display = "none";
        event.target.parentElement.parentElement.children[2].style.display = "";
    } else if (event.target.className == "property_destroy") {
        destroyProperty(event.target.parentElement.parentElement.id, event.target.parentElement.parentElement);
    } else if (event.target.className == "building_destroy") {
        destroyBuilding(event.target.parentElement.parentElement.id, event.target.parentElement.parentElement);
    } else if (event.target.className == "showFormButton") {
        event.target.parentElement.children[1].style.display = "";
        event.target.style.display = "none";
    }
})