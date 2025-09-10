import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";

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

export default function App() {
  // Hook do React Native que detecta o tema do sistema
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;
  const styles = createStyles(theme);

  const [display, setDisplay] = useState("0"); // O que aparece na tela
  const [operacao, setOperacao] = useState(null); // Qual operação tá ativa (+, -, ×, ÷)
  const [valorAnterior, setValorAnterior] = useState(null); // Primeiro número da conta
  const [aguardandoOperacao, setAguardandoOperacao] = useState(false); // Se acabou de apertar uma operação

  /**
   * Função que adiciona um número no display
   * @param {number} num - O número que foi clicado (0-9)
   *
   * Como funciona:
   * - Se acabou de apertar uma operação, substitui o display
   * - Senão, adiciona o número no final (concatena)
   * - Evita começar com vários zeros (ex: 0000123)
   */
  const inputNumero = (num) => {
    if (aguardandoOperacao) {
      // Acabou de apertar +, -, etc. Começa um número novo
      setDisplay(String(num));
      setAguardandoOperacao(false);
    } else {
      // Tá digitando um número normal, vai concatenando
      setDisplay(display === "0" ? String(num) : display + num);
    }
  };

  /**
   * Função que processa operações (+, -, ×, ÷)
   * @param {string} novaOperacao - A operação clicada
   *
   * Como funciona:
   * - Se é a primeira operação, só guarda o número atual
   * - Se já tinha uma operação pendente, executa ela primeiro
   * - Depois prepara pra próxima operação
   */
  const inputOperacao = (novaOperacao) => {
    const valorAtual = parseFloat(display); // Converte o texto em número

    if (valorAnterior === null) {
      // Primeira operação: 5 + (guarda o 5)
      setValorAnterior(valorAtual);
    } else if (operacao) {
      // Já tinha operação: 5 + 3 * (executa 5+3, depois guarda pra próxima)
      const resultado = calcular();
      setDisplay(String(resultado));
      setValorAnterior(resultado);
    }

    // Prepara pra receber o próximo número
    setAguardandoOperacao(true);
    setOperacao(novaOperacao);
  };

  /**
   * Função que faz o cálculo matemático
   * @returns {number} - Resultado da operação
   *
   * Pega valorAnterior [operacao] display e faz a conta
   * Ex: valorAnterior=5, operacao="+", display="3" = 5+3 = 8
   */
  const calcular = () => {
    const anterior = valorAnterior; // Primeiro número
    const atual = parseFloat(display); // Segundo número (convertido)

    // Se não tem conta pra fazer, retorna o número atual
    if (anterior === null || operacao === null) {
      return atual;
    }

    // Faz a conta baseada na operação
    switch (operacao) {
      case "+":
        return anterior + atual; // Soma
      case "-":
        return anterior - atual; // Subtração
      case "×":
        return anterior * atual; // Multiplicação
      case "÷":
        // Divisão com proteção contra divisão por zero
        return atual !== 0 ? anterior / atual : 0;
      default:
        return atual; // Se der merda, retorna o número atual
    }
  };

  /**
   * Função do botão de igual (=)
   * Executa a conta e mostra o resultado
   */
  const handleIgual = () => {
    const resultado = calcular(); // Faz a conta
    setDisplay(String(resultado)); // Mostra o resultado na tela

    // Reseta tudo pra próxima conta
    setValorAnterior(null);
    setOperacao(null);
    setAguardandoOperacao(true);
  };

  /**
  Função zerar
   */
  const handleZerar = () => {
    setDisplay("0");
    setValorAnterior(null);
    setOperacao(null);
    setAguardandoOperacao(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <View>
        <Text style={styles.title}>Calculadora</Text>
      </View>

      {/* Display que mostra os números */}
      <View style={styles.inputContainer}>
        <Text style={styles.title}>{display}</Text>
      </View>

      {/* LINHA 1: Botões 1, 2, 3, - */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity onPress={() => inputNumero(1)} style={styles.button}>
          <Text style={styles.buttonText}>1</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => inputNumero(2)} style={styles.button}>
          <Text style={styles.buttonText}>2</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => inputNumero(3)} style={styles.button}>
          <Text style={styles.buttonText}>3</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => inputOperacao("-")}
          style={styles.opButton}
        >
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
      </View>

      {/* LINHA 2: Botões 4, 5, 6, + */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity onPress={() => inputNumero(4)} style={styles.button}>
          <Text style={styles.buttonText}>4</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => inputNumero(5)} style={styles.button}>
          <Text style={styles.buttonText}>5</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => inputNumero(6)} style={styles.button}>
          <Text style={styles.buttonText}>6</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => inputOperacao("+")}
          style={styles.opButton}
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* LINHA 3: Botões 7, 8, 9, = */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity onPress={() => inputNumero(7)} style={styles.button}>
          <Text style={styles.buttonText}>7</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => inputNumero(8)} style={styles.button}>
          <Text style={styles.buttonText}>8</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => inputNumero(9)} style={styles.button}>
          <Text style={styles.buttonText}>9</Text>
        </TouchableOpacity>
        {/* Botão de igual - executa a conta */}
        <TouchableOpacity onPress={handleIgual} style={styles.opButton}>
          <Text style={styles.buttonText}>=</Text>
        </TouchableOpacity>
      </View>

      {/* LINHA 4: Botões ÷, 0, ×, C */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          onPress={() => inputOperacao("÷")}
          style={styles.opButton}
        >
          <Text style={styles.buttonText}>÷</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => inputNumero(0)} style={styles.button}>
          <Text style={styles.buttonText}>0</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => inputOperacao("×")}
          style={styles.opButton}
        >
          <Text style={styles.buttonText}>×</Text>
        </TouchableOpacity>
        {/*limpa tudo */}
        <TouchableOpacity onPress={handleZerar} style={styles.opButton}>
          <Text style={styles.buttonText}>C</Text>
        </TouchableOpacity>
      </View>
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

    title: {
      color: theme.text,
      fontSize: 30,
      fontWeight: "bold",
    },

    inputContainer: {
      marginBottom: 15,
    },

    input: {
      backgroundColor: theme.card,
      borderRadius: 8,
      padding: 12,
      fontSize: 18,
      textAlign: "right",
      color: theme.text,
    },

    card: {
      backgroundColor: theme.card,
      borderRadius: 10,
      paddingEnd: 180,
      paddingStart: 180,
      paddingTop: 20,
      paddingBottom: 20,
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,
    },

    buttonGroup: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginTop: 10,
    },

    button: {
      backgroundColor: theme.buttonPrimary,
      padding: 25,
      paddingHorizontal: 35,
      borderRadius: 8,
      alignItems: "center",
      marginHorizontal: 5,
    },

    buttonText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
    },

    opButton: {
      backgroundColor: theme.buttonDanger,
      padding: 25,
      paddingHorizontal: 35,
      borderRadius: 8,
      alignItems: "center",
      marginHorizontal: 5,
    },
  });
