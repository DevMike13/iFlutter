import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  Modal,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-gifted-charts';
import { firestoreDB } from '../../../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';

const { width } = Dimensions.get('window');

const DataScreen = () => {
  const [sensorData, setSensorData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedData, setSelectedData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const [selectedRange, setSelectedRange] = useState('24h');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showPicker, setShowPicker] = useState({ type: null, visible: false });

  // Fetch Firestore data
  useEffect(() => {
    const q = query(collection(firestoreDB, 'sensorData'), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const d = doc.data();
        const date = new Date(d.timestamp.seconds * 1000);
        const shortLabel = `${date.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
        })}-${date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          hour12: true,
        })}`;
  
        return {
          timestamp: date,
          temperature: d.temperature,
          humidity: d.humidity,
          lightIntensity: d.lightIntensity,
          nectarLevel: d.nectarLevel,
          label: shortLabel,
        };
      });
  
      setSensorData(data);
      setLoading(false);
    });
  
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    if (sensorData.length === 0) return;

    const now = new Date();
    let filtered = [];

    if (selectedRange === 'custom' && startDate && endDate) {
      filtered = sensorData.filter(
        (item) => item.timestamp >= startDate && item.timestamp <= endDate
      );
    } else if (selectedRange === '24h') {
      const cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      filtered = sensorData.filter((item) => item.timestamp >= cutoff);
    } else if (selectedRange === '7d') {
      const cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = sensorData.filter((item) => item.timestamp >= cutoff);
    } else if (selectedRange === '30d') {
      const cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = sensorData.filter((item) => item.timestamp >= cutoff);
    } else {
      filtered = [...sensorData];
    }

    setFilteredData(filtered);
  }, [selectedRange, sensorData, startDate, endDate]);

  const toChartData = (key, unit = '') =>
    filteredData.map((item) => ({
      value: item[key],
      label: item.label,
      dataPointText: `${item[key]}${unit}`,
    }));

    const handlePointPress = (item, title) => {
      setSelectedData({ ...item, title });
      setModalVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    };

    const renderChart = (title, data, color) => (
      <View style={styles.chartContainer} key={title}>
        <Text style={styles.chartTitle}>{title}</Text>
        <LineChart
          data={data}
          width={width * 0.9}
          height={220}
          color1={color}
          curved
          areaChart
          startFillColor={`${color}55`}
          endFillColor={`${color}10`}
          startOpacity={0.8}
          endOpacity={0.1}
          thickness={4}
          hideDataPoints={false}
          // hideYAxisText
          pressPointEnabled
          focusEnabled
          dataPointsRadius={10}
          focusedDataPointRadius={8}
          focusedDataPointColor={color}
          showValuesAsDataPointsText
          textColor1="#222"
          textShiftY={30}
          textShiftX={-5}
          textFontSize={12}
          spacing={75}
          onPress={(item) => handlePointPress(item, title)}
          // focusedDataPointColor="#111"
          // focusedDataPointRadius={6}
          xAxisLabelTextStyle={{
            color: '#666',
            fontSize: 10,
            textAlign: 'center',
            fontFamily: 'Poppins-Regular'
          }}
          yAxisTextStyle={{ color: '#666', fontSize: 10, fontFamily: 'Poppins-SemiBold' }}
          noOfSections={5}
        />
      </View>
  );

  const ranges = [
    { label: '24h', value: '24h' },
    { label: '7d', value: '7d' },
    { label: '30d', value: '30d' },
    { label: 'All', value: 'all' },
    { label: 'Custom', value: 'custom' },
  ];

  const showDatePicker = (type) => {
    setShowPicker({ type, visible: true });
  };

  const onDateChange = (event, selectedDate) => {
    setShowPicker({ type: null, visible: false });

    if (!selectedDate) return;

    if (showPicker.type === 'start') setStartDate(selectedDate);
    if (showPicker.type === 'end') setEndDate(selectedDate);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Historical Data Overview</Text>

        {/* Date Range Buttons */}
        <View style={styles.rangeContainer}>
          {ranges.map((r) => (
            <TouchableOpacity
              key={r.value}
              style={[
                styles.rangeButton,
                selectedRange === r.value && styles.activeRangeButton,
              ]}
              onPress={() => setSelectedRange(r.value)}
            >
              <Text
                style={[
                  styles.rangeText,
                  selectedRange === r.value && styles.activeRangeText,
                ]}
              >
                {r.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedRange === 'custom' && (
          <View style={styles.customRangeWrapper}>
            <View style={styles.dateGroup}>
              <Text style={styles.dateLabel}>From</Text>
              <TouchableOpacity
                style={styles.dateButtonModern}
                onPress={() => showDatePicker('start')}
              >
                <Text style={styles.dateTextModern}>
                {startDate
                  ? startDate.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    }).replace(',', ',')
                  : 'Select'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dateGroup}>
              <Text style={styles.dateLabel}>To</Text>
              <TouchableOpacity
                style={styles.dateButtonModern}
                onPress={() => showDatePicker('end')}
              >
                <Text style={styles.dateTextModern}>
                {endDate
                  ? endDate.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    }).replace(',', ',')
                  : 'Select'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}


        {showPicker.visible && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onDateChange}
          />
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#000" style={{ marginTop: 40 }} />
        ) : filteredData.length === 0 ? (
          <Text style={styles.noData}>No data found</Text>
        ) : (
          <>
            {renderChart('Temperature (°C)', toChartData('temperature' , '°C'), '#3b82f6')}
            {renderChart('Humidity (%)', toChartData('humidity', '%'), '#10b981')}
            {renderChart('Light Intensity (lx)', toChartData('lightIntensity', ' lx'), '#f59e0b')}
            {renderChart('Nectar Level (%)', toChartData('nectarLevel', '%'), '#ef4444')}
          </>
        )}
      </ScrollView>

      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
            {selectedData && (
              <>
                <Text style={styles.modalTitle}>{selectedData.title}</Text>
                <Text style={styles.modalValue}>Value: {selectedData.value}</Text>
                <Text style={styles.modalTime}>{selectedData.label}</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    Animated.timing(fadeAnim, {
                      toValue: 0,
                      duration: 150,
                      useNativeDriver: true,
                    }).start(() => setModalVisible(false));
                  }}
                >
                  <Text style={styles.closeText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

export default DataScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  scrollContent: { alignItems: 'center', paddingTop: 30, paddingBottom: 100},
  title: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    marginBottom: 10,
  },
  rangeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  rangeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 6,
    marginBottom: 6,
  },
  activeRangeButton: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  rangeText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#444',
    fontSize: 12,
  },
  activeRangeText: {
    color: '#fff',
  },
  customRangeWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginVertical: 10,
    width: '90%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  
  dateGroup: {
    alignItems: 'center',
    flex: 1,
  },
  
  dateLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#555',
    marginBottom: 4,
  },
  
  dateButtonModern: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingVertical: 8,
    paddingHorizontal: 14,
    width: '90%',
    alignItems: 'center',
  },
  
  dateTextModern: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    color: '#111',
  },
  
  chartContainer: { marginBottom: 40, alignItems: 'center' },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    fontFamily: 'Poppins-SemiBold',
  },
  noData: {
    fontSize: 16,
    color: '#999',
    fontFamily: 'Poppins-SemiBold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.8,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 10,
  },
  modalTitle: { fontSize: 18, fontFamily: 'Poppins-Bold', color: '#111' },
  modalValue: {
    fontSize: 16,
    marginTop: 10,
    color: '#3b82f6',
    fontFamily: 'Poppins-Regular',
  },
  modalTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontFamily: 'Poppins-SemiBold',
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: '#3b82f6',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  closeText: {
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
  },
});
