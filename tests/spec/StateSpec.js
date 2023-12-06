const { ObservableState, computed, effect } = cami;

describe("ObservableState", function() {

  describe("ObservableState - Object Manipulation", function() {
    let observable;

    beforeEach(function() {
      observable = new ObservableState({ items: [] });
    });

    it("should initialize with the provided value", function() {
      expect(observable.value).toEqual({ items: [] });
    });

    it("should update the value", function() {
      observable.value = { items: ['test item'] };
      expect(observable.value).toEqual({ items: ['test item'] });
    });

    it("should merge properties from an object into the value", function() {
      observable.assign({ additional: 'property' });
      expect(observable.value).toEqual({ items: [], additional: 'property' });
    });

    it("should set a new value for a specific key in the value", function() {
      observable.set('items', ['test item']);
      expect(observable.value).toEqual({ items: ['test item'] });
    });

    it("should delete a specific key from the value", function() {
      observable.delete('items');
      expect(observable.value).toEqual({});
    });
  });

  describe("ObservableState - Array Manipulation", function() {
    let observable;

    beforeEach(function() {
      observable = new ObservableState([1, 2, 3]);
    });

    it("should splice the array", function() {
      observable.splice(1, 1, 'test');
      expect(observable.value).toEqual([1, 'test', 3]);
    });

    it("should unshift the array", function() {
      observable.unshift('test');
      expect(observable.value).toEqual(['test', 1, 2, 3]);
    });

    it("should reverse the array", function() {
      observable.reverse();
      expect(observable.value).toEqual([3, 2, 1]);
    });

    it("should sort the array", function() {
      observable.value = [3, 1, 2];
      observable.sort();
      expect(observable.value).toEqual([1, 2, 3]);
    });

    it("should fill the array", function() {
      observable.fill('test');
      expect(observable.value).toEqual(['test', 'test', 'test']);
    });

    it("should copy within the array", function() {
      observable.copyWithin(0, 1, 2);
      expect(observable.value).toEqual([2, 2, 3]);
    });

    it("should push to the array", function() {
      observable.push('test');
      expect(observable.value).toEqual([1, 2, 3, 'test']);
    });

    it("should pop from the array", function() {
      observable.pop();
      expect(observable.value).toEqual([1, 2]);
    });

    it("should shift the array", function() {
      observable.shift();
      expect(observable.value).toEqual([2, 3]);
    });

    it("should update the array", function() {
      observable.update(arr => {
        arr.push('test');
      });
      expect(observable.value).toEqual([1, 2, 3, 'test']);
    });
  });

  describe("ObservableState - ComputedState and Effect", function() {
    let observable, computedObservable, effectCleanup;

    beforeEach(function() {
      observable = new ObservableState(1);
      computedObservable = computed(() => observable.value * 2);
      effectCleanup = effect(() => {
        console.log(computedObservable.value);
        return () => { console.log = jasmine.createSpy(); };
      });
    });

    it("should compute the correct value", function() {
      expect(computedObservable.value).toEqual(2);
    });

    it("should update the computed value when the observable changes", function() {
      observable.update(value => value + 1);
      expect(computedObservable.value).toEqual(4);
    });

    it("should run the cleanup function when the effect is disposed", function() {
      console.log = jasmine.createSpy("log");
      effectCleanup();
      observable.update(value => value + 1);
      expect(console.log).not.toHaveBeenCalled();
    });
  });
});
