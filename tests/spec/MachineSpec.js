import { TrafficLightModel } from '../src/trafficLight.js';

describe('Traffic Light State Machine', () => {
  let trafficLight;

  beforeEach(() => {
    trafficLight = TrafficLightModel;
    // Reset to initial state
    while (trafficLight.state.mainLight !== 'red') {
      trafficLight.trigger('change');
    }
  });

  it('should initialize in the red state', () => {
    expect(trafficLight.state.mainLight).toBe('red');
    expect(trafficLight.state.pedestrianSignal).toBe('walk');
  });

  it('should transition from red to green', () => {
    trafficLight.trigger('change');
    expect(trafficLight.state.mainLight).toBe('green');
    expect(trafficLight.state.pedestrianSignal).toBe('stop');
  });

  it('should transition from green to yellow', () => {
    trafficLight.trigger('change'); // red to green
    trafficLight.trigger('change'); // green to yellow
    expect(trafficLight.state.mainLight).toBe('yellow');
    expect(trafficLight.state.pedestrianSignal).toBe('stop');
  });

  it('should transition from yellow to red', () => {
    trafficLight.trigger('change'); // red to green
    trafficLight.trigger('change'); // green to yellow
    trafficLight.trigger('change'); // yellow to red
    expect(trafficLight.state.mainLight).toBe('red');
    expect(trafficLight.state.pedestrianSignal).toBe('walk');
  });

  it('should complete a full cycle', () => {
    expect(trafficLight.state.mainLight).toBe('red');
    expect(trafficLight.state.pedestrianSignal).toBe('walk');

    trafficLight.trigger('change');
    expect(trafficLight.state.mainLight).toBe('green');
    expect(trafficLight.state.pedestrianSignal).toBe('stop');

    trafficLight.trigger('change');
    expect(trafficLight.state.mainLight).toBe('yellow');
    expect(trafficLight.state.pedestrianSignal).toBe('stop');

    trafficLight.trigger('change');
    expect(trafficLight.state.mainLight).toBe('red');
    expect(trafficLight.state.pedestrianSignal).toBe('walk');
  });

  it('should handle emergency transition', () => {
    trafficLight.trigger('change'); // red to green
    expect(trafficLight.state.mainLight).toBe('green');
    expect(trafficLight.state.pedestrianSignal).toBe('stop');

    trafficLight.trigger('emergency', { isEmergency: true });
    expect(trafficLight.state.mainLight).toBe('red');
    expect(trafficLight.state.pedestrianSignal).toBe('walk');
  });
});
