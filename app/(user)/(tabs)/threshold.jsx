import { StyleSheet, Text, View, Image, ScrollView, FlatList, TouchableOpacity, Dimensions, Switch, Modal, TextInput, Animated } from 'react-native'
import { useEffect, useState, useRef } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { realtimeDB } from '../../../firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { images } from '../../../constants';

const { width } = Dimensions.get('window');
const tabList = ['Monitoring', 'Threshold'];


const ThresholdScreen = () => {
  const [activeTab, setActiveTab] = useState(tabList[0]);
  const [isEnabledManual, setIsEnabledManual] = useState(false);

  const [isEnabledMisting, setIsEnabledMisting] = useState(false);
  const [isEnabledHeating, setIsEnabledHeating] = useState(false);
  const [isEnabledLighting, setIsEnabledLighting] = useState(false);

  const [isExpanded, setIsExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [nectar, setNectar] = useState(null);
  const [light, setLight] = useState(null);

  const [isTempModalVisible, setIsTempModalVisible] = useState(false);
  const [minTemp, setMinTemp] = useState('');
  const [maxTemp, setMaxTemp] = useState('');

  const [isHumidModalVisible, setIsHumidModalVisible] = useState(false);
  const [minHumid, setMinHumid] = useState('');
  const [maxHumid, setMaxHumid] = useState('');

  const [isLightModalVisible, setIsLightModalVisible] = useState(false);
  const [minLight, setMinLight] = useState('');
  const [maxLight, setMaxLight] = useState('');

  const [isNectarModalVisible, setIsNectarModalVisible] = useState(false);
  const [minNectar, setMinNectar] = useState('');
  const [maxNectar, setMaxNectar] = useState('');

  const toggleAccordion = () => {
    setIsExpanded(!isExpanded);
    Animated.timing(animation, {
      toValue: isExpanded ? 0 : 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const height = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 170],
  });

  useEffect(() => {
    if (isTempModalVisible) {
      const minRef = ref(realtimeDB, 'Temperature/Min');
      const maxRef = ref(realtimeDB, 'Temperature/Max');
  
      onValue(minRef, snapshot => {
        if (snapshot.exists()) setMinTemp(String(snapshot.val()));
      });
  
      onValue(maxRef, snapshot => {
        if (snapshot.exists()) setMaxTemp(String(snapshot.val()));
      });
    }
  }, [isTempModalVisible]);

  useEffect(() => {
    if (isHumidModalVisible) {
      const minRef = ref(realtimeDB, 'Humidity/Min');
      const maxRef = ref(realtimeDB, 'Humidity/Max');
  
      onValue(minRef, snapshot => {
        if (snapshot.exists()) setMinHumid(String(snapshot.val()));
      });
  
      onValue(maxRef, snapshot => {
        if (snapshot.exists()) setMaxHumid(String(snapshot.val()));
      });
    }
  }, [isHumidModalVisible]);

  useEffect(() => {
    if (isLightModalVisible) {
      const minRef = ref(realtimeDB, 'LightIntensity/Min');
      const maxRef = ref(realtimeDB, 'LightIntensity/Max');
  
      onValue(minRef, snapshot => {
        if (snapshot.exists()) setMinLight(String(snapshot.val()));
      });
  
      onValue(maxRef, snapshot => {
        if (snapshot.exists()) setMaxLight(String(snapshot.val()));
      });
    }
  }, [isLightModalVisible]);

  useEffect(() => {
    if (isNectarModalVisible) {
      const minRef = ref(realtimeDB, 'NectarLevel/Min');
      const maxRef = ref(realtimeDB, 'NectarLevel/Max');
  
      onValue(minRef, snapshot => {
        if (snapshot.exists()) setMinNectar(String(snapshot.val()));
      });
  
      onValue(maxRef, snapshot => {
        if (snapshot.exists()) setMaxNectar(String(snapshot.val()));
      });
    }
  }, [isNectarModalVisible]);

  const updateThreshold = async (path, minValue, maxValue) => {
    try {
      await set(ref(realtimeDB, `${path}/Min`), parseFloat(minValue));
      await set(ref(realtimeDB, `${path}/Max`), parseFloat(maxValue));
      console.log(`${path} threshold updated: Min=${minValue}, Max=${maxValue}`);
    } catch (error) {
      console.error("Error updating threshold:", error);
    }
  };
  
  const toggleManual = (value) => {
    set(ref(realtimeDB, '/ManualControls/Manual'), value ? 'ON' : 'OFF');
  };

  const toggleMisting = (value) => {
    set(ref(realtimeDB, '/ManualControls/Misting'), value ? 'ON' : 'OFF');
  };

  const toggleHeating = (value) => {
    set(ref(realtimeDB, '/ManualControls/Heating'), value ? 'ON' : 'OFF');
  };

  const toggleLighting = (value) => {
    set(ref(realtimeDB, '/ManualControls/Lighting'), value ? 'ON' : 'OFF');
  };

  useEffect(() => {
    const manualRef = ref(realtimeDB, '/ManualControls/Manual');
    const mistingRef = ref(realtimeDB, '/ManualControls/Misting');
    const heatingRef = ref(realtimeDB, '/ManualControls/Heating');
    const lightingRef = ref(realtimeDB, '/ManualControls/Lighting');

    const unsubManual = onValue(manualRef, (snapshot) => {
      const value = snapshot.val();
      setIsEnabledManual(value === 'ON');
    });

    const unsubMisting = onValue(mistingRef, (snapshot) => {
      const value = snapshot.val();
      setIsEnabledMisting(value === 'ON');
    });
    const unsubHeating = onValue(heatingRef, (snapshot) => {
      const value = snapshot.val();
      setIsEnabledHeating(value === 'ON');
    });
    const unsubLighting = onValue(lightingRef, (snapshot) => {
      const value = snapshot.val();
      setIsEnabledLighting(value === 'ON');
    });

    // Cleanup listeners
    return () => {
      unsubManual();
      unsubMisting();
      unsubHeating();
      unsubLighting();
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


  useEffect(() => {
    const tempMinRef = ref(realtimeDB, 'Temperature/Min');
    const tempMaxRef = ref(realtimeDB, 'Temperature/Max');
    const humidMinRef = ref(realtimeDB, 'Humidity/Min');
    const humidMaxRef = ref(realtimeDB, 'Humidity/Max');
  
    const unsubTempMin = onValue(tempMinRef, snapshot => {
      if (snapshot.exists()) setMinTemp(String(snapshot.val()));
    });
    const unsubTempMax = onValue(tempMaxRef, snapshot => {
      if (snapshot.exists()) setMaxTemp(String(snapshot.val()));
    });
  
    const unsubHumidMin = onValue(humidMinRef, snapshot => {
      if (snapshot.exists()) setMinHumid(String(snapshot.val()));
    });
    const unsubHumidMax = onValue(humidMaxRef, snapshot => {
      if (snapshot.exists()) setMaxHumid(String(snapshot.val()));
    });
  
    return () => {
      unsubTempMin();
      unsubTempMax();
      unsubHumidMin();
      unsubHumidMax();
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
                  trackColor={{ isEnabledManual: '#767577', true: '#19354d' }}
                  thumbColor={isEnabledManual ? 'white' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleManual}
                  value={isEnabledManual}
                  style={styles.switch}
                />
                <Text style={styles.switchText}>Manual Control</Text>
                <TouchableOpacity onPress={toggleAccordion} style={styles.iconButton}>
                  <Ionicons 
                    name={isExpanded ? 'chevron-up' : 'chevron-down'} 
                    size={22} 
                    color="white" 
                  />
                </TouchableOpacity>
              </View>

              <Animated.View style={[styles.accordionContent, { height }]}>
                {isExpanded && (
                  <View style={styles.innerContent}>
                    {/* MISTING */}
                    <View style={styles.subSwitchContainer}>
                      <Text style={styles.subSwitchText}>Misting</Text>
                      <Switch
                        trackColor={{ isEnabledMisting: '#767577', true: '#19354d' }}
                        thumbColor={isEnabledMisting ? 'white' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleMisting}
                        value={isEnabledMisting}
                        style={styles.switch}
                      />
                    </View>

                    {/* Heating */}
                    <View style={styles.subSwitchContainer}>
                      <Text style={styles.subSwitchText}>Heating</Text>
                      <Switch
                        trackColor={{ isEnabledHeating: '#767577', true: '#19354d' }}
                        thumbColor={isEnabledHeating ? 'white' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleHeating}
                        value={isEnabledHeating}
                        style={styles.switch}
                      />
                    </View>

                     {/* Lighting */}
                     <View style={styles.subSwitchContainer}>
                      <Text style={styles.subSwitchText}>Lighting</Text>
                      <Switch
                        trackColor={{ isEnabledLighting: '#767577', true: '#19354d' }}
                        thumbColor={isEnabledLighting ? 'white' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleLighting}
                        value={isEnabledLighting}
                        style={styles.switch}
                      />
                    </View>
                  </View>
                )}
              </Animated.View>
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
                      <Text numberOfLines={1} adjustsFontSizeToFit style={styles.sensorValueText}>{temperature !== null ? `${temperature}° C` : '...'}</Text>
                      <Text style={[
                          styles.sensorStatusText,
                          {
                            color:
                              temperature === null
                                ? 'gray'
                                : temperature > maxTemp
                                ? 'red'
                                : temperature < minTemp
                                ? 'lightblue'
                                : 'green',
                          },
                        ]}
                      >
                        {temperature === null
                          ? 'Reading...'
                          : temperature > maxTemp
                          ? 'High Temperature'
                          : temperature < minTemp
                          ? 'Low Temperature'
                          : 'Normal Temperature'}
                      </Text>
                      <Text style={[styles.sensorStatusText, { fontSize: 10, marginTop: 5 }]}>
                        Safe Range: {minTemp}°C - {maxTemp}°C
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
                      <Text numberOfLines={1} adjustsFontSizeToFit style={styles.sensorValueText}>{humidity !== null ? `${humidity}%` : '...'}</Text>
                      <Text style={[
                          styles.sensorStatusText,
                          {
                            color:
                              humidity === null
                                ? 'gray' 
                                : humidity > maxHumid
                                ? 'red'
                                : humidity < minHumid
                                ? 'lightblue'
                                : 'green',
                          },
                        ]}
                      >
                        {humidity === null
                          ? 'Reading...'
                          : humidity > maxHumid
                          ? 'High Humidity'
                          : humidity < minHumid
                          ? 'Low Humidity'
                          : 'Good Condition'}
                      </Text>
                      <Text style={[styles.sensorStatusText, { fontSize: 10, marginTop: 5 }]}>
                        Safe Range: {minHumid}% - {maxHumid}%
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
                      <Text numberOfLines={1} adjustsFontSizeToFit style={styles.sensorValueText}>{nectar !== null ? `${nectar}%` : '...'}</Text>
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
                      <Text numberOfLines={1} adjustsFontSizeToFit style={styles.sensorValueText}>{light !== null ? `${light.toLocaleString()}` : '...'}</Text>
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
          <Text style={styles.contentTitle}>SELECT PARAMETERS</Text>
          <TouchableOpacity 
            style={styles.thresholdButton} 
            onPress={() => setIsTempModalVisible(true)}
          >
            <Text style={styles.thresholdButtonText}>Temperature</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.thresholdButton} 
            onPress={() => setIsHumidModalVisible(true)}
          >
            <Text style={styles.thresholdButtonText}>Humidity</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.thresholdButton} 
            onPress={() => setIsLightModalVisible(true)}
          >
            <Text style={styles.thresholdButtonText}>Light Intensity</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.thresholdButton} 
            onPress={() => setIsNectarModalVisible(true)}
          >
            <Text style={styles.thresholdButtonText}>Nectar Level</Text>
          </TouchableOpacity>
        </View>
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

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.scrollContent,
          { flexGrow: 1 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        
        <View style={[styles.innerContainer, { flex: 1, paddingBottom: 20 }]}>
          {renderContent()}
        </View>
      </ScrollView>

      {/* TEMP MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isTempModalVisible}
        onRequestClose={() => setIsTempModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Set Temperature Threshold</Text>

            <Text style={styles.modalInputTitle}>Min Temperature</Text>
            <TextInput 
              style={styles.modalInput}
              placeholder="Enter min temperature..."
              keyboardType="numeric"
              value={minTemp}
              onChangeText={setMinTemp}
            />

            <Text style={styles.modalInputTitle}>Max Temperature</Text>
            <TextInput 
              style={styles.modalInput}
              placeholder="Enter max temperature..."
              keyboardType="numeric"
              value={maxTemp}
              onChangeText={setMaxTemp}
            />

            <View style={styles.modalButtonRow}>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: 'red' }]} 
                onPress={() => setIsTempModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: 'green' }]} 
                onPress={async () => {
                  await updateThreshold('Temperature', minTemp, maxTemp);
                  setIsTempModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* HUMID MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isHumidModalVisible}
        onRequestClose={() => setIsHumidModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Set Humidity Threshold</Text>

            <Text style={styles.modalInputTitle}>Min Humidity</Text>
            <TextInput 
              style={styles.modalInput}
              placeholder="Enter min humidity..."
              keyboardType="numeric"
              value={minHumid}
              onChangeText={setMinHumid}
            />

            <Text style={styles.modalInputTitle}>Max Humidity</Text>
            <TextInput 
              style={styles.modalInput}
              placeholder="Enter max humdity..."
              keyboardType="numeric"
              value={maxHumid}
              onChangeText={setMaxHumid}
            />

            <View style={styles.modalButtonRow}>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: 'red' }]} 
                onPress={() => setIsHumidModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: 'green' }]} 
                onPress={async () => {
                  await updateThreshold('Humidity', minHumid, maxHumid);
                  setIsHumidModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* LIGHT MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isLightModalVisible}
        onRequestClose={() => setIsLightModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Set Light Intensity Threshold</Text>

            <Text style={styles.modalInputTitle}>Min Light Intensity</Text>
            <TextInput 
              style={styles.modalInput}
              placeholder="Enter min light intensity..."
              keyboardType="numeric"
              value={minLight}
              onChangeText={setMinLight}
            />

            <Text style={styles.modalInputTitle}>Max Light Intensity</Text>
            <TextInput 
              style={styles.modalInput}
              placeholder="Enter max light intensity..."
              keyboardType="numeric"
              value={maxLight}
              onChangeText={setMaxLight}
            />

            <View style={styles.modalButtonRow}>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: 'red' }]} 
                onPress={() => setIsLightModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: 'green' }]} 
                onPress={async () => {
                  await updateThreshold('LightIntensity', minLight, maxLight);
                  setIsLightModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* NECTAR MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isNectarModalVisible}
        onRequestClose={() => setIsNectarModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Set Nectar Level Threshold</Text>

            <Text style={styles.modalInputTitle}>Min Nectar Level</Text>
            <TextInput 
              style={styles.modalInput}
              placeholder="Enter min nectar level..."
              keyboardType="numeric"
              value={minNectar}
              onChangeText={setMinNectar}
            />

            <Text style={styles.modalInputTitle}>Max Nectar Level</Text>
            <TextInput 
              style={styles.modalInput}
              placeholder="Enter max nectar level..."
              keyboardType="numeric"
              value={maxNectar}
              onChangeText={setMaxNectar}
            />

            <View style={styles.modalButtonRow}>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: 'red' }]} 
                onPress={() => setIsNectarModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: 'green' }]} 
                onPress={async () => {
                  await updateThreshold('NectarLevel', minNectar, maxNectar);
                  setIsNectarModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

export default ThresholdScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#c4c4c4',
    // backgroundColor: 'blue'
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
    // flex: 1,
    padding: 16,
    paddingBottom: 50,
    flexGrow: 1
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    height: 'auto',
    padding: 10,
    borderRadius: 20,
    // backgroundColor: '#c4c4c4'
  },
  contentTitle: {
    fontFamily: 'Poppins-SemiBold',
    marginHorizontal: 'auto',
    fontSize: 26,
    marginBottom: 30
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
    gap: 12
  },
  switchContainer:{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingTop: 10,
    paddingBottom: 10
    // marginBottom: 10
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
    fontSize: 36,
    textAlign: 'center'
  },
  sensorStatusText:{
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    textAlign: 'center'
  },

  iconButton: {
    marginLeft: 'auto'
  },
  accordionContent: {
    overflow: 'hidden',
    
  },
  innerContent: {
    padding: 15,
    borderTopWidth: 2,
    borderColor: 'gray',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 8,
  },

  subSwitchText:{
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    marginBottom: -2
  },

  subSwitchContainer:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: 20,
    paddingTop: 10,
    paddingBottom: 10
  },

  // MODAL
  thresholdButton: {
    backgroundColor: '#82797a',
    padding: 18,
    borderRadius: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  thresholdButtonText: {
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
  
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 15,
  },
  modalInputTitle:{
    marginRight: 'auto',
    fontFamily: 'Poppins-Regular',
  },
  modalInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 18,
    marginVertical: 10,
    fontFamily: 'Poppins-Regular',
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
  
})
