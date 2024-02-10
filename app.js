const url = "https://api.openweathermap.org/data/2.5/weather";
const api_key = "bcc2a884c597b5f3a8c40b5c945cc53f";

const cityInput = document.getElementById("city");
const stateInput = document.getElementById("state");

const submitBtn = document.getElementById("submitBtn");
const saveBtn = document.getElementById("saveBtn");
const removeBtn = document.getElementById("removeBtn");
const reFetchBtn = document.getElementById("reFetchBtn");
const savedSelection = document.getElementById("saved");

const conditionEle = document.getElementById("condition");
const tempEle = document.getElementById("temp");
const lowEle = document.getElementById("low");
const highEle = document.getElementById("high");

class SelectedAreas {
    constructor() {
        this.list = [];
        this.lastArea = [];
    }

    addToList() {
        console.log(`adding ${this.lastArea[0]}, ${this.lastArea[1]} to list`);
        this.list.push([this.lastArea[0], this.lastArea[1]]);
        console.log(this.list);
        this.updateDOM();
    }

    removeFromList(area) {
        console.log(`removing ${area} from list`);
        let update = this.list.filter(x => {
            return x.toString() != area.toString();
        });
        console.log(update);
        this.list = update;

        this.updateDOM();
    }

    setLastArea(city, state) {
        this.lastArea = [city, state];
    }

    updateDOM() {
        // clear saved areas from DOM, then repopulate with current list
        const options = document.getElementById("saved");
        while(options.hasChildNodes()) {
            options.removeChild(options.children[0]);
        }

        this.list.forEach(item => {
            const newOption = document.createElement("option");
            newOption.value = `${item[0]}, ${item[1]}`;
            newOption.innerText = newOption.value = `${item[0]}, ${item[1]}`;
            options.appendChild(newOption);
        });

        if(this.list.length > 0) {
            removeBtn.disabled = false;
            reFetchBtn.disabled = false;
        }

        else {
            removeBtn.disabled = true;
            reFetchBtn.disabled = true;
        }
    }
}

const selectedAreas = new SelectedAreas();

submitBtn.addEventListener("click", () => {
    const api_call = `${url}?q=${cityInput.value},${stateInput.value},US&units=imperial&appid=${api_key}`
    console.log(api_call);
    fetch(api_call)
        .then((res) => res.json())
        .then((obj) => {
            console.log(obj);
            conditionEle.textContent = `${obj.weather[0].description.toUpperCase()}`;
            tempEle.textContent = `Temperature: ${Math.round(obj.main.temp)}°F`;
            lowEle.textContent = `Low: ${Math.round(obj.main.temp_min)}°F`;
            highEle.textContent = `High: ${Math.round(obj.main.temp_max)}°F`;

            // enable the saved area buttons on a successful fetch
            saveBtn.disabled = false;

            selectedAreas.setLastArea(cityInput.value, stateInput.value);

            // QOL: update the save button's text for clarity
            saveBtn.textContent = `Save ${selectedAreas.lastArea[0]}, ${selectedAreas.lastArea[1]}`
        })
        .catch((err) => {
            console.log(err);
        });
});

saveBtn.addEventListener("click", () => {
    selectedAreas.addToList();
    saveBtn.disabled = true; // disable to avoid adding duplicate items
});

removeBtn.addEventListener("click", () => {
    let selection = savedSelection.value.split(", "); // converts the selection to an array
    console.log(`Removing ${selection}`);
    selectedAreas.removeFromList(selection)
});

reFetchBtn.addEventListener("click", () => {
    let selection = savedSelection.value.split(", ");
    const api_call = `${url}?q=${selection[0]},${selection[1]},US&units=imperial&appid=${api_key}`

    fetch(api_call)
        .then((res) => res.json())
        .then((obj) => {
            console.log(obj);
            conditionEle.textContent = `${obj.weather[0].description.toUpperCase()}`;
            tempEle.textContent = `Temperature: ${Math.round(obj.main.temp)}°F`;
            lowEle.textContent = `Low: ${Math.round(obj.main.temp_min)}°F`;
            highEle.textContent = `High: ${Math.round(obj.main.temp_max)}°F`;

        })
        .catch((err) => {
            console.log(err);
        });
});