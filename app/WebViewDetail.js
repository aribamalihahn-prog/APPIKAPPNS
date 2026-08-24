import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WebViewDetail() {
  const { title, content } = useLocalSearchParams();

  const htmlContent = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body {
            background-color: #eaf4ff;
            margin: 0;
            padding: 16px;
            font-family: sans-serif;
          }
          .box {
            background: #fff;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }
          h1 {
            font-size: 22px;
            color: #005b96;
            margin-bottom: 16px;
          }
          p {
            font-size: 16px;
            line-height: 24px;
            color: #333;
            margin-bottom: 14px;
          }
          img {
            max-width: 100%;
            height: auto;
            margin-bottom: 16px;
          }
        </style>
      </head>
      <body>
        <div class="box">
          <h1>${title || ""}</h1>
          ${content || ""}
        </div>
      </body>
    </html>
  `;

  return (
    <View style={{ flex: 1 }}>
       <SafeAreaView style={{ backgroundColor: "#005b96" }}>
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        backgroundColor: "#005b96",
      }}
    >
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={26} color="#fff" />
      </TouchableOpacity>

      <Text
        style={{
          marginLeft: 15,
          fontSize: 18,
          color: "#fff",
          fontWeight: "bold",
        }}
      >
        Detail Berita
      </Text>
    </View>
  </SafeAreaView>

      <WebView
        originWhitelist={["*"]}
        source={{ html: htmlContent }}
        style={{ flex: 1 }}
      />
    </View>
  );
}
