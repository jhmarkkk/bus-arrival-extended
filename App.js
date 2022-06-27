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
import jsonToFlatlist from "./JsonToFlatlist.js";

export default function App() {
  const [Loading, setLoading] = useState(true);
  // Arrival stores a json of arriving buses info for all buses at that stop
  const [Arrival, setArrival] = useState([]);
  const [Arrival2, setArrival2] = useState("");
  const BUSSTOP_URL = "https://arrivelah2.busrouter.sg/?id=83139";

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
        console.log(
          `Obtained incoming buses data! ${responseData["services"].length} services found`
        );
        setArrival(jsonToFlatlist(responseData));
        console.log(Arrival);
        setLoading(false);

        setArrival(responseData);
      });
  }

  useEffect(() => {
    loadBusStopData();
    //change this back to 1mins later
    const apiInterval = setInterval(loadBusStopData, 1000000);
    return () => clearInterval(apiInterval);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList />
      <Text style={styles.busText}>155</Text>
      <Text style={styles.titleText}>Next bus arrival time:</Text>

      <Text style={styles.arrivalText1}>
        {Loading ? (
          <ActivityIndicator size="large" color="blue" />
        ) : (
          "placeholder"
        )}
      </Text>

      <Text style={styles.titleText}>Subsequent bus arrival time:</Text>

      <Text style={styles.arrivalText1}>
        {Loading ? (
          <ActivityIndicator size="large" color="blue" />
        ) : (
          "placeholder 2"
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
