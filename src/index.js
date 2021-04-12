const propertiesDiv = document.getElementById("Properties");
let propertyIndex = 0;
let properties = [];
let buildings = [];

class Property {
    constructor(name, fenceLength, id, cost, fenceCost){
        this.name = name;
        this.fenceLength = fenceLength;
        this.id = id;
        this._cost = cost;
        this._fenceCost = fenceCost
        properties.push(this)
    }

    get propsBuildings() {
        return buildings.filter(building => building.propertyId == this.id)
    }

    render() {
        const div = propertiesDiv.appendChild(
            document.createElement("div")
        )
        div.className = "property"
        div.id        = this.id
    
        let h1 = document.createElement("h1")
        h1.innerText = this.name
    
        div.appendChild(h1)
    
        let x = document.createElement("button");
        x.setAttribute("type", "button");
        x.className = "property_destroy";
        x.textContent = "X";
    
        h1.appendChild(x)
        
        this.renderBuildingForm();
        const showFormButton = document.createElement("button");
        showFormButton.setAttribute("type", "button");
        showFormButton.setAttribute("class", "showFormButton");
        showFormButton.setAttribute("id", this.id);
        showFormButton.textContent = "Add Building"
        div.appendChild(showFormButton)

        for (let j = 0; j < this.propsBuildings.length; j++) {
            this.propsBuildings[j].render();
        }
    
        const cost = document.createElement("p");
        cost.className = 'cost'
        cost.innerText = `Cost to fence: ${this._fenceCost}\n Total Cost to Secure Property: ${this._cost}`
        div.appendChild(cost)
    }

    renderBuildingForm() {
        const div = document.getElementById(this.id)

        const form = document.createElement("form");
        form.className = "buildingForm";
        form.id = this.id
        form.style.display = "none"

        const num_ground_windows = document.createElement("input");
        num_ground_windows.setAttribute("type", "integer");
        num_ground_windows.setAttribute("name", "num_ground_windows");
        const ngwLabel = document.createElement("label");
        ngwLabel.innerText = "Number of Ground Level Windows:";

        const num_high_windows   = document.createElement("input");
        num_high_windows.setAttribute("type", "integer");
        num_high_windows.setAttribute("name", "num_high_windows");
        const nhwLabel = document.createElement("label");
        nhwLabel.innerText = "Number of Inaccessible Windows:";

        const name               = document.createElement("input");
        name.setAttribute("type", "text");
        name.setAttribute("name", "name");
        const nameLabel = document.createElement("label");
        nameLabel.innerText = "Name of Building:";

        const num_doors          = document.createElement("input");
        num_doors.setAttribute("type", "integer");
        num_doors.setAttribute("name", "num_doors");
        const ndLabel = document.createElement("label");
        ndLabel.innerText = "Number of Doors:";

        const num_vehicle_doors  = document.createElement("input");
        num_vehicle_doors.setAttribute("type", "integer");
        num_vehicle_doors.setAttribute("name", "num_vehicle_doors");
        const nvdLabel = document.createElement("label");
        nvdLabel.innerText = "Number of Large (vehichle, loading, livestock) Doors:";

        const building_submit    = document.createElement("button");
        building_submit.setAttribute("type", "button");
        building_submit.className = "building_submit";
        building_submit.textContent = "Add Building";

        const br = document.createElement("br");

        div.appendChild(form);
        form.appendChild(nameLabel);
        form.appendChild(name);
        form.appendChild(br.cloneNode());
        form.appendChild(ngwLabel);
        form.appendChild(num_ground_windows);
        form.appendChild(br.cloneNode());
        form.appendChild(nhwLabel);
        form.appendChild(num_high_windows);
        form.appendChild(br.cloneNode());
        form.appendChild(ndLabel);
        form.appendChild(num_doors);
        form.appendChild(br.cloneNode());
        form.appendChild(nvdLabel);
        form.appendChild(num_vehicle_doors);
        form.appendChild(br.cloneNode());
        form.appendChild(br.cloneNode());
        form.appendChild(building_submit);
    }

    create() {
        fetch('http://localhost:3000/properties', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: "application/json"
            },
            body: JSON.stringify({
                "property_info" :
                    {"name"         : this.name,
                    "fence_length"  : this.fenceLength}
            })
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(object) {
            const property = new Property(object.name, object.fence_length, object.id, object.cost, object.fence_cost);
            property.render();
        })
    }

    destroy() {
        fetch(`http://localhost:3000/properties/${this.id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Accept: "application/json"
        }
        });
        const propertyDiv = document.getElementById(this.id);
        propertyDiv.remove();
    }

    reRender() {
        const div = document.getElementById(this.id);
        setTimeout(() => {
            fetch(`http://localhost:3000/properties/${this.id}/cost`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: "application/json"
            }
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(object) {
                console.log(object)
                div.getElementsByClassName('cost')[0].innerText =  `Cost to fence: ${object.fenceCost}\nTotal Cost to Secure Property: ${object.cost}`
            });
        }, 500);
    }

}

class Building {
    constructor(name, id, propertyId, numGroundWindows, numHighWindows, numDoors, numVehicleDoors, cost){
        this.name = name;
        this.id = id;
        this.propertyId = propertyId;
        this.numGroundWindows = numGroundWindows;
        this.numHighWindows = numHighWindows;
        this.numDoors = numDoors;
        this.numVehicleDoors = numVehicleDoors;
        this._cost = cost;

        buildings.push(this);
    }

    render() {
        const div = document.getElementById(this.propertyId)
        const buildingDiv = div.insertBefore(
            document.createElement("div"), div.children[3]
        )
        buildingDiv.className = "buildings";
        buildingDiv.id = this.id;
        
        let h2 = document.createElement("h2");
        h2.innerText = this.name;
        let x = document.createElement("button");
        x.setAttribute("type", "button");
        x.className = "building_destroy";
        x.textContent = "X";
        h2.appendChild(x)
        let buildingBody = document.createElement("p");
        buildingBody.innerText = 
            `Cost to Secure: ${this._cost}`;
    
        buildingDiv.appendChild(h2);
        buildingDiv.appendChild(buildingBody);
    }

    create() {
        fetch('http://localhost:3000/buildings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: "application/json"
            },
            body: JSON.stringify({
              "building_info" :
                  {"name"              : this.name,
                  "num_ground_windows" : this.numGroundWindows,
                  "num_high_windows"   : this.numHighWindows,
                  "num_doors"          : this.numDoors,
                  "num_vehicle_doors"  : this.numVehicleDoors,
                  "property_id"        : this.propertyId
              }
      
            })
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(buildingJson) {
            const building = new Building(buildingJson.name, buildingJson.id, buildingJson.property_id, buildingJson.num_ground_windows, buildingJson.num_high_windows, buildingJson.num_doors, buildingJson.num_vehicle_doors, buildingJson.cost);
            building.render();
        })

        const property = properties.filter(property => property.id == this.propertyId)[0];
        property.reRender(), 5000
    }

    destroy(element){
        fetch(`http://localhost:3000/buildings/${this.id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Accept: "application/json"
        }
        });
        element.remove();

        const property = properties.filter(property => property.id == this.propertyId)[0];
        property.reRender()
    }

}

function populateProperties(propertiesObj) {
    for (let i = 0; i < propertiesObj.length; i++) {
        const propertyObj = new Property(propertiesObj[i].name, propertiesObj[i].fence_length, propertiesObj[i].id, propertiesObj[i].cost, propertiesObj[i].fence_cost);
        propertyObj.render();
    }
}

function populateBuildings(buildingsObj) {
    for (let i = 0; i < buildingsObj.length; i++) {
        const buildingJson = buildingsObj[i];
        const building = new Building(buildingJson.name, buildingJson.id, buildingJson.property_id, buildingJson.num_ground_windows, buildingJson.num_high_windows, buildingJson.num_doors, buildingJson.num_vehicle_doors, buildingJson.cost);
    }
}

fetch("http://localhost:3000/properties")
    .then(function(response) {
        return response.json();
    })
    .then(function(object) {
        populateProperties(object)
    })
    .then(
        fetch("http://localhost:3000/buildings")
        .then(function(response) {
            return response.json();
        })
        .then(function(object) {
            populateBuildings(object)
        })
    );

document.addEventListener("submit", (event) => {
    event.preventDefault();
    const property = new Property(event.target.name.value, event.target.fenceLength.value);
    property.create();
})

document.addEventListener("click", (event) => {
    if (event.target.className == "building_submit") {
        //postBuilding(event.target.parentElement, event.target.parentElement.parentElement);
        const building = new Building(
            event.target.parentElement.name.value,
            0,
            event.target.parentElement.parentElement.id,
            event.target.parentElement.num_ground_windows.value,
            event.target.parentElement.num_high_windows.value,
            event.target.parentElement.num_doors.value,
            event.target.parentElement.num_vehicle_doors.value
            );
        building.create();
        
        event.target.parentElement.style.display = "none";
        event.target.parentElement.parentElement.children[2].style.display = "";
    } else if (event.target.className == "property_destroy") {
        property = properties.filter(property => (property.id == event.target.parentElement.parentElement.id))[0]
        property.destroy();
    } else if (event.target.className == "building_destroy") {
        building = buildings.filter(building => (building.id == event.target.parentElement.parentElement.id))[0]
        building.destroy(event.target.parentElement.parentElement);
    } else if (event.target.className == "showFormButton") {
        event.target.parentElement.children[1].style.display = "";
        event.target.style.display = "none";
    }
})