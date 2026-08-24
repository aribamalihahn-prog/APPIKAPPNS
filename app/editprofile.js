import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";

const api = axios.create({
  baseURL: "http://192.168.50.150:8080/IKAPPNS/api/update_profile.php",
  timeout: 10000,
});

export default function EditProfile({ route, navigation }) {
  const params = route?.params || {};
  const { profile, onSave } = params;
  const [user_id, setUserId] = useState({});
  const [user, setUser] = useState({});
  const router = useRouter();
  const scheme = useColorScheme();

  const BASE_URL = "http://192.168.50.150:8080/IKAPPNS/uploads/profiles/";

  const [updatedProfile, setUpdatedProfile] = useState(
    profile || {
      user_id: "",
      full_name: "",
      email: "",
      phone: "",
      job_title: "",
      company: "",
      bio: "",
      address: "",
      profile_picture: "",
    }
  );

  // 🔹 AMBIL DATA USER DARI ASYNC STORAGE
  useEffect(() => {
    const loadUser = async () => {
      const data = await AsyncStorage.getItem("loggedInUser");
      const user_id = await AsyncStorage.getItem("user_id");
      setUser(JSON.parse(user_id));
      // console.log(user_id.id);
      if (data) {
        const user = JSON.parse(data);
        const profile = JSON.parse(user_id);
        // console.log(profile.id);

        setUpdatedProfile((prev) => ({
          ...prev,
          user_id: profile.id,
          full_name: user.full_name,
          email: user.email,
          phone: user.phone,
          job_title: user.job_title,
          company: user.company,
          bio: user.bio,
          address: user.address,
          profile_picture: user.profile_picture,
        }));
      }
    };
    loadUser();
  }, [setUpdatedProfile]);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setUpdatedProfile({ ...updatedProfile, image: result.assets[0].uri });
    }
  };

  const handleSave = async () => {
    try {

      const formData = new FormData();

      formData.append("user_id", updatedProfile.user_id);
      formData.append("full_name", updatedProfile.full_name);
      formData.append("email", updatedProfile.email);
      formData.append("phone", updatedProfile.phone);
      formData.append("job_title", updatedProfile.job_title);
      formData.append("company", updatedProfile.company);
      formData.append("bio", updatedProfile.bio);
      formData.append("address", updatedProfile.address);

      if (updatedProfile.image && updatedProfile.image !== "") {
        formData.append("profile_picture", {
          uri: updatedProfile.image,
          type: "image/jpeg",
          name: "profile.jpg",
        });
      }

      // console.log(formData);
      
      const response = await api.post("update_profile.php", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });



      // console.log("UPDATE RESPONSE:", response.data);

      if (response.data.status) {
        Alert.alert("Sukses", "Profil berhasil diperbarui!");

        // Alert.alert("Sukses", "Profil berhasil diperbarui!");

        // 1. Ambil data user lama
        const oldData = await AsyncStorage.getItem("loggedInUser");
       const parsedOld = oldData ? JSON.parse(oldData) : {
  full_name: "",
  email: "",
  phone: "",
  job_title: "",
  company: "",
  bio: "",
  address: "",
  profile_picture: ""
};

        // 2. Gabungkan data lama + baru
        // const newProfile = {
        //   ...parsedOld,
        //   ...updatedProfile,
        //   profile_picture: response.data.profile.profile_picture // fallback aman
        // };

       const newProfile = {
  ...parsedOld,
  ...updatedProfile,
  profile_picture:
    response?.data?.profile?.profile_picture
      ? response.data.profile.profile_picture
      : parsedOld.profile_picture
};

        // 3. Simpan ke AsyncStorage
        await AsyncStorage.setItem("loggedInUser", JSON.stringify(newProfile));

        // console.log("UPDATED PROFILE SAVED:", newProfile);

        router.back();
      } else {
        Alert.alert("Error", "Gagal memperbarui profil");
      }
    } catch (error) {
      // console.log("ERROR UPDATE:", error);
      Alert.alert("Error", "Tidak dapat menyimpan data");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <SafeAreaView style={styles.header}>
        <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Edit Profile</Text>

        <View style={{ width: 26 }} />
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Foto profil + ikon kamera */}
        <View style={styles.photoContainer}>
          <Image
            source={
              updatedProfile.image
                ? { uri: updatedProfile.image }
                : updatedProfile.profile_picture
                  ? { uri: BASE_URL + updatedProfile.profile_picture }
                  : require("../src/assets/images/profile.png")
            }
            // source={(updatedProfile.profile_picture) ? {uri: BASE_URL + updatedProfile.profile_picture}  : require("../src/assets/images/davina.jpg")}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editIcon} onPress={handleImagePick}>
            <Ionicons name="camera" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Form Input */}
        <TextInput
          style={styles.input}
          placeholder="Nama Lengkap"
          placeholderTextColor="#888"
          value={updatedProfile.full_name}
          // readOnly
          onChangeText={(t) =>
            setUpdatedProfile({ ...updatedProfile, full_name: t })
          }
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          // readOnly
          value={updatedProfile.email}
          onChangeText={(t) =>
            setUpdatedProfile({ ...updatedProfile, email: t })
          }
        />

        <TextInput
          style={styles.input}
          placeholder="No. HP"
          placeholderTextColor="#888"
          value={updatedProfile.phone}
          onChangeText={(t) =>
            setUpdatedProfile({ ...updatedProfile, phone: t })
          }
        />

        <TextInput
          style={styles.input}
          placeholder="Pekerjaan"
          placeholderTextColor="#888"
          value={updatedProfile.job_title}
          onChangeText={(t) =>
            setUpdatedProfile({ ...updatedProfile, job_title: t })
          }
        />

        <TextInput
          style={styles.input}
          placeholder="Perusahaan"
          placeholderTextColor="#888"
          value={updatedProfile.company}
          onChangeText={(t) =>
            setUpdatedProfile({ ...updatedProfile, company: t })
          }
        />

        <TextInput
          style={styles.input}
          placeholder="Bio"
          placeholderTextColor="#888"
          value={updatedProfile.bio}
          onChangeText={(t) =>
            setUpdatedProfile({ ...updatedProfile, bio: t })
          }
        />

        <TextInput
          style={styles.input}
          placeholder="Alamat"
          placeholderTextColor="#888"
          value={updatedProfile.address}
          onChangeText={(t) =>
            setUpdatedProfile({ ...updatedProfile, address: t })
          }
        />

        {/* Tombol Save */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    backgroundColor: "#005b96",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  container: {
    alignItems: "center",
    padding: 20,
  },
  photoContainer: {
    position: "relative",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    marginBottom: 20,
  },
  editIcon: {
    position: "absolute",
    bottom: 8,
    right: 110,
    backgroundColor: "#005b96",
    borderRadius: 20,
    padding: 6,
    borderWidth: 2,
    borderColor: "#fff",
  },
  input: {
    width: "100%",
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 10,
    marginVertical: 8,
  },
  saveButton: {
    backgroundColor: "#004080",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
