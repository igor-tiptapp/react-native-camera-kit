import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  SafeAreaView,
  useWindowDimensions,
  Vibration,
} from 'react-native';
import Camera from '../../src/Camera';
import { CameraApi, CameraType, CaptureData } from '../../src/types';

const { width, height } = Dimensions.get('window');

const flashImages = {
  on: require('../images/flashOn.png'),
  off: require('../images/flashOff.png'),
  auto: require('../images/flashAuto.png'),
};

const flashArray = [
  {
    mode: 'auto',
    image: flashImages.auto,
  },
  {
    mode: 'on',
    image: flashImages.on,
  },
  {
    mode: 'off',
    image: flashImages.off,
  },
] as const;

const BarcodeExample = ({ onBack }: { onBack: () => void }) => {
  const cameraRef = useRef<CameraApi>(null);
  const [currentFlashArrayPosition, setCurrentFlashArrayPosition] = useState(0);
  const [captureImages, setCaptureImages] = useState<CaptureData[]>([]);
  const [flashData, setFlashData] = useState(flashArray[currentFlashArrayPosition]);
  const [torchMode, setTorchMode] = useState(false);
  // const [ratios, setRatios] = useState([]);
  // const [ratioArrayPosition, setRatioArrayPosition] = useState(-1);
  const [captured, setCaptured] = useState(false);
  const [cameraType, setCameraType] = useState(CameraType.Back);
  const [barcode, setBarcode] = useState<string>('');

  useEffect(() => {
    const t = setTimeout(() => {
      setBarcode('');
    }, 2000);
    return () => {
      clearTimeout(t);
    };
  }, [barcode]);

  // useEffect(() => {
  //   let updatedRatios = [...ratios];
  //   if (props.cameraRatioOverlay) {
  //     updatedRatios = updatedRatios.concat(props.cameraRatioOverlay.ratios || []);
  //   }
  //   setRatios(updatedRatios);
  //   setRatioArrayPosition(updatedRatios.length > 0 ? 0 : -1);
  // }, []);

  const onSwitchCameraPressed = () => {
    const direction = cameraType === CameraType.Back ? CameraType.Front : CameraType.Back;
    setCameraType(direction);
  };

  const onSetFlash = () => {
    const newPosition = (currentFlashArrayPosition + 1) % 3;
    setCurrentFlashArrayPosition(newPosition);
    setFlashData(flashArray[newPosition]);
  };

  const onSetTorch = () => {
    setTorchMode(!torchMode);
  };

  const onCaptureImagePressed = async () => {
    if (!cameraRef.current) return;
    const image = await cameraRef.current.capture();
    if (image) {
      setCaptured(true);
      setCaptureImages([...captureImages, image]);
      console.log('image', image);
    }
  };

  // const onRatioButtonPressed = () => {
  //   const newPosition = (ratioArrayPosition + 1) % ratios.length;
  //   setRatioArrayPosition(newPosition);
  // };

  const window = useWindowDimensions();
  const cameraRatio = 4 / 3;

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.topButtons}>
        {flashData.image && (
          <TouchableOpacity style={styles.topButton} onPress={onSetFlash}>
            <Image source={flashData.image} resizeMode="contain" />
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.topButton} onPress={onSwitchCameraPressed}>
          <Image source={require('../images/cameraFlipIcon.png')} resizeMode="contain" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.topButton} onPress={onSetTorch}>
          <Image
            source={torchMode ? require('../images/torchOn.png') : require('../images/torchOff.png')}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </SafeAreaView>

      <View style={styles.cameraContainer}>
        <Camera
          ref={cameraRef}
          style={styles.cameraPreview}
          cameraType={cameraType}
          flashMode={flashData?.mode}
          zoomMode="on"
          focusMode="on"
          torchMode={torchMode ? 'on' : 'off'}
          onOrientationChange={(e) => {
            console.log('orientationChange', e.nativeEvent);
          }}
          // ratioOverlay={ratios[ratioArrayPosition]}
          laserColor="red"
          frameColor="white"
          scanBarcode
          showFrame
          onReadCode={(event) => {
            Vibration.vibrate(100);
            setBarcode(event.nativeEvent.codeStringValue);
            console.log('barcode', event.nativeEvent.codeStringValue);
          }}
        />
      </View>
      {/* {ratios.length > 0 && (
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-end' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 10, paddingLeft: 20 }}>
            <Text style={styles.ratioBestText}>Your images look best at a {ratios[0] || ''} ratio</Text>
            <TouchableOpacity
              style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', padding: 8 }}
              onPress={() => onRatioButtonPressed()}
            >
              <Text style={styles.ratioText}>{ratios[ratioArrayPosition]}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )} */}

      <SafeAreaView style={styles.bottomButtons}>
        <View style={styles.backBtnContainer}>
          <TouchableOpacity onPress={onBack}>
            <Text style={styles.textStyle}>Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.captureButtonContainer}>
          <TouchableOpacity onPress={onCaptureImagePressed}>
            <Image source={require('../images/cameraButton.png')} />
          </TouchableOpacity>
        </View>

        <View style={styles.barcodeContainer}>
          <Text numberOfLines={1} style={styles.textStyle}>
            {barcode}
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default BarcodeExample;

const styles = StyleSheet.create({
  screen: {
    height: '100%',
    backgroundColor: 'black',
  },

  topButtons: {
    margin: 10,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topButton: {
    padding: 10,
  },

  cameraContainer: {
    justifyContent: 'center',
    flex: 1,
  },
  cameraPreview: {
    aspectRatio: 3 / 4,
    width: '100%',
  },

  bottomButtons: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtnContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  captureButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textNumberContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  barcodeContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  textStyle: {
    padding: 10,
    color: 'white',
    fontSize: 20,
  },
});
