import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";

export default function App() {
  const [contador, setContador] = useState(0);
  const [contador2, setContador2] = useState(0);

  const handleIncrement = () => {
    setContador(contador + 1);
  };

  const handleIncrement2 = () => {
    setContador2(contador2 + 1);
  };

  const handleTruco = () => {
    setContador(contador + 3);
  };

  const handleTruco2 = () => {
    setContador2(contador2 + 3);
  };

  const handleDecrement = () => {
    contador > 0 && setContador(contador - 1);
  };

  const handleDecrement2 = () => {
    contador2 > 0 && setContador2(contador2 - 1);
  };

  const handleReset = () => {
    setContador(0);
    setContador2(0);
  };

  const checkWinner = () => {
    if (contador >= 12 || contador2 >= 12) {
      Alert.alert(
        "Atenção",
        `${contador > contador2 ? "NÓS VENCEMOS" : "ELES VENCERAM"}!`
      );
      handleReset();
    }
  };

  useEffect(() => {
    checkWinner();
  }, [contador, contador2]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contador de truco</Text>

      <View style={styles.invertedSection}>
        <Text style={styles.counterText}>{contador2}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.buttonTruco} onPress={handleTruco2}>
            <Text style={styles.buttonText}>TRUCO!</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleIncrement2}>
            <Text style={styles.buttonText}>Aumentar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleDecrement2}>
            <Text style={styles.buttonText}>Diminuir</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={[styles.time, styles.invertedSection]}>Eles</Text>

      <Text style={styles.time}>Nós</Text>
      <Text style={styles.counterText}>{contador}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonTruco} onPress={handleTruco}>
          <Text style={styles.buttonText}>TRUCO!</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleIncrement}>
          <Text style={styles.buttonText}>Aumentar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleDecrement}>
          <Text style={styles.buttonText}>Diminuir</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleReset}>
        <Text style={styles.resetButton}>Reiniciar jogo</Text>
      </TouchableOpacity>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#131313",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },

  title: {
    fontSize: 35,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
  },

  time: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#d9d9d9",
    marginTop: 20,
    marginBottom: 20,
  },

  counterText: {
    fontSize: 64,
    fontWeight: "bold",
    color: "#d9d9d9",
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#007bff",
    padding: 20,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 4,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },

  buttonTruco: {
    backgroundColor: "#28a745",
    padding: 20,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 4,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "medium",
    textAlign: "center",
  },

  buttonContainer: {
    flexDirection: "row",
    marginBottom: 20,
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },

  resetButton: {
    color: "#fff",
    fontWeight: "medium",
    backgroundColor: "#dc3545",
    padding: 20,
    borderRadius: 10,
  },

  invertedSection: {
    transform: [{ rotate: "180deg" }], // Inverte a seção
    alignItems: "center", // Mantém alinhado
  },
});
