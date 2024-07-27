const { store, Type, useValidationThunk } = cami;

describe("Hooks", function() {
  let appStore;

  beforeEach(function() {
    appStore = store({
      state: { count: 0, user: null, items: [], settings: { theme: 'default', fontSize: 12 }, subscription: { id: 'sub1', teamId: 'team1', plan: 'basic', seats: 5 }, team: { id: 'team1', name: 'My Team', ownerId: 'user1', memberIds: ['user1'] } },
      name: `test-store-${Date.now()}`,
      localStorage: false
    });

    appStore.defineAction('incrementCount', ({ state, payload }) => {
      state.count += payload;
    });

    appStore.defineAction('setUser', ({ state, payload }) => {
      state.user = payload;
    });

    appStore.defineAction('addItem', ({ state, payload }) => {
      state.items = [...state.items, payload];
    });

    appStore.defineAction('updateSettings', ({ state, payload }) => {
      state.settings = { ...state.settings, ...payload };
    });

    appStore.defineAction('setSubscription', ({ state, payload }) => {
      state.subscription = payload;
    });

    appStore.defineAction('setTeam', ({ state, payload }) => {
      state.team = payload;
    });

    // Reset hooks
    appStore.beforeHooks = [];
    appStore.afterHooks = [];
  });

  it("should use beforeHook for input validation", function() {
    appStore.beforeHook(({ action, payload }) => {
      if (action === 'incrementCount' && typeof payload !== 'number') {
        throw new Error('Payload must be a number for incrementCount action');
      }
    });

    expect(() => appStore.dispatch('incrementCount', 'not a number')).toThrowError('Payload must be a number for incrementCount action');
    expect(() => appStore.dispatch('incrementCount', 5)).not.toThrow();
    expect(appStore.state.count).toBe(5);
  });

  it("should use afterHook for schema validation", function() {
    const schema = {
      count: 'number',
      user: 'object'
    };

    appStore.afterHook(({ state }) => {
      Object.keys(schema).forEach(key => {
        if (state[key] !== null && typeof state[key] !== schema[key]) {
          throw new Error(`Invalid type for ${key}. Expected ${schema[key]}, got ${typeof state[key]}`);
        }
      });
    });

    expect(() => appStore.dispatch('setUser', 'not an object')).toThrowError('Invalid type for user. Expected object, got string');
    expect(() => appStore.dispatch('setUser', { name: 'John' })).not.toThrow();
    expect(appStore.state.user).toEqual({ name: 'John' });
  });

  it("should apply both beforeHook and afterHook", function() {
    appStore.beforeHook(({ action, payload }) => {
      if (action === 'incrementCount' && payload < 0) {
        throw new Error('Cannot decrement count');
      }
    });

    appStore.afterHook(({ state }) => {
      if (state.count > 10) {
        throw new Error('Count cannot exceed 10');
      }
    });

    expect(() => appStore.dispatch('incrementCount', -1)).toThrowError('Cannot decrement count');
    expect(() => appStore.dispatch('incrementCount', 15)).toThrowError('Count cannot exceed 10');

    appStore.dispatch('incrementCount', 5);
    expect(appStore.state.count).toBe(5);

    appStore.dispatch('incrementCount', 3);
    expect(appStore.state.count).toBe(8);
  });

  it("should roll back to previous state if beforeHook throws an error", function() {
    appStore.beforeHook(({ action, payload }) => {
      if (action === 'incrementCount' && payload > 10) {
        throw new Error('Cannot increment by more than 10');
      }
    });

    appStore.dispatch('incrementCount', 5);
    expect(appStore.state.count).toBe(5);

    expect(() => appStore.dispatch('incrementCount', 15)).toThrowError('Cannot increment by more than 10');
    expect(appStore.state.count).toBe(5); // Should remain unchanged
  });

  it("should roll back to previous state if afterHook throws an error", function() {
    appStore.afterHook(({ state }) => {
      if (state.count > 10) {
        throw new Error('Count cannot exceed 10');
      }
    });

    appStore.dispatch('incrementCount', 5);
    expect(appStore.state.count).toBe(5);

    expect(() => appStore.dispatch('incrementCount', 10)).toThrowError('Count cannot exceed 10');
    expect(appStore.state.count).toBe(5); // Should roll back to previous state
  });

  it("should maintain consistent state across multiple actions if hook throws an error", function() {
    appStore.afterHook(({ state }) => {
      if (state.count > 10) {
        throw new Error('Count cannot exceed 10');
      }
    });

    appStore.dispatch('incrementCount', 5);
    expect(appStore.state.count).toBe(5);

    appStore.dispatch('incrementCount', 3);
    expect(appStore.state.count).toBe(8);

    expect(() => appStore.dispatch('incrementCount', 5)).toThrowError('Count cannot exceed 10');
    expect(appStore.state.count).toBe(8); // Should remain at 8, not increment to 13

    appStore.dispatch('incrementCount', 2);
    expect(appStore.state.count).toBe(10); // Should successfully increment to 10
  });

  it("should validate complex object structures", function() {
    const schema = {
      user: Type.Object({
        name: Type.String,
        age: Type.Refinement(Type.Number, (n) => n >= 0 && n <= 120),
        email: Type.Refinement(Type.String, (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s))
      })
    };

    appStore.afterHook(useValidationThunk(schema));

    expect(() => appStore.dispatch('setUser', { name: 'John', age: 30, email: 'john@example.com' })).not.toThrow();
    expect(() => appStore.dispatch('setUser', { name: 'Jane', age: 150, email: 'jane@example.com' })).toThrowError();
    expect(() => appStore.dispatch('setUser', { name: 'Bob', age: 40, email: 'invalid-email' })).toThrowError();
  });

  it("should validate array types", function() {
    const schema = {
      items: Type.Array(Type.Number)
    };

    appStore.afterHook(useValidationThunk(schema));

    expect(() => appStore.dispatch('addItem', 5)).not.toThrow();
    expect(() => appStore.dispatch('addItem', 10)).not.toThrow();
    expect(() => appStore.dispatch('addItem', '15')).toThrowError('Invalid item at index 2: Expected number, got string at items.2');
    expect(appStore.state.items).toEqual([5, 10]); // Ensure the invalid item wasn't added
  });

  it("should handle dependent types", function() {
    const schema = {
      settings: Type.Dependent(
        Type.Object({
          theme: Type.String,
          fontSize: Type.Number
        }),
        (value, state) => {
          if (value.theme === 'large-print' && value.fontSize < 16) {
            throw new Error('Font size must be at least 16 for large-print theme');
          }
        }
      )
    };

    appStore.afterHook(useValidationThunk(schema));

    expect(() => appStore.dispatch('updateSettings', { theme: 'default', fontSize: 12 })).not.toThrow();
    expect(() => appStore.dispatch('updateSettings', { theme: 'large-print', fontSize: 18 })).not.toThrow();
    expect(() => appStore.dispatch('updateSettings', { theme: 'large-print', fontSize: 14 })).toThrowError();
  });

  it("should handle complex dependent types with team, subscription, and user interrelations", function() {
    const schema = {
      subscription: Type.Object({
        id: Type.String,
        plan: Type.String,
        seats: Type.Number
      }),
      settings: Type.Dependent(
        Type.Object({
          theme: Type.String,
          fontSize: Type.Number
        }),
        (value, state) => {
          if (state.subscription && state.subscription.plan === 'basic' && value.theme !== 'default') {
            throw new Error('Custom themes are only available for premium subscriptions');
          }
        }
      )
    };

    appStore.afterHook(useValidationThunk(schema));

    appStore.dispatch('setSubscription', { id: 'sub1', plan: 'basic', seats: 5 });
    appStore.dispatch('updateSettings', { theme: 'default', fontSize: 14 });

    expect(() => appStore.dispatch('updateSettings', { theme: 'default', fontSize: 16 })).not.toThrow();

    expect(() => appStore.dispatch('updateSettings', { theme: 'dark', fontSize: 16 }))
      .toThrowError('Custom themes are only available for premium subscriptions');

    appStore.dispatch('setSubscription', { id: 'sub1', plan: 'premium', seats: 5 });

    expect(() => appStore.dispatch('updateSettings', { theme: 'dark', fontSize: 16 })).not.toThrow();
  });

  it("should validate user roles and permissions", function() {
    const schema = {
      user: Type.Dependent(
        Type.Object({
          id: Type.String,
          name: Type.String,
          role: Type.String,
          permissions: Type.Array(Type.String)
        }),
        (value, state) => {
          const rolePermissions = {
            admin: ['read', 'write', 'delete'],
            editor: ['read', 'write'],
            viewer: ['read']
          };
          const allowedPermissions = rolePermissions[value.role] || [];
          const invalidPermissions = value.permissions.filter(p => !allowedPermissions.includes(p));
          if (invalidPermissions.length > 0) {
            throw new Error(`Invalid permissions for role ${value.role}: ${invalidPermissions.join(', ')}`);
          }
        }
      )
    };

    appStore.afterHook(useValidationThunk(schema));

    expect(() => appStore.dispatch('setUser', { id: 'user1', name: 'John Doe', role: 'admin', permissions: ['read', 'write', 'delete'] })).not.toThrow();
    expect(() => appStore.dispatch('setUser', { id: 'user2', name: 'Jane Doe', role: 'editor', permissions: ['read', 'write'] })).not.toThrow();
    expect(() => appStore.dispatch('setUser', { id: 'user3', name: 'Bob Smith', role: 'viewer', permissions: ['read'] })).not.toThrow();
    expect(() => appStore.dispatch('setUser', { id: 'user4', name: 'Alice Johnson', role: 'editor', permissions: ['read', 'write', 'delete'] })).toThrowError();
  });

  it("should validate subscription limits", function() {
    const schema = {
      subscription: Type.Object({
        id: Type.String,
        plan: Type.String,
        seats: Type.Number
      }),
      team: Type.Dependent(
        Type.Object({
          id: Type.String,
          name: Type.String,
          memberIds: Type.Array(Type.String)
        }),
        (value, state) => {
          if (state.subscription) {
            if (value.memberIds.length > state.subscription.seats) {
              throw new Error(`Team size (${value.memberIds.length}) exceeds subscription seat limit (${state.subscription.seats})`);
            }
          }
        }
      )
    };

    appStore.afterHook(useValidationThunk(schema));

    appStore.dispatch('setSubscription', { id: 'sub1', plan: 'basic', seats: 5 });
    expect(() => appStore.dispatch('setTeam', { id: 'team1', name: 'My Team', memberIds: ['user1', 'user2', 'user3'] })).not.toThrow();
    expect(() => appStore.dispatch('setTeam', { id: 'team1', name: 'My Team', memberIds: ['user1', 'user2', 'user3', 'user4', 'user5', 'user6'] }))
      .toThrowError('Team size (6) exceeds subscription seat limit (5)');
  });
});
