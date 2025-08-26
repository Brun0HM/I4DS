// importa os módulos necessarios do Reacy e React native

import { StyleSheet, Text, View } from "react-native";

//Define o componente principal a aplicação "APP"

export default function App() {
  //O componente retorna uma estrutura de UI (Interface de Usuario) em JSX
  return (
    //'View é um container flexivel, equivalente a uma <div>
    <View style={styles.container}>
      {/* {Text é um componenta para utilização de texto} */}
      <Text style={styles.title}>Meu primeiro App</Text>
      {/* {Outro componente de texto} */}
      <Text style={styles.subtitle}>Bem-vindo ao React-Native</Text>
    </View>
  );
}

//Cria objetos de estilos usando a API 'StylesSheet'
//Isso otimiza o desempenho e facilita a organização dos estilos

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#131313",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "red",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#d9d9d9",
  },
});
