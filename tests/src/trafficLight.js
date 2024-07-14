const { store } = cami;

export const trafficLightStore = store({
  state: {
    mainLight: 'red',
    pedestrianSignal: 'walk'
  },
  name: "traffic-light-store"
});

trafficLightStore.defineMachine('traffic-light', {
  change: {
    from: [
      { mainLight: 'red', pedestrianSignal: 'walk' },
      { mainLight: 'green', pedestrianSignal: 'stop' },
      { mainLight: 'yellow', pedestrianSignal: 'stop' }
    ],
    to: ({ state }) => {
      const transitions = {
        red: { mainLight: 'green', pedestrianSignal: 'stop' },
        green: { mainLight: 'yellow', pedestrianSignal: 'stop' },
        yellow: { mainLight: 'red', pedestrianSignal: 'walk' }
      };
      return transitions[state.mainLight];
    },
    onEntry: (ctx) => {
      console.log(`Entered state ${ctx.state.mainLight}`);
    },
    onTransition: (ctx) => {
      console.log(`Transitioned from ${ctx.from.mainLight} to ${ctx.to.mainLight}`);
    },
    onExit: (ctx) => {
      console.log(`Exited state ${ctx.state.mainLight}`);
    }
  },
  emergency: {
    from: [
      { mainLight: 'green', pedestrianSignal: 'stop' },
      { mainLight: 'yellow', pedestrianSignal: 'stop' }
    ],
    to: { mainLight: 'red', pedestrianSignal: 'walk' },
    guard: ({ payload }) => payload && payload.isEmergency
  }
});
