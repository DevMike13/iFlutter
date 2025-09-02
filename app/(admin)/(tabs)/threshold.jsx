import { StyleSheet, Text, View, Image, ScrollView, FlatList, TouchableOpacity, Dimensions, Switch, Modal, TextInput } from 'react-native'
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
                      <Text numberOfLines={1} adjustsFontSizeToFit style={styles.sensorValueText}>{temperature !== null ? `${temperature}° C` : '...'}</Text>
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
                      <Text numberOfLines={1} adjustsFontSizeToFit style={styles.sensorValueText}>{humidity !== null ? `${humidity}%` : '...'}</Text>
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
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.scrollContent,
          { flexGrow: 1 } // Ensures it fills the screen height
        ]}
        showsVerticalScrollIndicator={false}
      >
        
        <View style={[styles.innerContainer, { flex: 1 }]}>
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
    // flex: 1,
    padding: 16,
    flexGrow: 1
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    height: 'auto',
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#c4c4c4'
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
    gap: 20
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
