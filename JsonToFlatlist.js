// We return an array of Bus_Services for Flatlist to read from
export default function jsonToFlatlist(response_json) {
  class Bus_Service {
    constructor(bus_number, operator, next, next2, next3) {
      this.bus_number = bus_number;
      this.operator = operator;
      // should nexts be a JS object of classes...?
      this.next_buses = [];
      [next, next2, next3].forEach((coming_bus) => {
        // sometimes coming_bus can be a null, so we don't store it
        if (coming_bus === null) {
          {
          }
        } else {
          this.next_buses.push(
            new Bus(
              coming_bus["time"],
              coming_bus["duration_ms"],
              coming_bus["lat"],
              coming_bus["lng"],
              coming_bus["load"],
              coming_bus["feature"],
              coming_bus["type"],
              coming_bus["visit_number"],
              coming_bus["origin_code"],
              coming_bus["destination_code"]
            )
          );
        }
      });
    }

    get get_bus_number() {
      return this.bus_number;
    }

    get get_operator() {
      return this.operator;
    }

    get get_next_buses() {
      return this.next_buses;
    }
  }

  class Bus {
    constructor(
      bus_arrival_time,
      duration,
      latitude,
      longitude,
      load,
      feature,
      bus_type,
      visit_number,
      origin,
      destination
    ) {
      this.bus_arrival_time = bus_arrival_time;
      this.duration = duration;
      this.latitude = latitude;
      this.longitude = longitude;
      this.load = load;
      this.feature = feature;
      this.bus_type = bus_type;
      this.visit_number = visit_number;
      this.origin = origin;
      this.destination = destination;
    }
    get get_duration() {
      return this.duration;
    }

    get get_duration_minute() {
      return Math.floor(this.duration / 1000 / 60);
    }
  }

  let bus_flatlist_data = [];
  response_json["services"].forEach((service) => {
    try {
      // see which bus giving problems
      console.log(service["no"]);

      bus_flatlist_data.push(
        new Bus_Service(
          service["no"],
          service["operator"],
          service["next"],
          service["next2"],
          service["next3"]
        )
      );
    } catch (error) {
      console.log(error);
    }
  });
  return bus_flatlist_data;
}
