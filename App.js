import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";

export default function App() {
  const [Loading, setLoading] = useState(true);
  const [Arrival, setArrival] = useState("");
  const [Arrival2, setArrival2] = useState("");
  const BUSSTOP_URL = "https://arrivelah2.busrouter.sg/?id=83139";
  const busNumber = "155";

  function refresh() {
    return loadBusStopData();
  }

  function StringToDatetime(arrivalString) {
    const arrivalDate = new Date(arrivalString);
    return `${arrivalDate.getHours()}:${arrivalDate.getMinutes()}`;
  }

  async function loadBusStopData() {
    setLoading(true);
    fetch(BUSSTOP_URL)
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        console.log(responseData);
        const filteredData = responseData.services.filter(
          (innerObj) => innerObj.no === busNumber
        )[0];
        console.log(
          "----------------------DATA FILTERED-----------------------"
        );
        console.log(filteredData);
        console.log(filteredData.next.time);

        setLoading(false);

        setArrival(filteredData.next.time);
        setArrival2(filteredData.next2.time);
      });
  }

  useEffect(() => {
    loadBusStopData();
    const apiInterval = setInterval(loadBusStopData, 10000);
    return () => clearInterval(apiInterval);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList />
      <Text style={styles.busText}>{busNumber}</Text>
      <Text style={styles.titleText}>Next bus arrival time:</Text>

      <Text style={styles.arrivalText1}>
        {Loading ? (
          <ActivityIndicator size="large" color="blue" />
        ) : (
          StringToDatetime(Arrival)
        )}
      </Text>

      <Text style={styles.titleText}>Subsequent bus arrival time:</Text>

      <Text style={styles.arrivalText1}>
        {Loading ? (
          <ActivityIndicator size="large" color="blue" />
        ) : (
          StringToDatetime(Arrival2)
        )}
      </Text>

      <TouchableOpacity style={styles.refreshButton} onPress={refresh}>
        <Text style={styles.buttonText}>Refresh!</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  refreshButton: {
    backgroundColor: "green",
    paddingHorizontal: 25,
    paddingVertical: 20,
  },

  buttonText: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },

  arrivalText1: {
    fontSize: 40,
    fontWeight: "bold",
    margin: 25,
  },

  arrivalText2: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 15,
    color: "gray",
  },

  titleText: {
    fontSize: 20,
    fontWeight: "bold",
  },

  busText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "red",
  },
});
