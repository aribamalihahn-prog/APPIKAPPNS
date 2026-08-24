import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import { useNavigation } from "@react-navigation/native";

export default function ADARTIKA() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView style={{ backgroundColor: "#fff" }}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#005b96" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AD ART IKA</Text>
      </View>
      </SafeAreaView>


      {/* WebView untuk menampilkan PDF */}
      <WebView
        source={{
          uri: "https://ika.ppns.ac.id/wp-content/uploads/2018/09/ADART-Yayasan-Pinisi.pdf",
        }}
        startInLoadingState
        renderLoading={() => (
          <ActivityIndicator
            size="large"
            color="#005b96"
            style={styles.loader}
          />
        )}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scalesPageToFit={true}
        showsHorizontalScrollIndicator={true}
        showsVerticalScrollIndicator={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#005b96",
  },
  loader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -20 }, { translateY: -20 }],
  },
});
