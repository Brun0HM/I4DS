import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import SensorCard from "./components/SensorCard";
import { useTheme } from "./hooks/useTheme";
import mqtt from "mqtt";

// Polyfills para mqtt.js funcionar no React Native/Expo
import { Buffer } from "buffer";
import process from "process";
import { decode, encode } from "base-64";

if (!global.Buffer) global.Buffer = Buffer;
if (!global.process) global.process = process;
if (!global.atob) global.atob = decode;
if (!global.btoa) global.btoa = encode;

export default function App() {
  const styles = createStyles(useTheme());

  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [tempMin, setTempMin] = useState(null);
  const [tempMax, setTempMax] = useState(null);
  const [humMin, setHumMin] = useState(null);
  const [humMax, setHumMax] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Configuração MQTT usando mqtt.js (WebSocket)
  const MQTT_URL = "ws://broker.hivemq.com:8000/mqtt";
  const MQTT_TOPIC = "profcastello/temperatura";
  const mqttClient = useRef(null);
  // ...duplicado, removido...

  useEffect(() => {
    console.log(
      `🔌 Tentando conectar ao broker MQTT (mqtt.js) em: ${MQTT_URL}`
    );
    const client = mqtt.connect(MQTT_URL);
    mqttClient.current = client;

    client.on("connect", () => {
      setIsConnected(true);
      client.subscribe(MQTT_TOPIC);
      console.log("✅ Conectado ao broker MQTT (mqtt.js)!");
    });

    client.on("message", (topic, message) => {
      try {
        const data = JSON.parse(message.toString());
        if (
          typeof data.temperatura === "number" &&
          typeof data.umidade === "number"
        ) {
          updateSensorData(data.temperatura, data.umidade);
        } else {
          console.log(
            "Mensagem recebida não contém dados esperados:",
            message.toString()
          );
        }
      } catch (e) {
        console.log("Mensagem recebida não é JSON válido:", message.toString());
      }
    });

    client.on("error", (err) => {
      setIsConnected(false);
      console.log("❌ Erro MQTT:", err.message);
      Alert.alert("Erro MQTT", err.message);
    });

    client.on("close", () => {
      setIsConnected(false);
      console.log("Conexão MQTT fechada.");
    });

    return () => {
      client.end(true, () => {
        console.log("MQTT desconectado.");
      });
    };
  }, []);

  const updateSensorData = (temp, hum) => {
    setTemperature(temp);
    if (tempMin === null || temp < tempMin) setTempMin(temp);
    if (tempMax === null || temp > tempMax) setTempMax(temp);

    setHumidity(hum);
    if (humMin === null || hum < humMin) setHumMin(hum);
    if (humMax === null || hum > humMax) setHumMax(hum);

    setTemperatureData((prev) => {
      const newData = [...prev, temp];
      return newData.length > 10 ? newData.slice(-10) : newData;
    });
    setLastUpdate(newDate());
  };

  const getTemperatureProgress = () => {
    if (temperature === null) return 0;
    return Math.max(0, Math.min(100, ((temperature + 10) / 60) * 100));
  };

  const getHumidityProgress = () => {
    return humidity || 0;
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      console.log("🔄 Atualizando dados...");
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } catch (error) {
      console.error("Erro durante refresh:", error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <ScrollView
        contentContainerStyle={[styles.scrollContainer, { paddingTop: 70 }]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={"#8faaff"}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🌡️ Dashboard IoT</Text>
          <View style={[styles.connectionStatus, { marginTop: 10 }]}>
            <Text style={styles.connectionText}>
              {isConnected ? "🟢 Conectado" : "🔴 Desconectado"}
            </Text>
          </View>
        </View>

        <View style={styles.tabela}>
          <SensorCard
            title="Temperatura"
            value={temperature}
            unit="°C"
            icon="🌡️"
            progress={getTemperatureProgress()}
            min={tempMin}
            max={tempMax}
          />
        </View>
        <View style={styles.tabela}>
          <SensorCard
            title="Umidade"
            value={humidity}
            unit="%"
            icon="💧"
            progress={getHumidityProgress()}
            min={humMin}
            max={humMax}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      alignItems: "center",
      justifyContent: "center",
    },
    tabela: {
      marginBottom: 20,
      padding: 20,
      paddingEnd: 60,
      paddingStart: 60,
      borderRadius: 15,
      backgroundColor: theme.card,
      width: "100%",
    },
    headerTitle: {
      fontSize: 36,
      fontWeight: "bold",
      color: theme.text,
    },
    connectionText: {
      textAlign: "center",
      marginBottom: 10,
      color: theme.text,
      fontSize: 16,
      fontWeight: "bold",
    },
  });
