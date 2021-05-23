const msg = new SpeechSynthesisUtterance();
let voices = [];
const voicesDropdown = document.querySelector('[name="voice"]');
const options = document.querySelectorAll('[type="range"], [name="text"]');
const speakButton = document.querySelector('#speak');
const stopButton = document.querySelector('#stop');
const searchButton = document.querySelector('#search-button');
const searchField = document.querySelector('.search-field');
const previousResults = document.querySelector('.previous-results');
// const list = document.querySelector('.list')
msg.text = document.querySelector('[name="text"]').value;

function populateVoices() {
    voices = this.getVoices();
    voicesDropdown.innerHTML = voices
        .filter(voice => voice.lang.includes('en'))
        .map(voice => `<option value="${voice.name}">${voice.name} (${voice.lang})</option>`)
        .join('');
}

function setVoice() {
    msg.voice = voices.find(voice => voice.name === this.value);
    toggle();
}

function toggle(startOver = true) {
    speechSynthesis.cancel();
    if (startOver) {
        speechSynthesis.speak(msg);
    }
}

function setOption() {
    console.log(this.name, this.value);
    msg[this.name] = this.value;
    const previousTexts = localStorage.getItem("SpeechSynthesisTexts")
    localStorage.setItem("SpeechSynthesisTexts", msg.text + "\n" + previousTexts);
    toggle();
}

speechSynthesis.addEventListener('voiceschanged', populateVoices);
voicesDropdown.addEventListener('change', setVoice);
options.forEach(option => option.addEventListener('change', setOption));
speakButton.addEventListener('click', toggle);
stopButton.addEventListener('click', () => toggle(false));

searchButton.addEventListener('click', () => {
    if (searchField.value === "") {
        alert("Enter something in the search field");
        return;
    }
    previousResults.innerHTML = "<h3>Previous Results that include your search item:</h3>";
    let list = document.createElement('ol');
    previousResults.appendChild(list);
    const previousTexts = localStorage.getItem("SpeechSynthesisTexts").split("\n");
    previousTexts.forEach(text => {
        if (text.includes(searchField.value)) {
            let li = document.createElement('li');
            li.textContent = text;
            list.appendChild(li);
        }
    })
})