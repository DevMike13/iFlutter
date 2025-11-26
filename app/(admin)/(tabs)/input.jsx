import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  TextInput,
  SafeAreaView,
  Modal,
  FlatList,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { firestoreDB } from "../../../firebase";
import { collection, addDoc, Timestamp, query, where, getDocs, orderBy } from "firebase/firestore";
import Ionicons from "react-native-vector-icons/Ionicons";
import moment from "moment";

export default function DailyReport() {
  const [visible, setVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [stage, setStage] = useState("Larvae");
  const [reportType, setReportType] = useState("Mortality");
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");

  const [monthFilter, setMonthFilter] = useState(new Date());
  const [summary, setSummary] = useState({
    Larvae: { Mortality: 0, Produced: 0 },
    Pupa: { Mortality: 0, Produced: 0 },
    Butterfly: { Mortality: 0, Produced: 0 },
  });
  const [monthlyData, setMonthlyData] = useState([]);

  const handleSave = async () => {
    // Prevent saving if quantity is empty or zero
    if (!quantity || parseInt(quantity, 10) <= 0) {
      alert("Please enter a valid quantity before saving.");
      return;
    }
  
    try {
      await addDoc(collection(firestoreDB, "daily_reports"), {
        date: Timestamp.fromDate(date),
        stage,
        type: reportType,
        quantity: parseInt(quantity, 10),
        notes,
        createdAt: Timestamp.now(),
      });
  
      alert("Report saved successfully!");
      setQuantity("");
      setNotes("");
      setVisible(false);
      fetchSummary(monthFilter);
    } catch (err) {
      console.error("Error saving report:", err);
      alert("Error saving report.");
    }
  };
  

  const fetchSummary = async (monthDate) => {
    try {
      const start = moment(monthDate).startOf("month").toDate();
      const end = moment(monthDate).endOf("month").toDate();

      const q = query(
        collection(firestoreDB, "daily_reports"),
        where("date", ">=", Timestamp.fromDate(start)),
        where("date", "<=", Timestamp.fromDate(end)),
        orderBy("date", "desc")
      );

      const snapshot = await getDocs(q);

      const totals = {
        Larvae: { Mortality: 0, Produced: 0 },
        Pupa: { Mortality: 0, Produced: 0 },
        Butterfly: { Mortality: 0, Produced: 0 },
      };
      const allData = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        const qty = data.quantity || 0;

        // Update totals
        if (totals[data.stage] && totals[data.stage][data.type] !== undefined) {
          totals[data.stage][data.type] += qty;
        }

        // Collect for monthly list
        allData.push({
          id: doc.id,
          date: data.date.toDate(),
          stage: data.stage,
          type: data.type,
          quantity: qty,
        });
      });

      setSummary(totals);
      setMonthlyData(allData);
    } catch (err) {
      console.error("Error fetching summary:", err);
    }
  };

  useEffect(() => {
    fetchSummary(monthFilter);
  }, [monthFilter]);

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
        
      {/* New Entry Button */}
      <TouchableOpacity
        style={styles.newEntryBtn}
        onPress={() => setVisible(true)}
      >
        <Ionicons name="add-circle-outline" size={24} color="#fff" />
        <Text style={styles.newEntryText}>New Entry</Text>
      </TouchableOpacity>

      {/* Month Filter */}
      <View style={{ marginBottom: 20 }}>
        <Text style={styles.label}>Select Month</Text>
        <TouchableOpacity
          style={styles.dateBox}
          onPress={() => setShowPicker(true)}
        >
          <Text style={styles.dateText}>{moment(monthFilter).format("MMMM YYYY")}</Text>
        </TouchableOpacity>
        {showPicker && (
          <DateTimePicker
            value={monthFilter}
            mode="date"
            display="spinner"
            onChange={(event, selectedDate) => {
              setShowPicker(Platform.OS === "ios");
              if (selectedDate) setMonthFilter(selectedDate);
            }}
          />
        )}
      </View>

      {/* Summary Cards Row */}
      <View style={styles.cardsRow}>
        {["Larvae", "Pupa", "Butterfly"].map((s) => (
          <View key={s} style={styles.card}>
            <Text style={styles.stage}>{s}</Text>
            <View style={{ marginTop: 8 }}>
              <Text style={styles.qty}>Mortality: {summary[s].Mortality}</Text>
              <Text style={styles.qty}>Produced: {summary[s].Produced}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Monthly Data List */}
    <View style={{ marginTop: 20, height: 300 }}>
        <Text style={[styles.label, { marginBottom: 10 }]}>All Reports</Text>
        {monthlyData.length === 0 ? (
            <Text style={{ textAlign: "center", marginTop: 20, color: "#666", fontFamily: "Poppins-Regular", }}>
            No data for this month.
            </Text>
        ) : (
            <FlatList
            data={monthlyData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <View style={styles.listRow}>
                <Text style={styles.listText}>{moment(item.date).format("DD MMM YYYY")}</Text>
                <Text style={styles.listText}>{item.stage}</Text>
                <Text style={styles.listText}>{item.type}</Text>
                <Text style={styles.listText}>{item.quantity}</Text>
                </View>
            )}
            ListHeaderComponent={() => (
                <View style={[styles.listRow, { borderBottomWidth: 1, borderBottomColor: "#ccc", fontFamily: "Poppins-Bold" }]}>
                <Text style={[styles.listText, { fontFamily: "Poppins-Bold" }]}>Date</Text>
                <Text style={[styles.listText, { fontFamily: "Poppins-Bold" }]}>Stage</Text>
                <Text style={[styles.listText, { fontFamily: "Poppins-Bold" }]}>Type</Text>
                <Text style={[styles.listText, { fontFamily: "Poppins-Bold" }]}>Qty</Text>
                </View>
            )}
            />
        )}
    </View>


      {/* Modal */}
      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            <Text style={styles.title}>Add Daily Report</Text>

            {/* Date Picker */}
            <Text style={styles.label}>Date</Text>
            <TouchableOpacity
              style={styles.dateBox}
              onPress={() => setShowPicker(true)}
            >
              <Text style={styles.dateText}>{date.toDateString()}</Text>
            </TouchableOpacity>
            {showPicker && (
              <DateTimePicker
                value={date}
                mode="date"
                onChange={(event, selectedDate) => {
                  setShowPicker(Platform.OS === "ios");
                  if (selectedDate) setDate(selectedDate);
                }}
              />
            )}

            {/* Stage Dropdown */}
            <Text style={styles.label}>Stage</Text>
            <View style={styles.dropdown}>
              <Picker selectedValue={stage} onValueChange={setStage}>
                <Picker.Item label="Larvae" value="Larvae" />
                <Picker.Item label="Pupa" value="Pupa" />
                <Picker.Item label="Butterfly" value="Butterfly" />
              </Picker>
            </View>

            {/* Type Dropdown */}
            <Text style={styles.label}>Type</Text>
            <View style={styles.dropdown}>
              <Picker selectedValue={reportType} onValueChange={setReportType}>
                <Picker.Item label="Mortality" value="Mortality" />
                <Picker.Item label="Produced" value="Produced" />
              </Picker>
            </View>

            {/* Quantity */}
            <Text style={styles.label}>Quantity</Text>
            <View style={styles.notesBox}>
              <TextInput
                style={styles.notesInput}
                placeholder="Enter quantity..."
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
              />
            </View>

            {/* Notes */}
            <Text style={styles.label}>Notes</Text>
            <View style={styles.notesBox}>
              <TextInput
                style={styles.notesInput}
                placeholder="Enter notes..."
                value={notes}
                onChangeText={setNotes}
                multiline
              />
            </View>

            {/* Buttons */}
            <View style={styles.row}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setVisible(false)}
              >
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.btnTextWhite}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  newEntryBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 8,
    width: "100%",
    marginBottom: 20,
  },
  newEntryText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    marginLeft: 8,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    marginTop: 12,
  },
  dateBox: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginTop: 5,
    backgroundColor: "#fff",
  },
  dateText: {
    fontSize: 14,
    color: "#333",
    fontFamily: "Poppins-Regular",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginTop: 5,
    backgroundColor: "#fff",
    fontFamily: "Poppins-Regular",
  },
  notesBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginTop: 5,
    height: 90,
    backgroundColor: "#fff",
  },
  notesInput: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 14,
    height: "100%",
    textAlignVertical: "top",
    fontFamily: "Poppins-Regular",
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
  },
  saveBtn: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  btnText: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
  },
  btnTextWhite: {
    fontSize: 14,
    color: "#fff",
    fontFamily: "Poppins-SemiBold",
  },
  cardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stage: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
  },
  qty: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    marginTop: 4,
    textAlign: "center",
  },
  listRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
  },
  listText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
  },
});
