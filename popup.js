// Pega referências dos elementos
const volSlider = document.getElementById("volSlider");
const bassSlider = document.getElementById("bassSlider");
const midSlider = document.getElementById("midSlider");
const trebleSlider = document.getElementById("trebleSlider");
const volValue = document.getElementById("volValue");
const bassValue = document.getElementById("bassValue");
const midValue = document.getElementById("midValue");
const trebleValue = document.getElementById("trebleValue");

// Valores padrão
const defaultValues = {
  volume: 1,
  bass: 0,
  mid: 0,
  treble: 0
};

// Função para injetar o content script na aba ativa
async function injectContentScript() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Verifica se já foi injetado
    const results = await chrome.tabs.sendMessage(tab.id, { action: "ping" }).catch(() => null);
    if (results) return; // Já foi injetado
    
    // Injeta o script
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });
  } catch (error) {
    console.warn("Erro ao injetar content script:", error);
  }
}

// Função para enviar mensagem pro content script
async function adjustAudio(params) {
  try {
    await injectContentScript(); // Garante que o script está injetado
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, { action: "adjust", ...params });
  } catch (error) {
    console.warn("Erro ao ajustar áudio:", error);
  }
}

// Função para salvar valores no storage
function saveValues(values) {
  chrome.storage.local.set(values);
}

// Função para carregar valores salvos
async function loadSavedValues() {
  try {
    const saved = await chrome.storage.local.get(defaultValues);
    return saved;
  } catch (error) {
    console.warn("Erro ao carregar valores salvos:", error);
    return defaultValues;
  }
}

// Função para atualizar a interface com os valores
function updateUI(values) {
  // Volume
  volSlider.value = values.volume;
  volValue.textContent = `×${values.volume.toFixed(1)}`;
  
  // Bass
  bassSlider.value = values.bass;
  bassValue.textContent = `${values.bass}dB`;
  
  // Mid
  midSlider.value = values.mid;
  midValue.textContent = `${values.mid}dB`;
  
  // Treble
  trebleSlider.value = values.treble;
  trebleValue.textContent = `${values.treble}dB`;
}

// Função para resetar todos os valores
function resetAllValues() {
  updateUI(defaultValues);
  adjustAudio({
    gain: defaultValues.volume,
    bass: defaultValues.bass,
    mid: defaultValues.mid,
    treble: defaultValues.treble
  });
  saveValues(defaultValues);
}

// Eventos dos sliders
volSlider.oninput = e => {
  const v = parseFloat(e.target.value);
  volValue.textContent = `×${v.toFixed(1)}`;
  adjustAudio({ gain: v });
  saveValues({ volume: v });
};

bassSlider.oninput = e => {
  const b = parseInt(e.target.value);
  bassValue.textContent = `${b}dB`;
  adjustAudio({ bass: b });
  saveValues({ bass: b });
};

midSlider.oninput = e => {
  const m = parseInt(e.target.value);
  midValue.textContent = `${m}dB`;
  adjustAudio({ mid: m });
  saveValues({ mid: m });
};

trebleSlider.oninput = e => {
  const t = parseInt(e.target.value);
  trebleValue.textContent = `${t}dB`;
  adjustAudio({ treble: t });
  saveValues({ treble: t });
};

// Inicialização: carrega valores salvos quando a popup abre
document.addEventListener('DOMContentLoaded', async () => {
  const savedValues = await loadSavedValues();
  updateUI(savedValues);
  
  // Injeta o content script e aplica os valores salvos
  await injectContentScript();
  adjustAudio({
    gain: savedValues.volume,
    bass: savedValues.bass,
    mid: savedValues.mid,
    treble: savedValues.treble
  });

  // Event listener para o botão reset
  document.getElementById('resetBtn').addEventListener('click', resetAllValues);
});
