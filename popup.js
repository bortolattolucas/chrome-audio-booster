// Pega referências dos elementos
const volSlider = document.getElementById("volSlider");
const bassSlider = document.getElementById("bassSlider");
const midSlider = document.getElementById("midSlider");
const trebleSlider = document.getElementById("trebleSlider");
const volValue = document.getElementById("volValue");
const bassValue = document.getElementById("bassValue");
const midValue = document.getElementById("midValue");
const trebleValue = document.getElementById("trebleValue");

// Função para enviar mensagem pro content script
function adjustAudio(params) {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "adjust", ...params });
  });
}

// Eventos dos sliders
volSlider.oninput = e => {
  const v = parseFloat(e.target.value);
  volValue.textContent = v.toFixed(1);
  adjustAudio({ gain: v });
};
bassSlider.oninput = e => {
  const b = parseInt(e.target.value);
  bassValue.textContent = `${b}dB`;
  adjustAudio({ bass: b });
};
midSlider.oninput = e => {
  const m = parseInt(e.target.value);
  midValue.textContent = `${m}dB`;
  adjustAudio({ mid: m });
};
trebleSlider.oninput = e => {
  const t = parseInt(e.target.value);
  trebleValue.textContent = `${t}dB`;
  adjustAudio({ treble: t });
};
