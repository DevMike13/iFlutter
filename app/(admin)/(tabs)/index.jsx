import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import React from 'react';
import { images } from '../../../constants';

const { height } = Dimensions.get('window');

const HomeScreen = () => {
  
  const translateY = height * -0.05; 
  const butterflySize = height * 0.35;

  return (
    <View style={styles.container}>
      {/* Background halves */}
      <View style={styles.topContainer}>
        <Image 
          source={images.backgroundTop}
          style={styles.bgTop}
          resizeMode="cover"
        />
      </View>
      <View style={styles.bottomContainer} />

      {/* Centered content */}
      <View style={[styles.centerWrapper, { transform: [{ translateY }] }]}>
        <View style={styles.contentContainer}>
          <Text style={styles.titleText}>IFLUTTER</Text>
          <Image 
            source={images.reflectedButterfly}
            style={[styles.butterflyImage, { width: butterflySize, height: butterflySize }]}
            resizeMode="contain"
          />
          <View>
            <Text style={styles.bottomText}>Watch Them Grow,</Text>
            <Text style={styles.bottomText}>Help Them Thrive</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  topContainer: {
    flex: 1,
    backgroundColor: 'white',
  },

  bottomContainer: {
    flex: 1,
    backgroundColor: '#c4c4c4',
  },

  bgTop: {
    // width: '100%',
    // height: '100%',
    position: 'absolute',
  },

  // full-screen wrapper to center content
  centerWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },

  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },

  titleText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 34,
    textAlign: 'center',
  },

  butterflyImage: {
    width: 500,
    height: 500,
  },

  bottomText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 28,
    textAlign: 'center',
    marginTop: -10,
  },
});
