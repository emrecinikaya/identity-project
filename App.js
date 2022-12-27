/* eslint-disable prettier/prettier */
/* eslint-disable semi */
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import ImagePicker, { openCamera } from "react-native-image-crop-picker";
import axios from "axios";
import RNTextDetector from "rn-text-detector";
const App = () => {
  const [image, setImage] = useState("");
  const [showImage, setShowImage] = useState("");
  const [confidence, setConfidence] = useState();
  const [identityNo, setIdentityNo] = useState();
  const [name, setName] = useState();
  const [surname, setSurname] = useState();
  const [birthDate, setBirthDate] = useState();


  const detectText = async () => {
    try {
      const options = {
        quality: 1,
        base64: true,
        skipProcessing: true,
      };
      const visionResp = await RNTextDetector.detectFromUri(showImage);
      console.log("visionResp", visionResp);

      for (var i = 0; i < 6; i++) {
        if (visionResp[i].text.search("tity No\n") != -1) {
          setIdentityNo(visionResp[i].lines[1].text);
          break;
        } else if (visionResp[i].text.search("tity No") != -1) {
          setIdentityNo(visionResp[i + 1].text);
          break;
        } else {
          setIdentityNo("Kimlik no bulunamadı");
        }
      }
      for (var i = 4; i < 10; i++) {
        if (visionResp[i].text.search("Name") != -1 && visionResp[i].text.search("\n") != -1) {
          setName(visionResp[i].lines[1].text);
          break;
        } else if (visionResp[i].text.search("Name") != -1) {
          setName(visionResp[i + 1].text);
          break;
        } else {
          setName("İsim bulunamadı");
        }
      }
      for (var i = 2; i < 8; i++) {
        console.log(visionResp[i].text.search("Surname"));
        if (visionResp[i].text.search("Surname\n") != -1) {
          setSurname(visionResp[i].lines[1].text);
          break;
        } else if (visionResp[i].text.search("Surname") != -1) {
          setSurname(visionResp[i + 1].text);
          break;
        } else {
          setSurname("Soyisim bulunamadı");
        }
      }
      for (var i = 2; i < 8; i++) {
        if (visionResp[i].text.search("Gender\n") != -1) {
          setBirthDate(visionResp[i].lines[1].text);
          break;
        } else if (visionResp[i].text.search("Gender") != -1) {
          setBirthDate(visionResp[i + 1].text);
          break;
        } else {
          setBirthDate("Doğum tarihi bulunamadı");
        }
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const openGallery = () => {
    ImagePicker.openCamera({
      includeBase64: true,
      compressImageQuality: 0.7,
      cropping: true,
    }).then((res) => {
      //console.log(res);
      setImage(res.data);
      setShowImage(res.path);
      console.log(showImage);
    });
  };
  const sendImage = () => {
    axios({
      method: "POST",
      url: "https://detect.roboflow.com/kimlik1/3",
      params: {
        api_key: "Y7xAA1DBMt86xFBj93Qr",
      },
      data: image,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }).then(function (response) {
      console.log(response.data.predictions);
      if (
        response.data.predictions[0].confidence === undefined ||
        response.data.predictions[0].confidence < 0.7
      ) {
        setConfidence(0);
      } else {
        setConfidence(response.data.predictions[0].confidence);
        detectText();
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageStyle}>
        <Image style={styles.image} source={{ uri: showImage }} />
      </View>
      <View style={styles.checkText}>
        {confidence >= 0.75 ? (
          <Text style={styles.greenText}>Kimlik Gecerli</Text>
        ) : (
          <Text style={styles.redText}>Gecersiz Istek</Text>
        )}
      </View>
      <View style={styles.info_container}>
        <Text style={styles.info_text}>TC kimlik no : {identityNo}</Text>
        <Text style={styles.info_text}>İsim : {name}</Text>
        <Text style={styles.info_text}>Soyisim : {surname}</Text>
        <Text style={styles.info_text}>Doğum tarihi : {birthDate}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttons} onPress={() => openGallery()}>
          <Text style={styles.textStyle}>Kamerayi Ac</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttons} onPress={() => sendImage()}>
          <Text style={styles.textStyle}>Kimligi Tani</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6e6e6",
  },
  imageStyle: {
    flex: 1,
    margin: 20,
    borderWidth: 8,
    borderColor: "#dac2c2",
    borderRadius: 3,
    shadowColor: "#dac2c2",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.3,
    elevation: 13,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  buttons: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    width: "30%",
    height: "40%",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  textStyle: {
    color: "black",
  },
  checkText: {
    justifyContent: "center",
    alignItems: "center",
  },
  greenText: {
    justifyContent: "center",
    alignItems: "center",
    color: "green",
    fontWeight: "bold",
    fontSize: 25,
  },
  redText: {
    justifyContent: "center",
    alignItems: "center",
    color: "red",
    fontWeight: "bold",
    fontSize: 25,
  },
  info_container:{
    flex: 2,
    justifyContent: "center",
    marginHorizontal: 20
  },
  info_text:{
    fontSize: 18,
    margin: 15,
    padding: 5,
    color: 'black',
    backgroundColor: '#e3f2fd',
    borderRadius: 10,
  },
});

export default App;