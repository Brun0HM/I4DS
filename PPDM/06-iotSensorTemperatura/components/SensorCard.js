import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../hooks/useTheme";

const SensorCard = (props) => {
  const styles = createStyles(useTheme());

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.icon}>
          <Text style={styles.iconText}>{props.icon}</Text>
        </View>
        <Text style={styles.cardTitle}>{props.title}</Text>
      </View>
      <View style={styles.valueDisplay}>
        <Text style={styles.cardText}>
          {props.value !== null ? props.value.toFixed(1) : "--"}
        </Text>
        <Text style={styles.cardText}>{props.unit}</Text>
      </View>
      <View style={styles.progressBar}>
        <View style={styles.progressFill} />
      </View>
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={[styles.cardText, styles.minima]}>Mínima</Text>
          <Text style={styles.cardText}>
            {props.min !== null
              ? `${props.min.toFixed(1)}${props.unit}`
              : `--${props.unit}`}
          </Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.maxima}>Máxima</Text>
          <Text style={styles.cardText}>
            {props.max !== null
              ? `${props.max.toFixed(1)}${props.unit}`
              : `--${props.unit}`}
          </Text>
        </View>
      </View>
    </View>
  );
};

const createStyles = (theme) =>
  StyleSheet.create({
    card: {
      flex: 1,
      backgroundColor: theme.card,
      padding: 20,
      justifyContent: "center",
      marginTop: 10,
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 15,
    },
    icon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.primary || "#007AFF",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 10,
    },
    cardText: {
      color: theme.text,
    },
    iconText: {
      fontSize: 24,
      textAlign: "center",
      color: "#fff",
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.text,
    },
    valueDisplay: {
      flexDirection: "row",
      justifyContent: "center",
      marginVertical: 10,
    },
    progressBar: {
      height: 6,
      backgroundColor: theme.border || "#e0e0e0",
      borderRadius: 3,
      marginBottom: 15,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: theme.primary || "#007AFF",
      width: "70%",
      borderRadius: 3,
    },
    stats: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    stat: {
      flex: 1,
      alignItems: "center",
    },
    minima: {
      color: "#00aaff",
      fontWeight: "bold",
    },
    maxima: {
      fontWeight: "bold",
      color: "#ff0055",
    },
  });

export default memo(SensorCard);
