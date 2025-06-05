(async () => {
  // Evita duplicar contextos
  if (window.__audioBooster__) return;
  window.__audioBooster__ = true;

  // Pega todos os elementos de mídia da página
  const mediaElements = [...document.querySelectorAll("audio, video")];
  mediaElements.forEach(el => {
    try {
      // Cria áudio context e gain
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const srcNode = ctx.createMediaElementSource(el);
      const gainNode = ctx.createGain();
      gainNode.gain.value = 1; // ajuste inicial, depois a UI manipula
      // Equalizador – exemplo com 3 bandas: grave, médio, agudo
      const bassEQ = ctx.createBiquadFilter();
      bassEQ.type = "lowshelf";
      bassEQ.frequency.value = 360; // frequência de corte pra graves
      bassEQ.gain.value = 0;

      const midEQ = ctx.createBiquadFilter();
      midEQ.type = "peaking";
      midEQ.frequency.value = 1000; // médios
      midEQ.Q.value = 1;
      midEQ.gain.value = 0;

      const trebleEQ = ctx.createBiquadFilter();
      trebleEQ.type = "highshelf";
      trebleEQ.frequency.value = 3500; // agudos
      trebleEQ.gain.value = 0;

      // Conexão: src -> gain -> bass -> mid -> treble -> destino
      srcNode.connect(gainNode);
      gainNode.connect(bassEQ);
      bassEQ.connect(midEQ);
      midEQ.connect(trebleEQ);
      trebleEQ.connect(ctx.destination);

      // Armazena nodes na própria tag pra UI acessar depois
      el.__audioNodes__ = { ctx, gainNode, bassEQ, midEQ, trebleEQ };
    } catch (e) {
      console.warn("Audio Booster: não conseguiu processar este elemento:", e);
    }
  });
})();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "adjust" && window.__audioBooster__) {
    document.querySelectorAll("audio, video").forEach(el => {
      const nodes = el.__audioNodes__;
      if (!nodes) return;
      if (message.gain != null) {
        // Amplia volume: nodes.gainNode.gain.value = valor slider
        nodes.gainNode.gain.value = message.gain;
      }
      if (message.bass != null) nodes.bassEQ.gain.value = message.bass;
      if (message.mid != null) nodes.midEQ.gain.value = message.mid;
      if (message.treble != null) nodes.trebleEQ.gain.value = message.treble;
    });
  }
});
