import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

export default function AddLoker() {
  const navigation = useNavigation();

  const [dateValue, setDateValue] = useState(new Date());
  const [showDate, setShowDate] = useState(false);

  const [form, setForm] = useState({
    company: "",
    position: "",
    due_date: "",
    description: "",
    img_poster: null,
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setForm({ ...form, img_poster: result.assets[0] });
    }
  };

  const submit = async () => {
    if (
      !form.company ||
      !form.position ||
      !form.due_date ||
      !form.description 
    ) {
      Alert.alert("Error", "Semua field wajib diisi!");
      return;
    }

    if (!form.img_poster) {
      Alert.alert("Error", "Poster wajib diupload!");
      return;
    }

    const data = new FormData();
    Object.keys(form).forEach((key) => {
      if (key === "img_poster") {
        data.append("img_poster", {
          uri: form.img_poster.uri,
          name: "poster.jpg",
          type: "image/jpeg",
        });
      } else {
        data.append(key, form[key]);
      }
    });

    try {
      await fetch("http://192.168.50.150:8080/IKAPPNS/api/vacancy_create.php", {
        method: "POST",
        body: data,
        // headers: { "Content-Type": "multipart/form-data" },
      });

      Alert.alert("Success", "Lowongan berhasil ditambahkan!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (err) {
      Alert.alert("Error", "Gagal mengirim data.");
      console.log(err);
    }

    setForm({
      company: "",
      position: "",
      due_date: "",
      description: "",
      img_poster: null,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Tambah Lowongan Baru</Text>

        {/* Company */}
        <Text style={styles.label}>Nama Perusahaan</Text>
        <TextInput
          placeholder="Contoh: PT. Advantech"
          style={styles.input}
          value={form.company}
          onChangeText={(text) => handleChange("company", text)}
        />

        {/* Position */}
        <Text style={styles.label}>Posisi</Text>
        <TextInput
          placeholder="Contoh: Software Engineer"
          style={styles.input}
          value={form.position}
          onChangeText={(text) => handleChange("position", text)}
        />

        {/* Due Date */}
        <Text style={styles.label}>Tanggal Berakhir</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowDate(true)}>
          <Text>{form.due_date || "Pilih tanggal"}</Text>
        </TouchableOpacity>

        {showDate && (
          <DateTimePicker
            value={dateValue}
            mode="date"
            onChange={(event, selectedDate) => {
              setShowDate(false);

              if (event.type === "dismissed") return;

              setDateValue(selectedDate);

              const formatted = selectedDate.toISOString().split("T")[0];
              setForm({ ...form, due_date: formatted });
            }}
          />
        )}

        {/* Description */}
        <Text style={styles.label}>Deskripsi Lowongan</Text>
        <TextInput
          placeholder="Tuliskan deskripsi lowongan"
          style={[styles.input, { height: 120 }]}
          multiline
          value={form.description}
          onChangeText={(text) => handleChange("description", text)}
        />

        {/* Preview Image */}
        {form.img_poster && (
          <Image source={{ uri: form.img_poster.uri }} style={styles.preview} />
        )}

        {/* Upload Image */}
        <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
          <Text style={styles.btnText}>Pilih Poster Lowongan</Text>
        </TouchableOpacity>

        {/* Submit */}
        <TouchableOpacity style={styles.submitBtn} onPress={submit}>
          <Text style={styles.submitText}>Simpan Lowongan</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  label: {
    fontWeight: "bold",
    marginBottom: 6,
    marginTop: 10,
  },

  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    borderColor: "#ccc",
    marginBottom: 12,
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#005b96",
  },

  imageBtn: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#e6e6e6",
    alignItems: "center",
    marginBottom: 20,
  },

  preview: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 15,
  },

  submitBtn: {
    backgroundColor: "#005b96",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 40,
  },

  submitText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
