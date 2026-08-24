import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  Modal,
} from "react-native";
import axios from "axios";
import DateTimePicker from '@ericboles/react-native-ui-datepicker';
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MaskedTextInput } from "react-native-mask-text";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

export default function Donation() {
  const navigation = useNavigation();
  const route = useRoute();

  // Ambil event_id dari route
  const { event_id } = route.params;
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());


  const [form, setForm] = useState({
    name: "",
    program_study: "",
    force_year: "",
    amount_donation: "",
    goals: "",
    payment_proof: null,
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  // PILIH GAMBAR
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Izin Ditolak", "Akses galeri diperlukan!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setForm({ ...form, payment_proof: result.assets[0].uri });
    }
  };

  // SIMPAN DATA
  const handleSave = async () => {
    if (
      !form.name ||
      !form.program_study ||
      !form.force_year ||
      !form.amount_donation ||
      !form.goals
    ) {
      Alert.alert("Data Belum Lengkap", "Harap isi semua data!");
      return;
    }

    if (!form.payment_proof) {
      Alert.alert("Error", "Bukti pembayaran wajib diupload!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("event_id", event_id);
      formData.append("name", form.name);
      formData.append("program_study", form.program_study);
      formData.append("force_year", form.force_year);
      formData.append("amount_donation", form.amount_donation);
      formData.append("goals", form.goals);

      formData.append("payment_proof", {
        uri: form.payment_proof,
        name: "payment.jpg",
        type: "image/jpeg",
      });

      const response = await axios.post(
        "http://192.168.50.150:8080/IKAPPNS/api/donation_create.php",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === true) {
        Alert.alert("Success", "Donasi berhasil dikirim, Terimakasih!", [
          {
            text: "OK",
            onPress: () =>
              navigation.navigate("donationlist", { event_id: event_id }),
          },
        ]);
      } else {
        Alert.alert("Gagal", response.data.message || "Gagal mengirim data");
      }
    } catch (err) {
      Alert.alert("Error", "Gagal mengirim data.");
      console.log("ERR:", err);
    }
  };

  //     const response = await fetch(
  //       "http://192.168.50.241:8080/IKAPPNS/api/donation_create.php",
  //       {
  //         method: "POST",
  //         body: formData,
  //       }
  //     );

  //     Alert.alert("Success", "Donasi berhasil dikirim, Terimakasih", [
  //       {
  //         text: "OK",
  //         onPress: () =>
  //           navigation.navigate("donationlist", { event_id: event_id }),
  //       },
  //     ]);
  //   } catch (err) {
  //     Alert.alert("Error", "Gagal mengirim data.");
  //   }
  // };

  return (
    <LinearGradient
      colors={["#ffffff", "#d2e5f7", "#b8d8f4"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.gradientBackground}
    >
      <SafeAreaView style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#005b96" />
        </TouchableOpacity>
        <Text style={styles.headerTitleLeft}>Donation</Text>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.formContainer}>
        <View style={styles.card}>
          {/* INPUT NAME */}
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex. DELA ARIBA"
            value={form.name}
            onChangeText={(text) => handleChange("name", text)}
          />

          {/* INPUT PRODI */}
          <Text style={styles.label}>Program Study</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex. Teknik Otomasi"
            value={form.program_study}
            onChangeText={(text) => handleChange("program_study", text)}
          />

          {/* INPUT ANGKATAN
          <Text style={styles.label}>Force</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex. 2016"
            keyboardType="numeric"
            value={form.force_year}
            onChangeText={(text) => handleChange("force_year", text)}
          /> */}

          {/* FORCE YEAR */}
          <Text style={styles.label}>Force</Text>

          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowYearPicker(true)}
          >
            <Text style={{ color: form.force_year ? "#000" : "#999" }}>
              {form.force_year ? form.force_year : "Pilih Tahun"}
            </Text>
          </TouchableOpacity>

          {/* {showYearPicker && ( */}
          <Modal
            transparent
            animationType="slide"
            visible={showYearPicker}
            onRequestClose={() => setShowYearPicker(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>

                <Text style={styles.modalTitle}>Pilih Tahun Angkatan</Text>

                <DateTimePicker
                  mode="single"
                  yearPickerOnly // Enables year-only selection UI
                  startYear={1920}
                  endYear={new Date().getFullYear()}
                  onChange={({ date }) => {
                    // date is now an integer (e.g., 1984)
                    setSelectedDate(date);
                    handleChange("force_year", date); // ⬅ SIMPAN KE FORM
                    setShowYearPicker(false); // Tutu
                  }}
                />
              </View>
            </View>
          </Modal>
          {/* )} */}


          {/* INPUT DONASI */}
          <Text style={styles.label}>Amount Donation</Text>
          <MaskedTextInput
            type="currency"
            options={{
              prefix: "Rp ",
              groupSeparator: ".",
              decimalSeparator: ",",
              precision: 0, // tanpa koma desimal
            }}
            value={form.amount_donation}
            onChangeText={(text, rawValue) => {
              // rawValue = angka murni (misal 1000000)
              handleChange("amount_donation", rawValue);
            }}
            keyboardType="numeric"
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 10,
              borderRadius: 10,
              marginBottom: 12,
              fontSize: 14,
            }}
          />

          {/* INPUT TUJUAN */}
          <Text style={styles.label}>Goals/Activities</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex. Bantu kegiatan alumni"
            value={form.goals}
            onChangeText={(text) => handleChange("goals", text)}
          />

          {/* UPLOAD GAMBAR */}
          <Text style={styles.label}>Bukti Pembayaran</Text>
          <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
            {form.payment_proof ? (
              <Image
                source={{ uri: form.payment_proof }}
                style={styles.previewImage}
              />
            ) : (
              <>
                <Ionicons
                  name="cloud-upload-outline"
                  size={28}
                  color="#005b96"
                />
                <Text style={styles.uploadText}>
                  Upload Bukti Pembayaran
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* TOMBOL SAVE */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>

          {/* TOMBOL LIHAT DONATUR */}
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() =>
              navigation.navigate("donationlist", { event_id: event_id })
            }
          >
            <Ionicons name="people-outline" size={18} color="#005b96" />
            <Text style={styles.viewText}>Lihat Donatur</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  modalButton: {
    marginTop: 15,
    backgroundColor: "#005b96",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  gradientBackground: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitleLeft: {
    fontSize: 18,
    fontWeight: "600",
    color: "#005b96",
    marginLeft: 10,
  },
  formContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  card: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    elevation: 6,
    marginTop: -50,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    fontSize: 14,
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: "#005b96",
    borderStyle: "dashed",
    borderRadius: 12,
    height: 140,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    backgroundColor: "#f9fcff",
  },
  uploadText: {
    fontSize: 12,
    marginTop: 6,
    color: "#005b96",
    fontWeight: "500",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  saveButton: {
    backgroundColor: "#005b96",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  saveText: { color: "#fff", fontWeight: "600" },
  viewButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#005b96",
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 12,
    backgroundColor: "#f3f9ff",
  },
  viewText: {
    color: "#005b96",
    fontWeight: "600",
    marginLeft: 6,
  },
});
