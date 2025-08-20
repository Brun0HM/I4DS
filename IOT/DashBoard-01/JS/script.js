// 🌐 URL do broker MQTT com WebSocket Secure (WSS)
const brokerUrl = "wss://broker.hivemq.com:8884/mqtt";

// 📡 Tópicos MQTT - CORRIGIDOS para corresponder ao ESP32
const topicoSensor = "brunex/lerSensor"; // Dados do sensor
const topicoLed1 = "brunex/led1"; // LED 1 (vermelho)
const topicoLed2 = "brunex/led2"; // LED 2 (azul) - CORRIGIDO

// 🆔 Gera ID único para cliente MQTT
const clienteId = "webClient_" + Math.floor(Math.random() * 1000000);

// ⚡ Cria instância do cliente MQTT
const clienteMQTT = new Paho.MQTT.Client(brokerUrl, clienteId);

// 🔌 Função executada quando conexão é perdida
clienteMQTT.onConnectionLost = (responseObject) => {
  console.error("❌ Conexão perdida: " + responseObject.errorMessage);
  // Atualiza status na interface
  updateConnectionStatus(false);
};

// 📥 Função executada quando mensagem chega
clienteMQTT.onMessageArrived = (message) => {
  console.log(
    "📥 Mensagem recebida:",
    message.destinationName,
    message.payloadString
  );

  // Processa dados do sensor
  if (message.destinationName === topicoSensor) {
    try {
      const dados = JSON.parse(message.payloadString);

      // Atualiza elementos HTML
      document.getElementById("temp").innerText = dados.temperatura + "°C";
      document.getElementById("umid").innerText = dados.umidade + "%";

      // Atualiza timestamp
      const now = new Date().toLocaleTimeString();
      document.getElementById("timestamp").innerText =
        "Última atualização: " + now;

      console.log("📊 Dados atualizados:", dados);
    } catch (e) {
      console.error("❌ Erro ao processar JSON:", e);
    }
  }
};

// 🔗 Conecta ao broker MQTT
clienteMQTT.connect({
  useSSL: true, // Obrigatório para WSS
  timeout: 10,

  // ✅ Sucesso na conexão
  onSuccess: () => {
    console.log("✅ Conectado ao broker MQTT HiveMQ");

    // Se inscreve no tópico do sensor
    clienteMQTT.subscribe(topicoSensor);
    console.log("📡 Inscrito em:", topicoSensor);

    // Atualiza status na interface
    updateConnectionStatus(true);
  },

  // ❌ Falha na conexão
  onFailure: (err) => {
    console.error("❌ Falha na conexão MQTT:", err);
    updateConnectionStatus(false);
  },
});

// 💡 Função para controlar LEDs
function enviarComando(led, estado) {
  if (!clienteMQTT.isConnected()) {
    console.error("❌ Cliente MQTT desconectado!");
    alert("Erro: Não conectado ao broker MQTT");
    return;
  }

  // Escolhe tópico correto
  const topico = led === "led1" ? topicoLed1 : topicoLed2;

  // Converte estado boolean para formato esperado pelo ESP32
  const comando = estado ? "ON" : "OFF";

  // Cria e envia mensagem
  const message = new Paho.MQTT.Message(comando);
  message.destinationName = topico;

  try {
    clienteMQTT.send(message);
    console.log(`📤 Enviado para ${topico}: ${comando}`);

    // Feedback visual
    showNotification(
      `LED ${led === "led1" ? "1" : "2"} ${estado ? "ligado" : "desligado"}!`
    );
  } catch (error) {
    console.error("❌ Erro ao enviar comando:", error);
    alert("Erro ao enviar comando!");
  }
}

// 🔄 Função para atualizar status de conexão
function updateConnectionStatus(connected) {
  const statusElement = document.getElementById("status");
  if (statusElement) {
    statusElement.innerText = connected ? "🟢 Conectado" : "🔴 Desconectado";
    statusElement.className = connected
      ? "status-connected"
      : "status-disconnected";
  }
}

// 📢 Função para mostrar notificações
function showNotification(message) {
  const notification = document.getElementById("notification");
  if (notification) {
    notification.innerText = message;
    notification.style.display = "block";

    // Remove após 3 segundos
    setTimeout(() => {
      notification.style.display = "none";
    }, 3000);
  } else {
    // Fallback para console se elemento não existir
    console.log("🔔 " + message);
  }
}

// 🚀 Funções auxiliares para os botões
function ligarLed1() {
  enviarComando("led1", true);
}
function desligarLed1() {
  enviarComando("led1", false);
}
function ligarLed2() {
  enviarComando("led2", true);
}
function desligarLed2() {
  enviarComando("led2", false);
}

// 🔄 Função para reconectar manualmente
function reconectar() {
  if (clienteMQTT.isConnected()) {
    clienteMQTT.disconnect();
  }

  setTimeout(() => {
    clienteMQTT.connect({
      useSSL: true,
      timeout: 10,
      onSuccess: () => {
        console.log("✅ Reconectado!");
        clienteMQTT.subscribe(topicoSensor);
        updateConnectionStatus(true);
      },
      onFailure: (err) => {
        console.error("❌ Falha na reconexão:", err);
        updateConnectionStatus(false);
      },
    });
  }, 1000);
}

console.log("🚀 Script carregado. Cliente ID:", clienteId);
