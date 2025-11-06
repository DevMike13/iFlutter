import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Dimensions, FlatList } from 'react-native'
import { useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { images } from '../../../constants';

const { width } = Dimensions.get('window');
const tabList = ['User Manual', 'About'];

const AboutScreen = () => {
  const [activeTab, setActiveTab] = useState(tabList[0]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);

  const manualSteps = [
    {
      id: 1,
      title: 'Tab 1: Analytics',
      description: 'View Historical Data Readings',
      image: images.analytics,
    },
    {
      id: 2,
      title: 'Tab 2: Monitoring',
      description: 'The users can view real time monitoring',
      image: images.sensorReadings,
    },
    {
      id: 3,
      title: 'Tab 2: Manual Controls',
      description: 'Access Monitoring and Manual Controls',
      image: images.manualControls,
    },
    {
      id: 4,
      title: 'Tab 3: Threshold Control',
      description: 'The users can set threshold to the selected parameters',
      image: images.thresholds,
    },
    {
      id: 5,
      title: 'Step 4: Accounts',
      description: 'View User Account Management',
      image: images.accounts,
    },
  ];

  const handleNext = () => {
    if (currentIndex < manualSteps.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      scrollRef.current.scrollTo({ x: width * newIndex, animated: true });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      scrollRef.current.scrollTo({ x: width * newIndex, animated: true });
    }
  };

  const renderContent = () => {
    if (activeTab === 'User Manual') {
      return (
        <View style={styles.userManualContainer}>
          <Text style={styles.mainHeaderText}>User Manual</Text>
    
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToInterval={width}
            decelerationRate="fast"
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setCurrentIndex(index);
            }}
          >
            {manualSteps.map((item) => (
              <View 
                key={item.id}
                style={{
                  width,                      // full width of screen
                  // justifyContent: 'center',   // center vertically
                  alignItems: 'center',       // center horizontally
                }}
              >
                <View style={styles.card}>
                  <Image source={item.image} style={styles.cardImage} resizeMode="contain" />
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardDescription}>{item.description}</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>


          {/* Bullet Indicators */}
          <View style={styles.progressContainer}>
            <View style={styles.bulletContainer}>
              {manualSteps.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.bullet,
                    currentIndex === index && styles.activeBullet,
                  ]}
                />
              ))}
            </View>

            {/* Chevron Controls */}
            <View style={styles.navContainer}>
              <TouchableOpacity
                onPress={handlePrev}
                disabled={currentIndex === 0}
                style={[
                  styles.navButton,
                  currentIndex === 0 && styles.navButtonDisabled,
                ]}
              >
                <Ionicons name="chevron-back-outline" size={26} color="#19354d" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleNext}
                disabled={currentIndex === manualSteps.length - 1}
                style={[
                  styles.navButton,
                  currentIndex === manualSteps.length - 1 && styles.navButtonDisabled,
                ]}
              >
                <Ionicons name="chevron-forward-outline" size={26} color="#19354d" />
              </TouchableOpacity>
            </View>
          </View>

        </View>
      );
    }
    
    

    if (activeTab === 'About') {
      return (
        <>
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
        </>
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabContainer}>
        {tabList.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setActiveTab(item)}
            style={[
              styles.tabButton,
              activeTab === item ? styles.activeTabButton : styles.inactiveTabButton,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === item ? styles.activeTabText : styles.inactiveTabText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={[styles.innerContainer, { flex: 1, marginVertical: 20 }]}>
        {activeTab === 'About' ? (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {renderContent()}
          </ScrollView>
        ) : (
          renderContent()
        )}
      </View>
    </SafeAreaView>
  )
}

export default AboutScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#c4c4c4',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#c4c4c4',
    borderRadius: 40,
    marginHorizontal: 20,
    overflow: 'hidden',
    // marginBottom: 10,
    // marginTop: 10,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  activeTabButton: {
    backgroundColor: '#19354d',
  },
  
  inactiveTabButton: {
    backgroundColor: '#c4c4c4',
  },
  
  tabText: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  
  activeTabText: {
    color: '#ffffff',
    fontFamily: 'Poppins-SemiBold',
  },
  
  inactiveTabText: {
    color: '#6b7280',
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
  },

  userManualContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingBottom: 80, // leaves space above the tab bar
  },
  
  carouselContainer: {
    paddingHorizontal: 10,
  },
  
  card: {
    width: width * 0.8,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    overflow: 'hidden',
    alignItems: 'center',
  },
  
  cardImage: {
    width: '90%',
    height: 200, // slightly taller so image fits well
    borderRadius: 16,
    resizeMode: 'contain', // <- key part!
    marginBottom: 10,
  },
  
  cardTextContainer: {
    padding: 15,
    alignItems: 'center',
  },
  
  cardTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    marginBottom: 8,
    color: '#19354d',
    textAlign: 'center',
  },
  
  cardDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
  },
  
  progressContainer: {
    marginTop: 25,
    marginBottom: 30,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  bulletContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 50,
    backgroundColor: '#cbd5e1',
    marginHorizontal: 5,
    opacity: 0.5,
    transition: 'all 0.2s ease-in-out',
  },
  
  activeBullet: {
    width: 12,
    height: 12,
    backgroundColor: '#19354d',
    opacity: 1,
  },
  
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
  },
  
  navButton: {
    backgroundColor: '#f1f5f9',
    borderRadius: 50,
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  
  navButtonDisabled: {
    opacity: 0.3,
  },
  
  
})