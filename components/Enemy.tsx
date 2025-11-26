import React, { forwardRef, useImperativeHandle, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";

export type EnemyHandle = {
  takeDamage: (damage: number) => Promise<boolean>;
  getStrength: () => number;
  reset: () => void;
};

type EnemyProps = {
  strength: number;
  initialStamina: number;
  enemyType: "Ork" | "Goblin" | "Troll";
};

const enemyImages = {
  Ork: require("../assets/orc.jpg"),
  Goblin: require("../assets/goblin.png"),
  Troll: require("../assets/troll.jpg"),
};

const Enemy = forwardRef<EnemyHandle, EnemyProps>(
  ({ strength, initialStamina, enemyType }, ref) => {
    const [stamina, setStamina] = useState(initialStamina);

    useImperativeHandle(ref, () => ({
      async takeDamage(damage: number) {
        return new Promise<boolean>((resolve) => {
          setStamina((prev) => {
            const newStamina = prev - damage;
            const alive = newStamina > 0;
            setTimeout(() => resolve(alive), 500);
            return Math.max(newStamina, 0);
          });
        });
      },
      getStrength: () => strength,
      reset: () => setStamina(initialStamina),
    }));

    return (
      <View style={styles.container}>
        <Text style={styles.name}>👾 {enemyType}</Text>
        <Image source={enemyImages[enemyType]} style={styles.image} />
        <Text>Siła: {strength}</Text>
        <Text>Wytrzymałość: {stamina}</Text>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  name: {
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 8,
  },
  image: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 10,
    backgroundColor: "transparent",
  },
});

export default Enemy;
