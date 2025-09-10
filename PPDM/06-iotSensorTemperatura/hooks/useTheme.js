import { useColorScheme } from "react-native";
import { darkTheme } from "../themes/dark";
import { lightTheme } from "../themes/light";

export const useTheme = () => {
  const scheme = useColorScheme(); //O useColorScheme é uma propriedade própria do React, que armazena uma string dizendo se o tema está claro ou escuro ("light"/"dark")

  return scheme === "dark" ? darkTheme : lightTheme; // Após armazenar a string do useColorScheme na const 'scheme', faz uma verificação, se a string armazenada no 'scheme' for igual a "dark", o tema utilizado será o darkTheme. se não, será usado o lightTHeme
};
