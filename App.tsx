
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity, Modal, Image, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { FontAwesome } from '@expo/vector-icons'
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';

// export default function App() {
//   const {
//     FlashMode: { on, off },
//   } = Camera.Constants;

//   const camRef = useRef(null);
//   const [hasPermission, setHasPermission] = useState(null);
//   const [type, setType] = useState(Camera.Constants.Type.back);
//   const [pt, setPt] = useState(null)
//   const [open, setOpen] = useState(false)
//   const [fl, setFl] = useState(on)

//   useEffect(() => {
//     (async () => {
//       const { status } = await Camera.requestPermissionsAsync();
//       setHasPermission(status === 'granted');
//     })();

//     (async () => {
//       const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
//       setHasPermission(status === 'granted');
//     })();

//   }, []);

//   async function takePicture() {
//     if (camRef) {
//       const data = await camRef.current.takePictureAsync();
//       setPt(data.uri);
//       setOpen(true)
//       console.log(data)
//     }
//   }

//   async function Record() {
//     if (camRef) {
//       const data = await camRef.current.recordAsync();
//       console.log("Recording")
//     }
//   }

//   async function stopRecord(){
//     if (camRef) {
//       const data = await camRef.current.stopRecording();
//       console.log(data)
//     }
//   }

//   async function savePicture() {
//     const asset = await MediaLibrary.createAssetAsync(pt)
//       .then(() => {
//         Alert.alert('saved')
//       })
//       .catch(error => {
//         console.log('err', error)
//       })
//   }

//   if (hasPermission === null) {
//     return <View />;
//   }
//   if (hasPermission === false) {
//     return <Text>No access to camera</Text>;
//   }
//   return (
//     <View style={{ flex: 1 }}>
//       <Camera style={{ flex: 1 }} type={type} ref={camRef} flashMode={fl}>
//         <View
//           style={{
//             flex: 1,
//             backgroundColor: 'transparent',
//             flexDirection: 'row',
//           }}>
//           <TouchableOpacity
//             style={{
//               //flex: 0.1,
//               alignSelf: 'flex-end',
//               alignItems: 'center',
//               marginLeft: 20,
//               marginBottom: 25
//             }}
//             onPress={() => {
//               setType(
//                 type === Camera.Constants.Type.back
//                   ? Camera.Constants.Type.front
//                   : Camera.Constants.Type.back
//               );
//             }}>
//             <FontAwesome name="exchange" size={30} />
//           </TouchableOpacity>
//           <TouchableOpacity onPress={takePicture}
//             style={{
//               alignSelf: 'flex-end',
//               justifyContent: 'center',
//               marginLeft: 130,
//               marginBottom: 20
//             }}>
//             <FontAwesome name="camera" size={50} />
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={{
//               //flex: 0.1,
//               alignSelf: 'flex-end',
//               alignItems: 'center',
//               marginLeft: 150,
//               marginBottom: 25
//             }}
//             //onPress={stopRecord}
//             onPress={() => {
//                setFl(!fl);
//             }}
//             >
//             <FontAwesome name="flash" size={30} />
//           </TouchableOpacity>
//         </View>
//       </Camera>

//       {
//         pt &&
//         <Modal
//           animationType="slide"
//           transparent={false}
//           visible={open}
//         >
//           <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//             <Image
//               style={{ width: "100%", height: "90%", borderRadius: 20 }}
//               source={{ uri: pt }}
//             />

//             <View style={{ flexDirection: 'row' }}>
//               <TouchableOpacity style={{ marginHorizontal: 20 }} onPress={() => setOpen(false)} >
//                 <FontAwesome name="window-close" size={30} />
//               </TouchableOpacity>

//               <TouchableOpacity style={{ marginHorizontal: 20 }} onPress={savePicture} >
//                 <FontAwesome name="upload" size={30} />
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Modal>
//       }
//     </View>
//   );
// }

class MyCam extends React.Component {
  state = {
    video: null,
    picture: null,
    recording: false
  };

  _saveVideo = async () => {
    const { video } = this.state;
    const asset = await MediaLibrary.createAssetAsync(video.uri);
    if (asset) {
      this.setState({ video: null });
    }
  };

  _StopRecord = async () => {
    this.setState({ recording: false }, () => {
      this.cam.stopRecording();
    });
  };

  _StartRecord = async () => {
    if (this.cam) {
      this.setState({ recording: true }, async () => {
        const video = await this.cam.recordAsync();
        this.setState({ video });
      });
    }
  };

  toogleRecord = () => {
    const { recording } = this.state;

    if (recording) {
      this._StopRecord();
    } else {
      this._StartRecord();
    }
  };

  render() {
    const { recording, video } = this.state;
    return (
      <Camera
        ref={cam => (this.cam = cam)}
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          flex: 1,
          width: "100%"
        }}
      >
        {video && (
          <TouchableOpacity
            onPress={this._saveVideo}
            style={{
              padding: 20,
              width: "100%",
              backgroundColor: "#fff"
            }}
          >
            <Text style={{ textAlign: "center" }}>save</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={this.toogleRecord}
          style={{
            padding: 20,
            width: "100%",
            backgroundColor: recording ? "#ef4f84" : "#4fef97"
          }}
        >
          <Text style={{ textAlign: "center" }}>
            {recording ? "Stop" : "Record"}
          </Text>
        </TouchableOpacity>
      </Camera>
    );
  }
}

class RecVideo extends React.Component {
  state = {
    showCamera: false
  };

  _showCamera = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (status === "granted") {
      this.setState({ showCamera: true });
    }
  };

  render() {
    const { showCamera } = this.state;
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          width: "100%"
        }}
      >
        {showCamera ? (
          <MyCam />
        ) : (
          <TouchableOpacity onPress={this._showCamera}>
            <Text> Show Camera </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

export default RecVideo;