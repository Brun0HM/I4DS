import { StatusBar } from "expo-status-bar";
import {
  Alert,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

/*
 * ===============================================
 * SISTEMA DE TEMAS - BASE PARA OUTROS PROJETOS
 * ===============================================
 *
 * Como funciona:
 * 1. Objeto com duas configurações (light/dark)
 * 2. Estado booleano pra controlar qual usar
 * 3. Aplicar as cores dinamicamente nos componentes
 * 4. Salvar a preferência no AsyncStorage
 */

// PASSO 1: Definir as configurações dos temas
// Sempre use as MESMAS PROPRIEDADES nos dois temas!
const themes = {
  light: {
    // Cores do tema claro
    background: "#e0f7fa", // Fundo principal da tela
    surface: "#ffffff", // Fundo de cards, inputs, etc
    text: "#333333", // Texto principal
    textSecondary: "#666666", // Texto secundário (menos importante)
    textDisabled: "#9e9e9e", // Texto desabilitado/placeholder
    primary: "#009688", // Cor principal dos botões
    secondary: "#00769b", // Cor secundária (títulos, etc)
    border: "#b0bec5", // Bordas de inputs
    borderLight: "rgba(0,0,0,0.1)", // Bordas sutis
  },
  dark: {
    // Cores do tema escuro - MESMAS PROPRIEDADES, cores diferentes
    background: "#121212",
    surface: "#1E1E1E",
    text: "#E0E0E0",
    textSecondary: "#B0B0B0",
    textDisabled: "#757575",
    primary: "#26A69A",
    secondary: "#4FC3F7",
    border: "#444444",
    borderLight: "rgba(255,255,255,0.1)",
  },
};

export default function App() {
  // Estados das tarefas
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // Estado do tema
  const [isDarkMode, setIsDarkMode] = useState(false); // false = light, true = dark

  // Pegar o tema atual baseado no estado
  // Se isDarkMode for true, usa 'dark', senão usa 'light'
  const currentTheme = themes[isDarkMode ? "dark" : "light"];

  /*
   * ===============================================
   * CARREGAMENTO E PERSISTÊNCIA DE DADOS
   * ===============================================
   */

  // useEffect pra carregar dados quando o app inicializa
  useEffect(() => {
    const loadData = async () => {
      try {
        // OTIMIZAÇÃO: Carrega tarefas e tema em PARALELO usando Promise.all
        // Mais eficiente que fazer await em cada um separadamente
        const [savedTasks, savedTheme] = await Promise.all([
          AsyncStorage.getItem("tasks"), // Pega as tarefas salvas
          AsyncStorage.getItem("@theme"), // Pega o tema salvo
        ]);

        // Se existem tarefas salvas, carrega elas
        if (savedTasks) {
          setTasks(JSON.parse(savedTasks));
        }

        // Se existe tema salvo, aplica ele
        // AsyncStorage só salva string, então compara com 'true'
        if (savedTheme !== null) {
          setIsDarkMode(savedTheme === "true");
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };
    loadData();
  }, []); // Array vazio = executa só uma vez quando o componente monta

  // useEffect pra salvar tarefas toda vez que elas mudam
  useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
      } catch (error) {
        console.error("Erro ao salvar tarefas:", error);
      }
    };
    saveTasks();
  }, [tasks]); // Executa toda vez que 'tasks' muda

  // PASSO 4: useEffect pra salvar o tema toda vez que muda
  useEffect(() => {
    // Converte boolean pra string porque AsyncStorage só aceita string
    AsyncStorage.setItem("@theme", isDarkMode.toString());
  }, [isDarkMode]); // Executa toda vez que 'isDarkMode' muda

  /*
   * ===============================================
   * FUNÇÕES DE LÓGICA DE NEGÓCIO
   * ===============================================
   */

  // Função pra adicionar tarefa (mesma lógica original)
  const addTask = () => {
    if (newTask.length > 0) {
      setTasks((prevTasks) => [
        ...prevTasks,
        { id: Date.now().toString(), text: newTask.trim(), completed: false },
      ]);
      setNewTask("");
      Keyboard.dismiss();
    } else {
      Alert.alert("Atenção", "Por favor, digite uma nova tarefa");
    }
  };

  // Função pra marcar/desmarcar tarefa como completa
  // CORREÇÃO DO BUG: teu código tinha 'task.complete' mas o campo é 'completed'
  const toggleTaskComplete = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Função pra deletar tarefa (mesma lógica original)
  const deleteTask = (id) => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir esta tarefa?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () =>
            setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id)),
        },
      ]
    );
  };

  // PASSO 5: Função pra trocar entre temas
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode); // Inverte o valor atual
  };

  /*
   * ===============================================
   * RENDER DA LISTA DE TAREFAS
   * ===============================================
   */

  const renderList = ({ item }) => (
    // PASSO 6: Aplicar cores do tema dinamicamente
    // Usa array de estilos: [estilo_fixo, estilo_dinâmico]
    <View
      style={[
        styles.taskItem,
        {
          backgroundColor: currentTheme.surface, // Fundo dinâmico
          borderColor: currentTheme.borderLight, // Borda dinâmica
        },
      ]}
      key={item.id}
    >
      <TouchableOpacity
        onPress={() => toggleTaskComplete(item.id)}
        style={styles.taskTextContainer}
      >
        <Text
          style={[
            styles.taskText,
            { color: currentTheme.text }, // Cor do texto dinâmica
            item.completed && styles.completedTaskItem, // Aplica estilo se completa
          ]}
        >
          {item.text}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => deleteTask(item.id)}>
        <Text style={styles.taskText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  /*
   * ===============================================
   * RENDER PRINCIPAL
   * ===============================================
   */

  return (
    /* PASSO 7: Container principal com fundo dinâmico */
    <View
      style={[
        styles.container,
        { backgroundColor: currentTheme.background }, // Fundo muda conforme o tema
      ]}
    >
      {/* Top Bar com cores dinâmicas */}
      <View
        style={[
          styles.topBar,
          {
            backgroundColor: currentTheme.surface, // Fundo da barra
            borderBottomColor: currentTheme.borderLight, // Cor da borda inferior
          },
        ]}
      >
        {/* Título com cor dinâmica */}
        <Text
          style={[
            styles.topBarTitle,
            { color: currentTheme.secondary }, // Cor do título
          ]}
        >
          Minhas Tarefas
        </Text>

        {/* PASSO 8: Botão pra trocar tema */}
        <TouchableOpacity onPress={toggleTheme}>
          <Text style={styles.themeIcon}>
            {/* Ícone muda baseado no tema atual */}
            {isDarkMode ? "☀️" : "🌙"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Card do input com cores dinâmicas */}
      <View
        style={[
          styles.card,
          { backgroundColor: currentTheme.surface }, // Fundo do card
        ]}
      >
        {/* Input com múltiplas propriedades dinâmicas */}
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: currentTheme.surface, // Fundo do input
              color: currentTheme.text, // Cor do texto
              borderColor: currentTheme.border, // Cor da borda
            },
          ]}
          placeholder="Adicionar nova tarefa..."
          placeholderTextColor={currentTheme.textDisabled} // Cor do placeholder
          value={newTask}
          onChangeText={setNewTask}
          onSubmitEditing={addTask}
        />

        {/* Botão com cor dinâmica */}
        <TouchableOpacity
          style={[
            styles.addButton,
            { backgroundColor: currentTheme.primary }, // Cor do botão
          ]}
          onPress={addTask}
        >
          <Text style={styles.buttonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de tarefas */}
      <FlatList
        style={styles.FlatList}
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderList}
        ListEmptyComponent={() => (
          /* Texto vazio com cor dinâmica */
          <Text
            style={[
              styles.emptyListText,
              { color: currentTheme.textDisabled }, // Cor do texto vazio
            ]}
          >
            Nenhuma tarefa adicionada ainda.
          </Text>
        )}
        contentContainerStyle={styles.flatListContent}
      />

      <StatusBar style="auto" />
    </View>
  );
}

/*
 * ===============================================
 * ESTILOS - SEM CORES FIXAS
 * ===============================================
 *
 * IMPORTANTE: Remove todas as cores fixas dos estilos!
 * Deixa só: tamanhos, margens, padding, flexbox, etc.
 * As cores são aplicadas dinamicamente no JSX.
 */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor removido - aplicado dinamicamente
  },
  topBar: {
    // backgroundColor removido - aplicado dinamicamente
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    // borderBottomColor removido - aplicado dinamicamente
  },
  topBarTitle: {
    // color removido - aplicado dinamicamente
    fontSize: 24,
    fontWeight: "bold",
  },
  // PASSO 9: Estilo pro ícone do tema
  themeIcon: {
    fontSize: 24,
  },
  card: {
    // backgroundColor removido - aplicado dinamicamente
    margin: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000", // Sombra pode ficar fixa
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  input: {
    // backgroundColor, color, borderColor removidos - aplicados dinamicamente
    borderWidth: 1,
    borderRadius: 15,
    padding: 20,
    fontSize: 18,
    marginBottom: 10,
  },
  addButton: {
    // backgroundColor removido - aplicado dinamicamente
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff", // Cor do texto do botão pode ficar branca sempre
    fontSize: 18,
    fontWeight: "bold",
  },
  flatListContent: {
    paddingBottom: 10,
  },
  taskItem: {
    // backgroundColor, borderColor removidos - aplicados dinamicamente
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 15,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    borderWidth: 1, // CORREÇÃO: tinha "rgba (0,0,0,0.1)" com espaço
  },
  taskTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  taskText: {
    // color removido - aplicado dinamicamente
    fontSize: 18,
    flexWrap: "wrap",
  },
  completedTaskItem: {
    textDecorationLine: "line-through",
    opacity: 0.6,
  },
  emptyListText: {
    // color removido - aplicado dinamicamente
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
});

/*
 * ===============================================
 * RESUMO - COMO USAR EM OUTROS PROJETOS:
 * ===============================================
 *
 * 1. Crie o objeto 'themes' com light/dark
 * 2. Estado: isDarkMode (boolean)
 * 3. Tema atual: themes[isDarkMode ? 'dark' : 'light']
 * 4. Aplique dinamicamente: style={[styles.fixo, {color: currentTheme.text}]}
 * 5. Salve no AsyncStorage: isDarkMode.toString()
 * 6. Carregue: savedTheme === 'true'
 * 7. Botão: onPress={() => setIsDarkMode(!isDarkMode)}
 *
 * SEMPRE MANTENHA:
 * - Mesmas propriedades nos dois temas
 * - Estilos sem cores fixas
 * - Persistência no AsyncStorage
 * - Aplicação dinâmica no JSX
 */
