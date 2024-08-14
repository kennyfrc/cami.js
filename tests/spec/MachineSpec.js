import { trafficLightStore } from "../src/trafficLight.js";

describe("Traffic Light State Machine", () => {
  beforeEach(() => {
    // Reset to initial state
    while (trafficLightStore.getState().mainLight !== "red") {
      trafficLightStore.trigger("traffic-light:change");
    }
  });

  it("should initialize in the red state", () => {
    expect(trafficLightStore.getState().mainLight).toBe("red");
    expect(trafficLightStore.getState().pedestrianSignal).toBe("walk");
  });

  it("should transition from red to green", () => {
    trafficLightStore.trigger("traffic-light:change");
    expect(trafficLightStore.getState().mainLight).toBe("green");
    expect(trafficLightStore.getState().pedestrianSignal).toBe("stop");
  });

  it("should transition from green to yellow", () => {
    trafficLightStore.trigger("traffic-light:change"); // red to green
    trafficLightStore.trigger("traffic-light:change"); // green to yellow
    expect(trafficLightStore.getState().mainLight).toBe("yellow");
    expect(trafficLightStore.getState().pedestrianSignal).toBe("stop");
  });

  it("should transition from yellow to red", () => {
    trafficLightStore.trigger("traffic-light:change"); // red to green
    trafficLightStore.trigger("traffic-light:change"); // green to yellow
    trafficLightStore.trigger("traffic-light:change"); // yellow to red
    expect(trafficLightStore.getState().mainLight).toBe("red");
    expect(trafficLightStore.getState().pedestrianSignal).toBe("walk");
  });

  it("should complete a full cycle", () => {
    expect(trafficLightStore.getState().mainLight).toBe("red");
    expect(trafficLightStore.getState().pedestrianSignal).toBe("walk");

    trafficLightStore.trigger("traffic-light:change");
    expect(trafficLightStore.getState().mainLight).toBe("green");
    expect(trafficLightStore.getState().pedestrianSignal).toBe("stop");

    trafficLightStore.trigger("traffic-light:change");
    expect(trafficLightStore.getState().mainLight).toBe("yellow");
    expect(trafficLightStore.getState().pedestrianSignal).toBe("stop");

    trafficLightStore.trigger("traffic-light:change");
    expect(trafficLightStore.getState().mainLight).toBe("red");
    expect(trafficLightStore.getState().pedestrianSignal).toBe("walk");
  });

  it("should handle emergency transition", () => {
    trafficLightStore.trigger("traffic-light:change"); // red to green
    expect(trafficLightStore.getState().mainLight).toBe("green");
    expect(trafficLightStore.getState().pedestrianSignal).toBe("stop");

    trafficLightStore.trigger("traffic-light:emergency", { isEmergency: true });
    expect(trafficLightStore.getState().mainLight).toBe("red");
    expect(trafficLightStore.getState().pedestrianSignal).toBe("walk");
  });
});
