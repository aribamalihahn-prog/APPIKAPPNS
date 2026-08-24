import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { formatRupiah } from "../../utils/formatRupiah";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function DonationCard() {
  const [donasi, setDonasi] = useState([]);

  useEffect(() => {
    fetchDonasi();
  }, []);

  const fetchDonasi = async () => {
    try {
      // 1. Ambil semua event
      const eventRes = await axios.get(
        "http://192.168.50.150:8080/IKAPPNS/api/sum_get_donation_by_event_id.php"
      );

      // console.log(eventRes.data.data);
      

      const events = eventRes.data.data;
      // let result = [];

      // // 2. Loop tiap event → ambil donasinya
      // for (const ev of events) {
      //   const donasiRes = await axios.get(
      //     `http://192.168.50.241:8080/IKAPPNS/api/get_donation_by_event_id.php?event_id=${ev.id}`
      //   );

      //   const listDonatur = donasiRes.data.data || [];

      //   // 3. Hitung totalnya
      //   const total = listDonatur.reduce(
      //     (sum, d) => sum + Number(d.amount_donation),
      //     0
      //   );

      //   result.push({
      //     event_id: ev.id,
      //     event_name: ev.event_name,
      //     poster: ev.poster,
      //     target: ev.target,
      //     event_date: ev.event_date,
      //     total_donasi: total,          
      //   });
      // }

      setDonasi(events);
    } catch (error) {
      console.log("Gagal load donasi:", error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      // onPress={() =>
      //   router.push({
      //     pathname: "DonasiDetail",
      //     params: { id: item.event_id },
      //   })
      // }
    >
      <Image
        source={{
          uri:
            "http://192.168.50.150:8080/IKAPPNS/uploads/event/" +
            item.img_poster,
        }}
        style={styles.image}
      />

      {/* NAMA EVENT */}
      <View style={{paddingHorizontal:12}}>
    <Text style={styles.title}>{item.event_name}</Text>

    <Text>📅 {item.date}</Text>
    <Text>👥 Donatur: {item.donatur_count || 0} orang
    </Text>
    {/* TOTAL DONASI */}
    <View>
      <Text style={styles.amountLabel}>Terkumpul</Text>
      <Text style={styles.amount}> {formatRupiah(item.total_donation)}</Text>
    </View>
    </View>
  </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={donasi}
        keyExtractor={(item) => item.event_id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#eef3ff" },
  list: { padding: 16 },

  date: {
  fontSize: 12,
  color: "#555",
  marginTop: 4,
  paddingHorizontal: 12,
},


  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingBottom: 12,
    marginBottom: 18,
    overflow: "hidden",
    elevation: 4,
  },

  image: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },

  amountBox: {
    paddingHorizontal: 12,
    marginTop: 6,
  },

  amountLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },

  amount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#005b96",
  },

  target: {
    paddingHorizontal: 12,
    marginTop: 4,
    fontSize: 12,
    color: "#444",
  },

  progressBackground: {
    width: "94%",
    height: 10,
    backgroundColor: "#d0d7e6",
    borderRadius: 10,
    marginTop: 10,
    marginLeft: 12,
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#005b96",
    borderRadius: 10,
  },
});
