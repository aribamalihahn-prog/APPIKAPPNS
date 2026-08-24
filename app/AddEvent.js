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
// import { Route } from "expo-router/build/Route";
import { useNavigation } from "@react-navigation/native";


export default function AddEvent() {
  const navigation = useNavigation();
  // const router = useRouter();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [dateValue, setDateValue] = useState(new Date());
  const [timeValue, setTimeValue] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [form, setForm] = useState({
    // id:"",
    event_name: "",
    date: "",
    time: "",
    location: "",
    contact_person: "",
    donation_account: "",
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
      // !form.id ||
      !form.event_name ||
      !form.date ||
      !form.time ||
      !form.location ||
      !form.contact_person ||
      !form.donation_account ||
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
      await fetch("http:/192.168.50.150:8080/IKAPPNS/api/event_create.php", {
        method: "POST",
        body: data,
        // headers: { "Content-Type": "multipart/form-data" },
      });
      
   Alert.alert(
    "Success",
    "Event berhasil ditambahkan!",
    [
      {
        text: "OK",
        onPress: () => navigation.goBack(), 
      },
    ],
    { cancelable: false }
  );

} catch (err) {
  Alert.alert("Error", "Gagal mengirim data.");
  console.log(err);
}

      setForm({
        event_name: "",
        date: "",
        time: "",
        location: "",
        contact_person: "",
        donation_account: "",
        description: "",
        img_poster: null,
      });
    // } catch (err) {
    //   Alert.alert("Error", "Gagal mengirim data.");
    // console.log(err);
    // }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Tambah Event Baru</Text>

       {/* Nama Event */}
        <Text style={styles.label}>Nama Event</Text>
        <TextInput
          placeholder="Masukkan nama event"
          style={styles.input}
          value={form.event_name}
          onChangeText={(text) => handleChange("event_name", text)}
        />
<Text style={styles.label}>Tanggal Event</Text>

<TouchableOpacity style={styles.input} onPress={() => setShowDate(true)}>
  <Text>{form.date || "Pilih tanggal"}</Text>
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
      setForm({ ...form, date: formatted });
    }}
  />
)}

{/* <Text style={styles.label}>Tanggal Event</Text>

<TouchableOpacity
  style={styles.input}
  onPress={() => setShowDate(true)}
>
  <Text>
    {form.date ? form.date : "Pilih tanggal"}
  </Text>
</TouchableOpacity>

{showDate && (
  <DateTimePicker
    value={form.date ? new Date(form.date) : new Date()}
    mode="date"
    display="calendar"
    onChange={(event, selectedDate) => {
      setShowDate(false);
      if (selectedDate) {
        const formatted =
          selectedDate.toISOString().split("T")[0]; // YYYY-MM-DD

        setForm({ ...form, date: formatted });
      }
    }}
  />
)} */}

 <Text style={styles.label}>Waktu Event</Text>

<TouchableOpacity
  style={styles.input}
  onPress={() => setShowTime(true)}
>
  <Text>
    {form.time ? form.time : "Pilih jam"}
  </Text>
</TouchableOpacity>

{/* {showTime && (
  <DateTimePicker
    value={new Date()}
    mode="time"
    display="clock"
    onChange={(event, selectedTime) => {
      setShowTime(false);
      if (selectedTime) {
        const formatted =
          selectedTime.toTimeString().slice(0, 5); // HH:MM

        setForm({ ...form, time: formatted });
      }
    }}
  />
)} */}
{showTime && (
  <DateTimePicker
    value={timeValue}
    mode="time"
    is24Hour={true}
    onChange={(event, selectedTime) => {
      // Tutup picker
      setShowTime(false);

      // Jika user tekan CANCEL → jangan crash
      if (event.type === "dismissed") return;

      // Update state time
      setTimeValue(selectedTime);

      // Format HH:MM
      const formatted =
        selectedTime.getHours().toString().padStart(2, "0") +
        ":" +
        selectedTime.getMinutes().toString().padStart(2, "0");

      setForm({ ...form, time: formatted });
    }}
  />
)}


        {/* Lokasi */}
        <Text style={styles.label}>Lokasi</Text>
        <TextInput
          placeholder="Masukkan lokasi event"
          style={styles.input}
          value={form.location}
          onChangeText={(text) => handleChange("location", text)}
        />

        {/* Contact Person */}
        <Text style={styles.label}>Contact Person</Text>
        <TextInput
          placeholder="08xxxxxxxxxx"
          style={styles.input}
          keyboardType="phone-pad"
          value={form.contact_person}
          onChangeText={(text) => handleChange("contact_person", text)}
        />

        {/* Rekening Donasi */}
        <Text style={styles.label}>Rekening Donasi</Text>
        <TextInput
          placeholder="Bank / No Rekening"
          style={styles.input}
          value={form.donation_account}
          onChangeText={(text) =>
            handleChange("donation_account", text)
          }
        />

        {/* Deskripsi */}
        <Text style={styles.label}>Deskripsi Event</Text>
        <TextInput
          placeholder="Tuliskan deskripsi event"
          style={[styles.input, { height: 100 }]}
          multiline
          value={form.description}
          onChangeText={(text) => handleChange("description", text)}
        />

        {/* Preview Image */}
        {form.img_poster && (
          <Image source={{ uri: form.img_poster.uri }} style={styles.preview} />
        )}

        {/* Upload Poster */}
        <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
          <Text style={styles.btnText}>Pilih Poster Event</Text>
        </TouchableOpacity>

        {/* Submit */}
        <TouchableOpacity style={styles.submitBtn} onPress={submit}>
          <Text style={styles.submitText}>Simpan Event</Text>
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

  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderColor: "#ccc",
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
});
