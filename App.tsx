import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Camera, useCameraDevice } from "react-native-vision-camera";

export default function App() {
  const [hasPermission, setHasPermission] = useState(false);
  const [openCamera, setOpenCamera] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const device = useCameraDevice("back");
  const cameraRef = useRef<Camera | null>(null);

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === "granted");
    })();
  }, []);

  const takePhoto = async () => {
    if (cameraRef.current == null) return;

    try {
      const photo = await cameraRef.current.takePhoto();
      setPhotoUri(`file://${photo.path}`);
      setOpenCamera(false);
    } catch (error) {
      Alert.alert("Error", "Failed to take photo");
    }
  };

  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <Text>No camera permission</Text>
        <Button
          title="Grant permission"
          onPress={async () => {
            const status = await Camera.requestCameraPermission();
            setHasPermission(status === "granted");
          }}
        />
      </View>
    );
  }

  if (openCamera && device == null) {
    return (
      <View style={styles.center}>
        <Text>No camera device available</Text>
        <Button title="Go Back" onPress={() => setOpenCamera(false)} />
      </View>
    );
  }

  if (openCamera && device != null) {
    return (
      <View style={styles.flex}>
        <Camera
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          photo={true}
        />
        <View style={styles.captureContainer}>
          <TouchableOpacity style={styles.captureButton} onPress={takePhoto} />
        </View>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setOpenCamera(false)}
        >
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Main screen
  return (
    <View style={styles.center}>
      {photoUri ? (
        <Image source={{ uri: photoUri }} style={styles.preview} />
      ) : (
        <Text>No photo yet</Text>
      )}
      <Button title="Open Camera" onPress={() => setOpenCamera(true)} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  captureContainer: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white",
    borderWidth: 4,
    borderColor: "black",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  closeText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  preview: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});
