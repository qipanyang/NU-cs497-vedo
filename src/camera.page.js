import React, {useState, useEffect} from 'react';
import { View, Text } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import styles from './styles';
import Toolbar from './toolbar.component';
import Gallery from './gallery.component';

export default function CameraPage () {
    camera = null;
    [captures,setCaptures] = useState([]);
    [capturing,setCapturing] = useState(null);
    [hasCameraPermission,setCameraPermission] = useState(null);
    [cameraType,setType] = useState(Camera.Constants.Type.back);
    [flashMode,setMode] = useState(Camera.Constants.FlashMode.off);
    const handleCaptureIn = () => setCapturing(true);
    const handleCaptureOut = () => {
        if (capturing)
            camera.stopRecording();
    };
    const handleShortCapture = async () => {
        const photoData = await camera.takePictureAsync();
        setCapturing(false);
        setCaptures([photoData, ...captures]);
    };
    const handleLongCapture = async () => {
        const videoData = await camera.recordAsync();
        setCaptures([videoData, ...captures]);
        setCapturing(false);
    };
    useEffect(()=>{
        const componentDidMount= async ()=>{
            const camera = await Permissions.askAsync(Permissions.CAMERA);
            const audio = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
            setCameraPermission(camera.status === 'granted' && audio.status === 'granted');
        };
        componentDidMount();
    },[]);
    return (
        <React.Fragment>
            <View>
                <Camera
                    type={cameraType}
                    flashMode={flashMode}
                    style={styles.preview}
                    ref={cam => camera = cam}
                />
            </View>
            {captures.length > 0 && <Gallery captures={captures}/>}
            <Toolbar 
                capturing={capturing}
                flashMode={flashMode}
                cameraType={cameraType}
                setFlashMode={setMode}
                setCameraType={setType}
                onCaptureIn={handleCaptureIn}
                onCaptureOut={handleCaptureOut}
                onLongCapture={handleLongCapture}
                onShortCapture={handleShortCapture}
            />
        </React.Fragment>
    );
};