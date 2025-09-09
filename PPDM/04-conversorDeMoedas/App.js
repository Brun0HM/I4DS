import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const lightTheme = {
  background: "#f0f0f0",
  card: "#ffffff",
  text: "#212121",
  label: "#555",
  border: "#ccc",
  buttonPrimary: "#007bff",
  buttonDanger: "#dc3545",
  result: "#007",
  infobg: "#ffffff",
  infoBorder: "#eee",
};
const darkTheme = {
  background: "#121212",
  card: "#1e1e1e",
  text: "#f5f5f5",
  label: "#aaaaaa",
  border: "#444",
  buttonPrimary: "#3399ff",
  buttonDanger: "#dc3545",
  result: "#66ccff",
  infobg: "#1e1e1e",
  infoBorder: "#333",
};

const COTACAO_DOLAR = 5.43;
const COTACAO_EURO = 6.37;

export default function App() {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;
  const styles = createStyles(theme);

  const [valorEmReais, setValorEmReais] = useState("");
  const [valorDolar, setValorDolar] = useState("0");
  const [valorEuro, setValorEuro] = useState("0");
  const [showResults, setShowResults] = useState(false);

  const handleClear = () => {
    setValorEmReais("");
    setValorDolar(0);
    setValorEuro(0);
    setShowResults(false);
    Keyboard.dismiss();
  };

  const handleChange = (text) => {
    const cleanedText = text.replace(/[^0-9.]/g, "");
    setValorEmReais(cleanedText);
    setShowResults(false);
  };

  const convertCurrency = () => {
    Keyboard.dismiss();

    const amountInReais = parseFloat(valorEmReais || "0");

    const convertedDolar = amountInReais / COTACAO_DOLAR;
    const convertedEuro = amountInReais / COTACAO_EURO;

    setValorDolar(convertedDolar.toFixed(2));
    setValorEuro(convertedEuro.toFixed(2));
    setShowResults(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Conversor de Moedas</Text>

      <View style={styles.card}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Valor em R$</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            placeholderTextColor={scheme === "dark" ? "#AAA" : "#888"}
            keyboardType="numeric"
            value={valorEmReais}
            onChangeText={handleChange}
          />
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.button} onPress={convertCurrency}>
            <Text style={styles.buttonText}>Converter</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.clearButton]}
            onPress={handleClear}
          >
            <Text style={styles.buttonText}>Limpar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showResults && (
        <View style={styles.card}>
          <Text style={styles.resultTitle}>Resultados da Conversão</Text>

          <Text style={styles.convertedValueText}>
            <Text style={{ fontWeight: "bold" }}>R$ {valorEmReais}</Text>
            <Text> equivalem a:</Text>
          </Text>
          <Text style={styles.finalResultText}>
            <Text style={{ fontWeight: "bold" }}>$</Text> {valorDolar} Dólares
          </Text>

          <Text style={styles.finalResultText}>
            <Text style={{ fontWeight: "bold" }}>€</Text> {valorEuro} Euros
          </Text>
        </View>
      )}
      <View style={styles.cotacaoInfoContainer}>
        <Text style={styles.containerInfoTitle}>Cotações Fixas:</Text>
        <Text style={styles.containerInfoText}>
          1 USD: R$ {COTACAO_DOLAR.toFixed(2)}
        </Text>
        <Text style={styles.containerInfoText}>
          1 EUR: R$ {COTACAO_EURO.toFixed(2)}
        </Text>
      </View>
    </View>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 20,
      justifyContent: "center",
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.text,
      textAlign: "center",
      marginBottom: 30,
    },
    card: {
      backgroundColor: theme.card,
      borderRadius: 10,
      padding: 20,
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,
    },
    inputContainer: {
      marginBottom: 15,
    },
    inputLabel: {
      fontSize: 16,
      color: theme.label,
      marginBottom: 5,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      padding: 12,
      fontSize: 18,
      textAlign: "right",
      color: theme.text,
    },
    buttonGroup: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginTop: 10,
    },
    button: {
      backgroundColor: theme.buttonPrimary,
      padding: 12,
      borderRadius: 8,
      alignItems: "center",
      flex: 1,
      marginHorizontal: 5,
    },
    clearButton: {
      backgroundColor: theme.buttonDanger,
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    resultTitle: {
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 10,
      color: theme.text,
    },
    convertedValueText: {
      fontSize: 16,
      textAlign: "center",
      marginBottom: 5,
      color: theme.label,
    },
    finalResultText: {
      fontSize: 22,
      fontWeight: "bold",
      textAlign: "center",
      marginTop: 10,
      color: theme.result,
    },
    cotacaoInfoContainer: {
      marginTop: 20,
      padding: 15,
      borderTopWidth: 1,
      borderTopColor: theme.infoBorder,
      alignItems: "center",
      backgroundColor: theme.infobg,
      borderRadius: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 2,
      elevation: 3,
    },
    containerInfoTitle: {
      fontSize: 15,
      fontWeight: "bold",
      marginBottom: 5,
      color: theme.text,
    },
    containerInfoText: {
      fontSize: 14,
      color: theme.label,
    },
  });
