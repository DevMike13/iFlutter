import { StyleSheet, Text, View, Image, ScrollView } from 'react-native'
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { images } from '../../../constants';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Image 
          source={images.backgroundTop}
          style={styles.bgTop}
          resizeMode='contain'
        />
        <Text style={styles.titleText}>IFLUTTER</Text>
        <Image 
          source={images.reflectedButterfly}
          style={styles.butterflyImage}
          resizeMode='contain'
        />
      </View>
      <View style={styles.bottomTextContainer}>
        <Text style={styles.bottomText}>Watch Them Grow,</Text>
        <Text style={styles.bottomText}>Help Them Thrive</Text>
      </View>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c4c4c4',
  },
  titleText:{
    fontFamily: 'Poppins-SemiBold',
    fontSize: 34,
    textAlign: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: '40%',
    transform: [{ translateY: -15 }],
  },

  topContainer:{
    width: '100%',
    height: '50%',
    backgroundColor: 'white',
    position: 'relative'
  },
  bgTop:{
    position: 'absolute',
    width: '100%',
    top: -32
  },

  butterflyImage:{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateY: 8 }, { translateX: -120 }],
  },
     
  bottomTextContainer:{
    position: 'relative',
    marginTop: 'auto',
    marginBottom: 50,
  },
  bottomText:{
    fontFamily: 'Poppins-SemiBold',
    fontSize: 28,
    marginTop: -10,
    textAlign: 'center',
  }
})
