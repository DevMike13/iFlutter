import { StyleSheet, Text, View, Image, ScrollView } from 'react-native'
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { images } from '../../../constants';

const AboutScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.mainHeaderText}>About</Text>
        <View style={styles.innerContainer}>
          <View style={styles.contentContainer}>
            <View style={styles.headerContainer}>
              <Image 
                source={images.logo}
                style={styles.imageLogo}
                resizeMode='contain'
              />
              <Text style={styles.appNameText}>iFlutter</Text>
            </View>
            <View>
              <Text style={styles.contentText}>
                A smart conservation tool called iFlutter was developed to 
                assist Semara's Farm Butterfly Sanctuary in safeguarding and 
                caring for its butterflies. The system uses Internet of Things 
                technology to continuously monitor important environmental 
                parameters like temperature, humidity, and light intensity. When 
                something changes, it instantly alerts caregivers, enabling them 
                to act swiftly and keep the atmosphere steady.
              </Text>
              <Text style={styles.contentText}>
                When necessary, users can utilize iFlutter to operate misting 
                systems to maintain cool, humid air. Butterfly habitat 
                management is made simple by the app, which promotes healthy 
                development, enhances survivorship, and reduces stress.
              </Text>
              <Text style={styles.contentText}>
                iFlutter simplifies, expedites, and improves butterfly care by 
                centralizing monitoring, automation, and updates.
              </Text>
              <Text style={styles.contentText}>
                iFlutter, which was initially created for Semara's Farm Butterfly 
                Sanctuary, encourages intelligent, technologically advanced 
                environmental stewardship while assisting in the preservation of 
                butterfly populations.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default AboutScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#c4c4c4',
  },
  scrollContent: {
    padding: 16,
    marginTop: -20
  },
  mainHeaderText:{
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    textAlign: 'center'
  },
  innerContainer:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  contentContainer: {
    width: '100%',
    height: 'auto',
    paddingHorizontal: 20,
    paddingVertical: 40,
    borderRadius: 20,
    backgroundColor: '#d9d9d9'
  },
  headerContainer:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  imageLogo: {
    width: 60,
    height: 60
  },
  appNameText:{
    fontFamily: 'Poppins-Regular',
    fontSize: 18
  },
  contentText:{
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    textAlign: 'justify',
    marginBottom: 20
  }
})