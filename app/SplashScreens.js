import React, { useEffect, useRef  } from 'react';
import { View, Text, Image, StyleSheet, Animated, Easing, Dimensions} from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function SplashScreens() {
  const router = useRouter();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    // Animasi fade-in dan scale
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Setelah animasi selesai, pindah ke halaman CreateAccount
    const timer = setTimeout(() => {
      router.replace('login');
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.card,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image
          source={require('../src/assets/images/logoppns.png')}
          style={styles.logo}
          resizeMode="contain" 
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6, 
  },
  logo: {
    width: width * 0.45,
    height:width * 0.45,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 18,
    color: '#000',
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',
  },
});
