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
  // Arrival stores an array of arriving bus service info for all buses at that stop
  // Each Bus_Service is a class, with next, next2, etc. is a Bus class
  const [Arrival, setArrival] = useState([]);
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
        let response_arr = jsonToFlatlist(responseData);
        console.log(response_arr);
        setArrival(response_arr);
        setLoading(false);
      });
  }

  useEffect(() => {
    loadBusStopData();
    //change this back to 1mins later
    const apiInterval = setInterval(loadBusStopData, 1000000);
    return () => clearInterval(apiInterval);
  }, []);

  function renderBusFlatlist({ item }) {
    // each item is a Bus_Service
    // the default is nulls which show "no bus coming" when rendered
    let result_bus_arr = [null, null, null];
    let next_buses = item.get_next_buses;

    for (let i = 0; i < next_buses.length; i++) {
      result_bus_arr[i] = next_buses[i];
    }

    return (
      <View style={styles.bus_service_style}>
        <Text>{item.get_bus_number}</Text>

        {result_bus_arr.map((coming_bus) => {
          if (coming_bus === null) {
            return (
              <View>
                <Text>{"N/A"}</Text>
              </View>
            );
          } else {
            let coming_bus_duration = coming_bus.get_duration_minute;
            if (coming_bus_duration < 0) {
              var display_message = "Left";
            } else if (coming_bus_duration === 0) {
              var display_message = "Arr";
            } else {
              var display_message = `${coming_bus_duration} mins`;
            }

            return (
              <View>
                <Text>{display_message}</Text>
              </View>
            );
          }
        })}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* flatlist data takes in an array of  */}
      <FlatList
        data={Arrival}
        renderItem={renderBusFlatlist}
        style={styles.flatlist_style}
      />
      <Text style={styles.busText}>155</Text>
      <Text style={styles.titleText}>Next bus arrival time:</Text>

      <Text style={styles.arrivalText1}>
        {Loading ? (
          <ActivityIndicator size="large" color="blue" />
        ) : (
          <Text> {Arrival[0].get_bus_number} </Text>
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

  flatlist_style: {
    width: "100%",
    backgroundColor: "lightblue",
  },

  bus_service_style: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "green",
    alignSelf: "center",
  },
});
