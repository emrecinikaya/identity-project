/* eslint-disable prettier/prettier */
/* eslint-disable semi */
import { View, Text ,TouchableOpacity} from 'react-native'
import React, {useState} from 'react'
import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios'
import ImgToBase64 from "react-native-image-base64"
const App = () => {
  const [image, setImage] = useState("")
  const api = () => {
    ImagePicker.openCamera({
      includeBase64: true,
      compressImageQuality: 0.5
    }).then(res => {
      //console.log(res);
      setImage(res.data)
      
      
    });
  }
  const api2 = () =>{
    axios({
      method: "POST",
      url: "https://detect.roboflow.com/kimlik1/3",
      params: {
          api_key: "Y7xAA1DBMt86xFBj93Qr"
      },
      data: image,
      headers: {
          "Content-Type": "application/x-www-form-urlencoded"
      }
  })
  .then(function(response) {
      console.log(response.data.predictions);
  })
  .catch(function(error) {
      console.log(error.message);
  });
  }

const api3 = () => {

  ImgToBase64.getBase64String(image)
  .then(base64String =>{
    console.log(image);
  })
}
  
  return (
    <View>
      <TouchableOpacity onPress={() => api()}>
        <Text>Open Gallery</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => api2()}>
        <Text>Open Gallery2222222</Text>
      </TouchableOpacity>
      
    </View>
  )
}

export default App