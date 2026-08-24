import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
// import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@ericboles/react-native-ui-datepicker';
import axios from "axios";

export default function biodata() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [gender, setGender] = useState("");
  const [programStudies, setProgramStudies] = useState([]);
  const [program, setProgram] = useState("");
  const [force, setForce] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [showYearPicker, setShowYearPicker] = useState(false);

  // const sendData = async () => {
  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Semua field wajib diisi!");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Password dan konfirmasi tidak sama!");
      return;
    }

    const data = {
      name,
      email,
      password: password,
      confirm_password: confirmPassword,
      gender,
      program_study_id: program,
      force_year: force,
      province,
      city,
    };

    console.log(data);
    
    try {
      console.log("SEND DATA:", data);

      const res = await axios.post(
        "http://192.168.50.150:8080/IKAPPNS/api/register.php",
        data,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );


      if (res.status === 200) {
        Alert.alert("Sukses", "Register berhasil!", [
          { text: "OK", onPress: () => router.push("./login") }
        ]);
      } else {
        Alert.alert("Gagal", "Email sudah terdaftar!");
      }

    } catch (err) {
      console.log("Error:", err);
      Alert.alert("Error", "Terjadi kesalahan pada server");
    }
  }


  useEffect(() => {
    const fetchPrody = async () => {
      try {
        const response = await axios.get(
          `http://192.168.50.150:8080/IKAPPNS/api/get_program_study.php`
        );
        // console.log(response.data.data);

        setProgramStudies(response?.data?.data ?? []);
      } catch (error) {
        Alert.alert("Error", "Tidak dapat memuat data dari server.");
      }
    };

    fetchPrody();
  }, []);

  // Data kota per provinsi
  const citiesByProvince = {
    "Aceh": [
      "Banda Aceh", "Langsa", "Lhokseumawe", "Sabang", "Subulussalam",
      "Kabupaten Aceh Barat", "Kabupaten Aceh Barat Daya", "Kabupaten Aceh Besar",
      "Kabupaten Aceh Jaya", "Kabupaten Aceh Selatan", "Kabupaten Aceh Singkil",
      "Kabupaten Aceh Tamiang", "Kabupaten Aceh Tengah", "Kabupaten Aceh Tenggara",
      "Kabupaten Aceh Timur", "Kabupaten Aceh Utara", "Kabupaten Bener Meriah",
      "Kabupaten Bireuen", "Kabupaten Gayo Lues", "Kabupaten Nagan Raya",
      "Kabupaten Pidie", "Kabupaten Pidie Jaya", "Kabupaten Simeulue"
    ],
    "Sumatera Utara": [
      "Medan", "Binjai", "Pematangsiantar", "Tanjungbalai", "Tebing Tinggi",
      "Padangsidimpuan", "Gunungsitoli", "Kabupaten Asahan", "Kabupaten Batubara",
      "Kabupaten Dairi", "Kabupaten Deli Serdang", "Kabupaten Humbang Hasundutan",
      "Kabupaten Karo", "Kabupaten Labuhanbatu", "Kabupaten Labuhanbatu Selatan",
      "Kabupaten Labuhanbatu Utara", "Kabupaten Langkat", "Kabupaten Mandailing Natal",
      "Kabupaten Nias", "Kabupaten Nias Barat", "Kabupaten Nias Selatan",
      "Kabupaten Nias Utara", "Kabupaten Padang Lawas", "Kabupaten Padang Lawas Utara",
      "Kabupaten Pakpak Bharat", "Kabupaten Samosir", "Kabupaten Serdang Bedagai",
      "Kabupaten Simalungun", "Kabupaten Tapanuli Selatan", "Kabupaten Tapanuli Tengah",
      "Kabupaten Tapanuli Utara", "Kabupaten Toba"
    ],
    "Sumatera Barat": [
      "Padang", "Bukittinggi", "Padang Panjang", "Pariaman", "Payakumbuh", "Sawahlunto",
      "Solok", "Kabupaten Agam", "Kabupaten Dharmasraya", "Kabupaten Kepulauan Mentawai",
      "Kabupaten Lima Puluh Kota", "Kabupaten Padang Pariaman", "Kabupaten Pasaman",
      "Kabupaten Pasaman Barat", "Kabupaten Pesisir Selatan", "Kabupaten Sijunjung",
      "Kabupaten Solok", "Kabupaten Solok Selatan", "Kabupaten Tanah Datar"
    ],
    "Riau": [
      "Pekanbaru", "Dumai", "Kabupaten Bengkalis", "Kabupaten Indragiri Hilir",
      "Kabupaten Indragiri Hulu", "Kabupaten Kampar", "Kabupaten Kepulauan Meranti",
      "Kabupaten Kuantan Singingi", "Kabupaten Pelalawan", "Kabupaten Rokan Hilir",
      "Kabupaten Rokan Hulu", "Kabupaten Siak"
    ],
    "Kepulauan Riau": [
      "Batam", "Tanjungpinang", "Kabupaten Bintan", "Kabupaten Karimun",
      "Kabupaten Kepulauan Anambas", "Kabupaten Lingga", "Kabupaten Natuna"
    ],
    "Jambi": [
      "Jambi", "Sungai Penuh", "Kabupaten Batanghari", "Kabupaten Bungo",
      "Kabupaten Kerinci", "Kabupaten Merangin", "Kabupaten Muaro Jambi",
      "Kabupaten Sarolangun", "Kabupaten Tanjung Jabung Barat", "Kabupaten Tanjung Jabung Timur",
      "Kabupaten Tebo"
    ],
    "Bengkulu": [
      "Bengkulu", "Kabupaten Bengkulu Selatan", "Kabupaten Bengkulu Tengah",
      "Kabupaten Bengkulu Utara", "Kabupaten Kaur", "Kabupaten Kepahiang",
      "Kabupaten Lebong", "Kabupaten Mukomuko", "Kabupaten Rejang Lebong", "Kabupaten Seluma"
    ],
    "Sumatera Selatan": [
      "Palembang", "Lubuklinggau", "Pagar Alam", "Prabumulih", "Kabupaten Banyuasin",
      "Kabupaten Empat Lawang", "Kabupaten Lahat", "Kabupaten Muara Enim",
      "Kabupaten Musi Banyuasin", "Kabupaten Musi Rawas", "Kabupaten Musi Rawas Utara",
      "Kabupaten Ogan Ilir", "Kabupaten Ogan Komering Ilir", "Kabupaten Ogan Komering Ulu",
      "Kabupaten Ogan Komering Ulu Selatan", "Kabupaten Ogan Komering Ulu Timur",
      "Kabupaten Penukal Abab Lematang Ilir"
    ],
    "Bangka Belitung": [
      "Pangkalpinang", "Kabupaten Bangka", "Kabupaten Bangka Barat",
      "Kabupaten Bangka Selatan", "Kabupaten Bangka Tengah", "Kabupaten Belitung",
      "Kabupaten Belitung Timur"
    ],
    "Lampung": [
      "Bandar Lampung", "Metro", "Kabupaten Lampung Barat", "Kabupaten Lampung Selatan",
      "Kabupaten Lampung Tengah", "Kabupaten Lampung Timur", "Kabupaten Lampung Utara",
      "Kabupaten Mesuji", "Kabupaten Pesawaran", "Kabupaten Pesisir Barat", "Kabupaten Pringsewu",
      "Kabupaten Tanggamus", "Kabupaten Tulang Bawang", "Kabupaten Tulang Bawang Barat",
      "Kabupaten Way Kanan"
    ],
    "DKI Jakarta": [
      "Kota Jakarta Pusat", "Kota Jakarta Barat", "Kota Jakarta Selatan", "Kota Jakarta Timur", "Kota Jakarta Utara"
    ],
    "Banten": [
      "Kabupaten Tangerang", "Kabupaten Tangerang Selatan", "Kabupaten Cilegon", "Kabupaten Pandeglang", "Kabupaten Lebak",
      "Kota Serang", "Kota Tangerang", "Kota Taangerang Selatan"
    ],
    "Jawa Barat": [
      "Kabupaten Bandung", "Kabupaten Bandung Barat", "Kabupaten Bekasi", "Kabupaten Bogor", "Kabupaten Ciamis", "Kabupaten Cianjur",
      "Kabupaten Cirebon", "Kabupaten Garut", "Kabupaten Indramayu", "Kabupaten Karawang", "Kabupaten Kuningan", "Kabupaten Majalengka",
      "Kabupaten Pangendaran", "Kabupaten Purwakarta", "Kabupaten Subang", "Kabupaten Sukabumi", "Kabupaten Tasikmalaya", "Kota Bandung",
      "Kota Banjar", "Kota Bekasi", "kota Bogor", "Kota Cimahi", " Kota Cirebon", " Kota Depok", "Kota Sukabumi", "Kota Tasikmalaya"
    ],
    "Jawa Tengah": [
      "Kabupaten Banjarnegara", "Kabupaten Banyumas", "Kabupaten Batang", "Kabupaten Blora,", "Kabupaten Boyolali", "Kabupaten Brebes",
      "Kabupaten Cilacap", "Kabupaten Demak", "Kabupaten Grobogan", "Kabupaten Jepara", "Kabupaten Karanganyar", "Kabupaten Kebumen",
      "Kabupaten Kendal", "Kabupaten Klaten", "Kabupaten Kudus", "Kabupaten Magelang", "Kabupaten Pati", "Kabupaten Pekalongan",
      "Kabupaten Pemalang", "Kabupaten Purbalingga", "Kabupaten Purworejo", "Kabupaten Rembang", "Kabupaten Semarang", "Kabupaten Sragen",
      "Kabupaten Sukoharjo", "Kabupaten Tegal", "Kabupaten Temanggung", "Kabupaten Wonogiri", "Kabupaten Wonosobo", "Kota Magelang", "Kota Pekalongan",
      "Kota Salatiga", "Kota Semarang", "Kota Surakarta (Solo)", "Kota Tegal"
    ],
    "DI Yogyakarta": [
      "Kabupaten Bantul", "Kabupaten Gunungkidul", "Kabupaten Kulon Progo", "Kabupaten Sleman", "Kota Yogyakarta"
    ],
    "Jawa Timur": [
      "Kabupaten Bangkalan", "Kabupaten Banyuwangi", "Kabupaten Blitar", "Kabupaten Bojonegoro", "Kabupaten Bondowoso", "Kabupaten Gresik",
      "Kabupaten Jember", "Kabupaten Jombang", "Kabupaten Kediri", "Kabupaten Lamongan", "Kabupaten Lumajang", "Kabupaten Madiun", "Kabupaten Magetan",
      "Kabupaten Malang", "Kabupaten Mojokerto", "Kabupaten Nganjuk", "Kabupaten Ngawi", "Kabupaten Pacitan", "Kabupaten Pamekasan", "Kabupaten Pasuruan",
      "Kabupaten Ponorogo", "Kabupaten Probolinggo", "Kabupaten Sampang", "Kabupaten Sidoarjo", "Kabupaten Situbondo", "Kabupaten Sumenep", "Kabupaten Trenggalek",
      "Kabupaten Tuban", "Kabupaten Tulungagung", "Kota Batu", "Kota Blitar", "Kota Kediri", "Kota Madiun", "Kota Malang", "Kota Mojokerto", "Kota Pasuruan",
      "Kota Probolinggo", "Kota Surabaya"
    ],
    "Bali": [
      "Kabuoaten Badung", "kabupaten Bangli", "Kabupaten Buleleng", "Kabupaten Gianyar", "Kabupaten Jembrana", "Kabupaten Karangasem", "Kabupaten Klungkung",
      "Kabupaten Tabanan", "Kota Denpasar"
    ],
    "Nusa Tenggara Barat": [
      "Kabupaten Bima", "Kabupaten Dompu", "Kabupaten Lombok Barat", "Kabupaten Lombok Tengah", "Kabupaten Lombok Timur", "Kabupaten Lombok Utara",
      "Kabupaten Sumbawa", "Kabupaten Sumbawa Barat", "Kota Bima", "Kota Mataram"
    ],
    "Nusa Tenggara Timur": [
      "Kabupaten Alor", "Kabupaten Belu", "Kabupaten Ende", "Kabupaten Flores", "Kabupaten Kupang", "Kabupaten Lembata", "Kabupaten Malaka", "Kabupaten Manggarai",
      "Kabupaten Manggarai Barat", "Kabupaten Manggarai Timur", "Kabupaten Nagekeo", "Kabupaten Ngada", "Kabupaten Rote Ndao", "Kabupaten Sabu Raijua", "Kabupaten Sikka",
      "Kabupaten Sumba Barat", "Kabupaten Sumba Barat Daya", "Kabupaten Sumba Tengah", "Kabupaten Sumba Timur", "Kabupaten Timor Tengah Selatan",
      "Kabupaten Timor Tengah Utara", "Kota Kupang"
    ],
    "Kalimantan Barat": [
      "Kabupaten Bengkayang", "Kabupaten Kapuas Hulu", "Kabupaten Kayong Utara", "Kabupaten Ketapang", "Kabupaten Kubu Raya", "Kabupaten Landak", "Kabupaten Melawi",
      "Kabupaten Mempawah", "Kabupaten Sambas", "Kabupaten Sanggau", "Kabupaten Sekadau", "Kabupaten Sintang", "Kota Pontianak", "Kota Singkawang"
    ],
    "Kalimantan Tengah": [
      "Kabupaten Barito Selatan", "Kabupaten Barito Timur", "Kabupaten Gunubg Mas", "Kabupaten Kapuas", "Kabupaten Katingan", "Kabupaten Kotawaringin barat",
      "Kabupaten Kotawaringin Timur", "Kabupaten Lamandau", "Kabupaten Murung Raya", "Kabupaten Pulang Pisau", "Kabupaten Seruyan", "Kabupaten Sukamara",
      "Kota Palangka Raya"
    ],
    "Kalimantan Selatan": [
      "Kabupaten Balangan", "Kabupaten Banjar", "Kabupaten Barito Kuala", "Kabupaten Hulu Sungai Selatan", "Kabupaten Hulu Sungai Tengah",
      "Kabupaten Hulu Sungai Utara", "Kabupaten Kotabaru", "Kabupaten Tabalog", "Kabupaten Tanah Bumbu", "Kabupaten Tanah Laut", "Kabupaten Tapin", "Kota Banjarbaru", "Kota Banjarmasin"
    ],
    "Kalimantan Timur": [
      "Kabupaten Berau", "Kabupaten Kutai Barat", "Kabupaten Kutai Kartanegara", "Kabupaten kutai Timur", "Kabupaten Mahakam Ulu", "Kabupaten Paser", "Kabupaten Penajam Paser Utara",
      "Kota Balikpapan", "Kota Bontang", "Kota Samarinda"
    ],
    "Kalimantan Utara": [
      "Kabupaten Bulungan", "Kabupaten Malinau", "Kabupaten Nunukan", "Kabupaten Tana Tidung", "Kota Tarakan"
    ],
    "Sulawesi Utara": [
      "Kabupaten Bolaang Mongondow", "Kabupaten Bolaang Mongondow Selatan", "Kabupaten Bolaang Mongondow Timur", "Kabupaten Bolaang Mongondow Utara", "Kabupaten Kabupaten Kepulauan Sangihe",
      "Kabupaten Kepulauan Siau Tagulandang Biaro", "Kabupaten Kepulauan Talaud", "Kabupaten Minahasa", "Kabupaten Minahasa Selatan", "Kabupaten Minahasa Utara", "Kota Bitung", "Kota Kotamobagu",
      "Kota Manado", "Kota Tomohon"
    ],
    "Gorontalo": [
      "Kabupaten Boalemo", "Kabupaten Bone Bolango", "Kabupaten Gorontalo", "Kabupaten Gorontalo Utara", "Kabupaten Pohuwato", "Kota Gorontalo"
    ],
    "Sulawesi Tengah": [
      "Kabupaten Banggai", "Kabupaten Banggai Kepulauan", "Kabupaten Banggai Laut", "Kabupaten Buol", "Kabupaten Donggala", "Kabupaten Morowali", "Kabupaten Morowali Utara",
      "Kabupaten Parigi Moutong", "Kabupaten Poso", "Kabupaten Sigi", "Kabupaten Tojo Una-Una", "Kabupaten Tolitoli", "Kota Palu"
    ],
    "Sulawesi Selatan": [
      "Kabupaten Bantaeng", "Kabupaten Barru", "Kabupaten Bone", "Kabupaten Bulukumba", "Kabupaten Enrekang", "Kabupaten Gowa", "Kabupaten Jeneponto", "Kabupaten Kepulauan Selayar",
      "Kabupaten Luwu", "Kabupaten Luwu Timur", "Kabupaten Luwu Utara", "Kabupaten Maros", "Kabupaten Pangkajene dan Kepulauan", "Kabupaten Pinrang", "Kabupaten Sidenreng Rappang",
      "Kabupaten Sinjai", "Kabupaten Soppeng", "Kabupaten Takalar", "Kabupaten Tana Toraja", "Kabupaten Toraja Utara", "Kabupaten Wajo", "Kota Makassar", "Kota Palopo", "Kota Parepare"
    ],
    "Sulawesi Tenggara": [
      "Kabupaten Bombana", "Kabupaten Buton", "Kabupaten Buton Selatan", "Kabupaten Buton Tengah", "Kabupaten Buton Utara", "Kabupaten Kolaka", "Kabupaten Kolaka Timur", "Kabupaten Kolaka Utara",
      "Kabupaten Konawe", "Kabupaten Konawe Kepulauan", "Kabupaten Konawe Selatan", "Kabupaten Konawe Utara", "Kabupaten Muna", "Kabupaten Muna Barat", "Kabupaten Wakatobi", "Kota Baubau", "Kota Kendari"
    ],
    "Sulawesi Barat": [
      "Kabupaten Majene", "Kabupaten Mamasa", "Kabupaten Mamuju", "Kabupaten Mamuju Tengah", "Kabupaten Pasangkayu", "Kabupaten Polewali Mandar"
    ],
    "Maluku": [
      "Kabupaten Buru", "Kabupaten Buru Selatan", "Kabupaten Kepulauan Aru", "Kabupaten Kepulauan Tanimbar", "Kabupaten Maluku Barat Daya", "Kabupaten Maluku Tengah", "Kabupaten Maluku Tenggara",
      "Kabupaten Seram Bagian Barat", "Kabupaten Seram Bagian Timur", "Kota Ambon", "Kota Tual"
    ],
    "Maluku Utara": [
      "Kabupaten Halmahera Barat", "Kabupaten Halmahera Selatan", "Kabupaten Halmahera Tengah", "Kabupaten Halmahera Timur", "Kabupaten Halmahera Utara", "Kabupaten Kepulauan Sula", "Kabupaten Pulau Morotai",
      "Kabupaten Pulau Taliabu", "Kota Ternate", "Kota Tidore Kepulauan"
    ],
    "Papua": [
      "Kabupaten Asmat", "Kabupaten Biak Numfor", "Kabupaten Jayapura", "Kabupaten Keerom", "Kabupaten Kepulauan Yapen", "Kabupaten Mamberamo Raya", "Kabupaten Sarmi", "Kabupaten Supiori", "Kabupaten Waropen",
      "Kota Jayapura"
    ],
    "Papua Barat": [
      "Kabupaten Fakfak", "Kabupaten Kaimana", "Kabupaten Manokwari", "Kabupaten Manokwari Selatan", "Kabupaten Maybrat", "Kabupaten Pegunungan Arfak", "Kabupaten Raja Ampat", "Kabupaten Sorong", "Kabupaten Sorong Selatan",
      "Kabupaten Tambrauw", "Kabupaten Teluk Bintuni", "Kabupaten Teluk Wondama", "Kota Sorong"
    ],
    "Papua Tengah": [
      "Kabupaten Deiyai", "Kabupaten Dogiyai", "Kabupaten Intan Jaya", "Kabupaten Mimika", "Kabupaten Nabire", "Kabupaten Paniai", "Kabupaten Puncak", "Kabupaten Puncak Jaya"
    ],
    "Papua Pegunungan": [
      "Kabupaten Jayawijaya", "Kabupaten Lanny Jaya", "Kabupaten Mamberamo Tengah", "Kabupaten Nduga", "Kabupaten Pegunungan Bintang", "Kabupaten Tolikara", "Kabupaten Yalimo",
      "Kabupaten Yahukimo"
    ],
    "Papua Selatan": [
      "Kabupaten Asmat", "Kabupaten Boven Digoel", "Kabupaten Mappi", "Kabupaten Merauke"
    ]
  };
  const cityOptions = citiesByProvince[province] || [];

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {/* 🔙 Tombol Back di pojok kiri */}
      <TouchableOpacity style={styles.backIcon} onPress={() => router.push("/login")}>
        <Ionicons name="arrow-back" size={26} color="#005b96" />
      </TouchableOpacity>


      {/* Judul */}
      <Text style={styles.title}>Create Your Account</Text>

      {/* Name */}
      <Text style={styles.label}>Name</Text>
      <TextInput
        placeholder="Enter your full name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      {/* Email */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        placeholder="Enter your email"
        style={styles.input}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password */}
      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Enter Your Password"
          secureTextEntry={!showPassword}
          style={styles.passwordInput}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye" : "eye-off"}
            size={22}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      {/* Confirm Password */}
      <Text style={styles.label}>Confirm Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Confirm Password"
          secureTextEntry={!showConfirmPassword}
          style={styles.passwordInput}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <Ionicons
            name={showConfirmPassword ? "eye" : "eye-off"}
            size={22}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      {/* Gender */}
      <Text style={styles.label}>Gender</Text>
      <View style={styles.genderContainer}>
        <TouchableOpacity
          style={[
            styles.genderButton,
            gender === "Male" && styles.genderSelected,
          ]}
          onPress={() => setGender("Male")}
        >
          <View
            style={[
              styles.radioCircle,
              gender === "Male" && styles.radioCircleSelected,
            ]}
          />
          <Text style={styles.genderText}>Male</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.genderButton,
            gender === "Female" && styles.genderSelected,
          ]}
          onPress={() => setGender("Female")}
        >
          <View
            style={[
              styles.radioCircle,
              gender === "Female" && styles.radioCircleSelected,
            ]}
          />
          <Text style={styles.genderText}>Female</Text>
        </TouchableOpacity>
      </View>

      {/* PRODY */}
      <View style={styles.dropdownContainer}>
        <Picker
          selectedValue={program}
          onValueChange={(itemValue) => setProgram(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Program Study" value="" />

          {programStudies.map((item) => (
            <Picker.Item
              key={item.id}
              label={item.name}
              value={item.id}
            />
          ))}
        </Picker>
      </View>


      {/* FORCE YEAR  */}

      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowYearPicker(true)}
      >
        <Text style={{ color: force ? "#000" : "#999", paddingVertical : 5 }}>
          {force ? force : "Pilih Tahun"}
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
                setForce(date);
                setShowYearPicker(false); // Tutu
              }}
            />
          </View>
        </View>
      </Modal>
      {/* )} */}

      {/* Province */}
      <View style={styles.dropdownContainer}>
        <Picker
          selectedValue={province}
          onValueChange={(itemValue) => {
            setProvince(itemValue);
            setCity("");
          }}
          style={styles.picker}
        >
          <Picker.Item label="Province" value="" />
          {Object.keys(citiesByProvince).map((key) => (
            <Picker.Item
              key={key}
              label={
                key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, " ")
              }
              value={key}
            />
          ))}
        </Picker>
      </View>

      {/* City (auto menyesuaikan provinsi) */}
      <View style={styles.dropdownContainer}>
        <Picker
          selectedValue={city}
          onValueChange={(itemValue) => setCity(itemValue)}
          style={styles.picker}
          enabled={province !== ""}
        >
          <Picker.Item label="City" value="" />
          {cityOptions.map((cityName) => (
            <Picker.Item key={cityName} label={cityName} value={cityName} />
          ))}
        </Picker>
      </View>

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
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
  container: {
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 60,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 14,
  },
  eyeIcon: {
    padding: 5,
    flexDirection: "row",
  },
  passwordContainer: {
    flexDirection: "row",        // <-- ini penting biar sejajar!
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f0f6ff",
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,                     // biar TextInput isi seluruh sisa ruang
    paddingVertical: 12,
    fontSize: 14,
  },
  genderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  genderButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  radioCircle: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#005b96",
    marginRight: 8,
  },
  radioCircleSelected: {
    backgroundColor: "#005b96",
  },
  genderText: {
    fontSize: 14,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#005b96",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  backIcon: {
    position: "absolute",
    top: 40,        // jarak dari atas layar
    left: 20,       // jarak dari kiri
    zIndex: 10,     // biar tombol di atas elemen lain
  },
});
