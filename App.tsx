import React, { useRef, useState } from "react";
import { StyleSheet, View, Text, Button, ScrollView, Image, ImageBackground } from "react-native";
import Enemy, { EnemyHandle } from "./components/Enemy";

function rand1to6() {
  return Math.floor(Math.random() * 6) + 1;
}

function computeHitPoints(strength: number) {
  return Math.floor((rand1to6() - 0.5) * strength);
}

export default function App() {
  const [playerStrength] = useState(3);
  const [playerStamina, setPlayerStamina] = useState(20);
  const [message, setMessage] = useState("Naciśnij 'Runda', aby rozpocząć.");
  const [battleOver, setBattleOver] = useState(false);
  const [round, setRound] = useState(0);

  const enemyTypes = ["Ork", "Goblin", "Troll"] as const;
  const randomEnemy = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];

  const enemyRef = useRef<EnemyHandle | null>(null);

  const onRoundPress = async () => {
    if (battleOver) return;
    setRound((r) => r + 1);

    const playerHit = computeHitPoints(playerStrength);
    const enemyStrength = enemyRef.current?.getStrength() ?? 2;
    const enemyHit = computeHitPoints(enemyStrength);

    let msg = `Runda ${round + 1}\n`;

    const playerFirst = Math.random() > 0.5;

    if (playerFirst) {
      msg += `Atakujesz (${playerHit} dmg).\n`;
      const enemyAlive = await enemyRef.current?.takeDamage(playerHit);

      if (!enemyAlive) {
        msg += "🎉 Wygrana! Wróg pokonany.";
        setMessage(msg);
        setBattleOver(true);
        return;
      }

      msg += `Wróg atakuje (${enemyHit} dmg).\n`;
      if (enemyHit >= playerStamina) {
        setPlayerStamina(0);
        msg += "💀 Przegrana...";
        setBattleOver(true);
      } else {
        setPlayerStamina((prev) => prev - enemyHit);
        msg += `Twoje HP: ${playerStamina - enemyHit}`;
      }
    } else {
      msg += `Wróg atakuje (${enemyHit} dmg).\n`;
      if (enemyHit >= playerStamina) {
        setPlayerStamina(0);
        msg += "💀 Przegrana...";
        setBattleOver(true);
        setMessage(msg);
        return;
      } else {
        setPlayerStamina((prev) => prev - enemyHit);
        msg += `Twoje HP: ${playerStamina - enemyHit}\n`;
      }

      msg += `Atakujesz (${playerHit} dmg).\n`;
      const enemyAlive = await enemyRef.current?.takeDamage(playerHit);
      if (!enemyAlive) {
        msg += "🎉 Wygrana! Wróg pokonany.";
        setBattleOver(true);
      }
    }

    setMessage(msg);
  };

  const onReset = () => {
    setBattleOver(false);
    setPlayerStamina(20);
    setMessage("Nowa walka. Naciśnij 'Runda'!");
    setRound(0);
    enemyRef.current?.reset();
  };

  return (
    <ImageBackground
      source={require("./assets/phon.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>⚔️ Laboratorium 5 — Walka ⚔️</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Twój bohater</Text>
          <Image source={require("./assets/hero.jpg")} style={styles.heroImage} />
          <Text>Siła: {playerStrength}</Text>
          <Text>Wytrzymałość: {playerStamina}</Text>
        </View>

        <Enemy
          ref={enemyRef}
          strength={2}
          initialStamina={12}
          enemyType={randomEnemy}
        />

        <View style={styles.buttons}>
          <Button title="Runda" onPress={onRoundPress} disabled={battleOver} />
          <View style={{ height: 10 }} />
          <Button title="Reset" onPress={onReset} />
        </View>

        <View style={styles.messageBox}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
    color: "#fff",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  section: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontWeight: "600",
    fontSize: 18,
    marginBottom: 6,
  },
  heroImage: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 10,
    backgroundColor: "transparent",
  },
  buttons: {
    width: "100%",
    marginTop: 10,
    marginBottom: 20,
  },
  messageBox: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  messageText: { fontSize: 16, lineHeight: 22 },
});

