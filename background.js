// background.js

// Esse listener dispara quando a extensão é instalada ou atualizada
chrome.runtime.onInstalled.addListener(() => {
  console.log("Audio Booster instalado com sucesso.");
});

// Se, no futuro, você quiser responder a mensagens genéricas
// vindas de outros scripts (popup ou content), pode descomentar:
// 
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   // aqui você poderia tratar comandos gerais, mas, no nosso fluxo,
//   // o popup comunica diretamente com o content, então não é obrigatório.
// });
