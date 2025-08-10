import { StyleSheet, Text, View, Image, ScrollView, FlatList, TouchableOpacity, Dimensions, Switch } from 'react-native'
import { useEffect, useState } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { realtimeDB } from '../../../firebase';
import { SafeAreaView } from 'react-native-safe-area-context';

import { images } from '../../../constants';

const { width } = Dimensions.get('window');
const tabList = ['Monitoring', 'Threshold'];


const ThresholdScreen = () => {
  const [activeTab, setActiveTab] = useState(tabList[0]);
  const [isEnabledControl, setIsEnabledControl] = useState(false);
  const [isEnabledAuto, setIsEnabledAuto] = useState(false);

  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [nectar, setNectar] = useState(null);
  const [light, setLight] = useState(null);

  const toggleControl = (value) => {
    set(ref(realtimeDB, '/ManualControls/Control'), value ? 'ON' : 'OFF');
  };
  
  const toggleAuto = (value) => {
    set(ref(realtimeDB, '/ManualControls/Auto'), value ? 'ON' : 'OFF');
  };

  useEffect(() => {
    const controlRef = ref(realtimeDB, '/ManualControls/Control');
    const autoRef = ref(realtimeDB, '/ManualControls/Auto');

    const unsubControl = onValue(controlRef, (snapshot) => {
      const value = snapshot.val();
      setIsEnabledControl(value === 'ON');
    });

    const unsubAuto = onValue(autoRef, (snapshot) => {
      const value = snapshot.val();
      setIsEnabledAuto(value === 'ON');
    });

    // Cleanup listeners
    return () => {
      unsubControl();
      unsubAuto();
    };
  }, []);

  useEffect(() => {
    
    const tempRef = ref(realtimeDB, 'Temperature/SensorValue');
    const humidRef = ref(realtimeDB, 'Humidity/SensorValue');
    const nectarRef = ref(realtimeDB, 'NectarLevel/SensorValue');
    const lightRef = ref(realtimeDB, 'LightIntensity/SensorValue');

    const unsubTemp = onValue(tempRef, snapshot => {
      if (snapshot.exists()) setTemperature(snapshot.val());
    });

    const unsubHumid = onValue(humidRef, snapshot => {
      if (snapshot.exists()) setHumidity(snapshot.val());
    });

    const unsubNectar = onValue(nectarRef, snapshot => {
      if (snapshot.exists()) setNectar(snapshot.val());
    });

    const unsubLight = onValue(lightRef, snapshot => {
      if (snapshot.exists()) setLight(snapshot.val());
    });

    return () => {
      unsubTemp();
      unsubHumid();
      unsubNectar();
      unsubLight();
    };
  }, []);


  const renderContent = () => {
    if (activeTab === 'Monitoring') {
      return (
        <View style={styles.contentContainer}>
          <View>
            <Text style={styles.autoTitleText}>AUTOMATION CONTROL</Text>
            <View style={styles.autoControlContainer}>
              <View style={styles.switchContainer}>
                <Switch
                  trackColor={{ isEnabledControl: '#767577', true: '#19354d' }}
                  thumbColor={isEnabledControl ? 'white' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleControl}
                  value={isEnabledControl}
                  style={styles.switch}
                />
                <Text style={styles.switchText}>Control</Text>
              </View>
              
              <View style={styles.switchContainer}>
                <Switch
                  trackColor={{ isEnabledAuto: '#767577', true: '#19354d' }}
                  thumbColor={isEnabledAuto ? 'white' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleAuto}
                  value={isEnabledAuto}
                  style={styles.switch}
                />
                <Text style={styles.switchText}>Auto</Text>
              </View>
            </View>

            <View style={styles.sensorMainContainer}>

              {/* 1st Container */}
              <View style={styles.cardContentContainer}>
                <View style={styles.sensorCard}>
                  <Text style={styles.cardTitle}>TEMPERATURE</Text>
                  <View style={styles.sensorReadingCard}>
                    <Image 
                      source={images.tempIcon}
                      style={styles.sensorIcon}
                      resizeMode='contain'
                    />
                    <View>
                      <Text style={styles.sensorValueText}>{temperature !== null ? `${temperature}° C` : '...'}</Text>
                      <Text style={[
                          styles.sensorStatusText,
                          {
                            color:
                              temperature === null
                                ? 'gray'
                                : temperature > 30
                                ? 'red'
                                : temperature < 18
                                ? 'lightblue'
                                : 'green',
                          },
                        ]}
                      >
                        {temperature === null
                          ? 'Reading...'
                          : temperature > 30
                          ? 'High Temperature'
                          : temperature < 18
                          ? 'Low Temperature'
                          : 'Normal Temperature'}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.sensorCard}>
                  <Text style={styles.cardTitle}>HUMIDITY</Text>
                  <View style={styles.sensorReadingCard}>
                    <Image 
                      source={images.humidIcon}
                      style={styles.sensorIcon}
                      resizeMode='contain'
                    />
                    <View>
                      <Text style={styles.sensorValueText}>{humidity !== null ? `${humidity}%` : '...'}</Text>
                      <Text style={[
                          styles.sensorStatusText,
                          {
                            color:
                              humidity === null
                                ? 'gray'
                                : humidity > 70
                                ? 'red'
                                : humidity < 30
                                ? 'lightblue'
                                : 'green',
                          },
                        ]}
                      >
                        {humidity === null
                          ? 'Reading...'
                          : humidity > 70
                          ? 'High Humidity'
                          : humidity < 30
                          ? 'Low Humidity'
                          : 'Good Condition'}
                      </Text>
                    </View>
                  </View>
                </View>

              </View>

              {/* 2nd Container */}
              <View style={styles.cardContentContainer}>
                <View style={styles.sensorCard}>
                  <Text style={styles.cardTitle}>NECTAR LEVEL</Text>
                  <View style={styles.sensorReadingCard}>
                    <Image 
                      source={images.nectarIcon}
                      style={styles.sensorIcon}
                      resizeMode='contain'
                    />
                    <View>
                      <Text style={styles.sensorValueText}>{nectar !== null ? `${nectar}%` : '...'}</Text>
                      <Text style={[
                          styles.sensorStatusText,
                          {
                            color:
                              nectar === null
                                ? 'gray'
                                : nectar < 20
                                ? 'red'
                                : nectar < 50
                                ? 'orange'
                                : 'green',
                          },
                        ]}
                      >
                        {nectar === null
                          ? 'Reading...'
                          : nectar < 20
                          ? 'Ready for Refill'
                          : nectar < 50
                          ? 'Low Level'
                          : 'Sufficient Nectar'}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.sensorCard}>
                  <Text style={styles.cardTitle}>LIGHT INTENSITY</Text>
                  <View style={styles.sensorReadingCard}>
                    <Image 
                      source={images.lightIcon}
                      style={styles.sensorIcon}
                      resizeMode='contain'
                    />
                    <View>
                      <Text style={styles.sensorValueText}>{light !== null ? `${light.toLocaleString()}` : '...'}</Text>
                      <Text style={styles.sensorStatusText}>Lux</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      );
    }

    if (activeTab === 'Threshold') {
      return (
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Image 
              source={images.logo}
              style={styles.imageLogo}
              resizeMode='contain'
            />
            <Text style={styles.appNameText}>iFlutter - Threshold</Text>
          </View>
          <Text style={styles.contentText}>
            Threshold settings allow you to define the ideal temperature, humidity, 
            and light intensity levels for your butterflies. When readings go outside 
            these limits, alerts will be sent instantly.
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabContainer}>
        <FlatList
          data={tabList}
          horizontal
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setActiveTab(item)}
              style={[
                styles.tabButton,
                { width: width / 2 - 8 },
                activeTab === item ? styles.activeTabButton : styles.inactiveTabButton
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === item ? styles.activeTabText : styles.inactiveTabText
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          style={styles.flatList}
        />
      </View>

      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent,
          { flexGrow: 1 } // Ensures it fills the screen height
        ]}
        showsVerticalScrollIndicator={false}
      >
        
        <View style={styles.innerContainer}>
          {renderContent()}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ThresholdScreen

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#c4c4c4',
    // backgroundColor: 'blue'
  },
  tabContainer: {
    width: '100%',
    backgroundColor: '#c4c4c4',
    borderRadius: 999,
    paddingHorizontal: 8,
    marginBottom: 5,
    marginTop: -5
  },
  flatList: {
    borderRadius: 999,
  },
  tabButton: {
    paddingVertical: 7,
    paddingHorizontal: 24,
    borderRadius: 999,
    marginRight: 4,
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
    flexGrow: 1
  },
  contentContainer: {
    width: '100%',
    height: 'auto',
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#c4c4c4'
  },

  autoTitleText:{
    fontFamily: 'Poppins-SemiBold',
  },
  autoControlContainer:{
    backgroundColor: '#b2d4d6',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  switchContainer:{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20
  },
  switch: {
    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }]
  },
  switchText:{
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    marginBottom: -2
  },

  // Sensors
  sensorMainContainer:{
    marginTop: 10
  },
  cardContentContainer:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  cardTitle:{
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    textAlign: 'center'
  },
  sensorCard:{
    width: width / 2 - 30,
  },
  sensorReadingCard:{
    backgroundColor: '#bbb6a3',
    borderRadius: 20,
    padding: 20
  },
  sensorIcon:{
    width: 40,
    height: 40
  },
  sensorValueText:{
    fontFamily: 'Poppins-SemiBold',
    fontSize: 42,
    textAlign: 'center'
  },
  sensorStatusText:{
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    textAlign: 'center'
  }
})
