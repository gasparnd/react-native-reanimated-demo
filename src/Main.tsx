import React, {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  useAnimatedGestureHandler,
} from "react-native-reanimated";
import {
  TapGestureHandler,
  PanGestureHandler,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

const Button = ({ text, onPress }: { text: string; onPress: () => void }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingVertical: "3%",
        paddingHorizontal: "7%",
        borderRadius: 8,
        backgroundColor: "cyan",
        marginVertical: 20,
      }}
    >
      <Text style={{ textAlign: "center" }}>{text}</Text>
    </TouchableOpacity>
  );
};

const Main = () => {
  const SharedValues = () => {
    const randomWidth = useSharedValue(10);

    const config = {
      duration: 500,
    };

    const myStyle = useAnimatedStyle(() => {
      return {
        width: withTiming(randomWidth.value, config),
      };
    });

    return (
      <>
        <Text style={styles.title}>Shared Value</Text>
        <Animated.View
          style={[myStyle, { height: 40, backgroundColor: "#4682b4" }]}
        />

        <Button
          text="Toggle"
          onPress={() => (randomWidth.value = Math.random() * 350)}
        />
      </>
    );
  };

  const Box = () => {
    const offset = useSharedValue(0);

    const animatedStyles = useAnimatedStyle(() => {
      return { transform: [{ translateX: offset.value * 300 }] };
    });

    const customSpringStyles = useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateX: withSpring(offset.value * 300, {
              damping: 40,
              stiffness: 90,
            }),
          },
          {
            rotate: withSpring(`${offset.value * 400}deg`),
          },
        ],
      };
    });

    return (
      <>
        <Text style={styles.title}>Default spring</Text>
        <Animated.View style={[animatedStyles, styles.box]} />

        <Text style={styles.title}>Custom spring</Text>
        <Animated.View style={[customSpringStyles, styles.box]} />
        <Button
          text="Move"
          onPress={() => (offset.value = withSpring(Math.random()))}
        />
      </>
    );
  };

  const WoobleExample = () => {
    const rotation = useSharedValue(0);

    const animatedStyles = useAnimatedStyle(() => {
      return {
        transform: [{ rotateZ: `${rotation.value}deg` }],
      };
    });

    return (
      <>
        <Text style={styles.title}>Modifires</Text>

        <View style={{ flexDirection: "row" }}>
          <Animated.View
            style={[animatedStyles, styles.box, { backgroundColor: "#f29339" }]}
          />
          <Animated.View
            style={[animatedStyles, styles.box, { backgroundColor: "#181818" }]}
          />
          <Animated.View
            style={[animatedStyles, styles.box, { backgroundColor: "#fb607f" }]}
          />
        </View>

        <Button
          text="Wooble"
          onPress={() =>
            // (rotation.value = withRepeat(withTiming(40), 12, true))
            (rotation.value = withSequence(
              withTiming(-10, { duration: 10 }),
              withRepeat(withTiming(25, { duration: 100 }), 12, true),
              withTiming(0, { duration: 50 })
            ))
          }
        />
      </>
    );
  };

  const EventsExample = () => {
    const startingPosition = 100;
    const x = useSharedValue(startingPosition);
    const y = useSharedValue(startingPosition);

    const pressed = useSharedValue(false);
    const pressed2 = useSharedValue(false);

    const eventHandler = useAnimatedGestureHandler({
      onStart: (event, ctx) => {
        pressed.value = true;
      },
      onEnd: (event, ctx) => {
        pressed.value = false;
      },
    });

    const eventHandler2 = useAnimatedGestureHandler({
      onStart: (event, ctx: any) => {
        pressed2.value = true;
        ctx.startX = x.value;
        ctx.startY = y.value;
      },
      onActive: (event, ctx) => {
        x.value = ctx.startX + event.translationX;
        y.value = ctx.startY + event.translationY;
      },
      onEnd: (event, ctx) => {
        pressed2.value = false;
        x.value = withSpring(startingPosition);
        y.value = withSpring(startingPosition);
      },
    });

    const uas = useAnimatedStyle(() => {
      return {
        backgroundColor: pressed.value ? "#181818" : "gray",
        transform: [{ scale: withSpring(pressed.value ? 2 : 1) }],
      };
    });

    const uas2 = useAnimatedStyle(() => {
      return {
        backgroundColor: pressed2.value ? "#FEEF86" : "#001972",
        transform: [{ translateX: x.value }, { translateY: y.value }],
      };
    });

    return (
      <View style={{ paddingBottom: 300 }}>
        <Text style={styles.title}>Events</Text>

        <TapGestureHandler onGestureEvent={eventHandler}>
          <Animated.View style={[uas, styles.ball]} />
        </TapGestureHandler>

        <PanGestureHandler onGestureEvent={eventHandler2}>
          <Animated.View style={[uas2, styles.ball]} />
        </PanGestureHandler>
      </View>
    );
  };

  return (
    <GestureHandlerRootView>
      <ScrollView>
        <View style={{ paddingHorizontal: "4%" }}>
          <SharedValues />

          <Box />

          <WoobleExample />

          <EventsExample />
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  box: { height: 80, width: 80, borderRadius: 20, backgroundColor: "purple" },
  ball: { height: 40, width: 40, borderRadius: 100, backgroundColor: "gray" },
});

export default Main;
