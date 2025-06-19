(function() {
    // AsyncQueue class definition remains unchanged
    class AsyncQueue {
        constructor() {
            this.queue = [];
            this.ticking = false;
            this.lastRun = 0;
        }

        /**
         * Adds a task to the queue and starts processing if not already running.
         *
         * @param {Function} callback - The task to be executed.
         * @param {number} [delay=0] - Additional delay in milliseconds before executing the task.
         * @returns {Promise} A promise that resolves when the task and all its effects have completed.
         *
         * How it works:
         * 1. The task is added to the queue immediately.
         * 2. If the queue wasn't being processed, it triggers processing using requestAnimationFrame (rAF).
         * 3. The actual execution of the task is governed by rAF and the specified delay.
         *
         * Note on timing:
         * - Even with a 0ms delay, the task execution is still subject to rAF timing.
         * - rAF typically fires before the next repaint, after microtasks, but before setTimeout.
         * - The specified delay is additional time after the rAF callback before the task executes.
         *
         */
        push(callback, delay = 0) {
            return new Promise((resolve, reject) => {
                this.queue.push({ callback, delay, resolve, reject, startTime: performance.now() });
                if (!this.ticking) {
                    this.ticking = true;
                    requestAnimationFrame(() => this.processTick());
                }
            });
        }

        /**
         * Processes the next task in the queue.
         *
         * Design rationale:
         * - Uses rAF to align with browser's rendering cycle, optimizing UI updates.
         * - Ensures tasks are executed sequentially, maintaining order.
         * - Handles errors gracefully, preventing the queue from getting stuck.
         *
         * Execution flow:
         * 1. Check if it's time to execute the next task based on its delay.
         * 2. Execute the task and ensure all its microtasks are completed.
         * 3. Schedule the next tick using rAF, maintaining alignment with the rendering cycle.
         *
         * This design leverages the event loop's behavior:
         * - Microtasks from the task execution are processed immediately.
         * - The next rAF cycle allows for potential rendering before processing the next task.
         * - Maintains a consistent task -> microtask -> rAF -> (potential setTimeout) order.
         */
        processTick() {
            const now = performance.now();
            const firstItem = this.queue[0];

            if (firstItem && now - firstItem.startTime >= firstItem.delay) {
                const { callback, resolve, reject } = this.queue.shift();
                try {
                    const result = callback();
                    this.ensureComplete(result).then(resolve).catch(reject);
                } catch (error) {
                    console.error("Error in AsyncQueue task:", error);
                    reject(error);
                }
                this.lastRun = now;
            }

            this.ticking = this.queue.length > 0;

            if (this.ticking) {
                requestAnimationFrame(() => this.processTick());
            }
        }

      /**
       * Ensures all currently queued microtasks and at least one macrotask are completed before resolving.
       *
       * @param {*} result - The result to be resolved after ensuring completion.
       * @returns {Promise} A promise that resolves when all current microtasks and at least one macrotask are complete.
       *
       * How it works:
       * 1. For Promise results: Waits for the promise to resolve/reject.
       * 2. For non-Promise results: Uses a combination of queueMicrotask and setTimeout to detect task completion.
       *
       * Design rationale:
       * - Guarantees all currently queued microtasks are processed, including nested ones.
       * - Ensures at least one macrotask (setTimeout) is completed, which can be useful for DOM updates.
       * - Handles both synchronous and asynchronous results uniformly.
       * - The queueMicrotask + setTimeout combination provides a way to detect if new microtasks were scheduled:
       *   a. queueMicrotask schedules a microtask to set a flag.
       *   b. setTimeout checks this flag in the next macrotask.
       *   c. If the flag is set, more microtasks were scheduled, so the process repeats.
       *   d. If the flag is not set, no new microtasks were scheduled, and we can safely resolve.
       *
       * This approach ensures that all currently queued microtasks and at least one macrotask are processed before moving on.
       * It's particularly useful for ensuring DOM updates have been applied before proceeding.
       *
       * Note: While this method does complete a macrotask, it doesn't guarantee all macrotasks are completed.
       * It's designed to provide a balance between ensuring microtask completion and allowing for DOM updates.
       */
        ensureComplete(result) {
            return new Promise((resolve, reject) => {
                const checkCompletion = () => {
                    let microTasksScheduled = false;
                    queueMicrotask(() => {
                        microTasksScheduled = true;
                    });

                    setTimeout(() => {
                        if (microTasksScheduled) {
                            checkCompletion();
                        } else {
                            resolve(result);
                        }
                    }, 0);
                };

                if (result && typeof result.then === 'function') {
                    result.then(resolve).catch(reject);
                } else {
                    checkCompletion();
                }
            });
        }
    }

    class TestRunner {
        constructor(defaultTimeout = 5000) {
            this.queue = new AsyncQueue({ idPrefix: 'test_', historyLimit: 1024 });
            this.suites = [];
            this.currentSuite = null;
            this.totalSpecs = 0;
            this.failures = 0;
            this.defaultTimeout = defaultTimeout;
        }

        describe(description, suiteFunction) {
            const parentSuite = this.currentSuite;
            const newSuite = {
                description,
                specs: [],
                suites: [],
                beforeAllFns: [],
                beforeEachFns: [],
                afterEachFns: [],
                afterAllFns: [],
                parentSuite
            };

            if (parentSuite) {
                parentSuite.suites.push(newSuite);
            } else {
                this.suites.push(newSuite);
            }

            this.currentSuite = newSuite;
            suiteFunction();
            this.currentSuite = parentSuite;
        }

        it(description, testFunction, timeout) {
            if (!this.currentSuite) {
                throw new Error("'it' must be called within a 'describe' block");
            }
            this.currentSuite.specs.push({ description, testFunction, timeout });
            this.totalSpecs++;
        }

        beforeAll(fn) {
            if (!this.currentSuite) {
                throw new Error("'beforeAll' must be called within a 'describe' block");
            }
            this.currentSuite.beforeAllFns.push(fn);
        }

        beforeEach(fn) {
            if (!this.currentSuite) {
                throw new Error("'beforeEach' must be called within a 'describe' block");
            }
            this.currentSuite.beforeEachFns.push(fn);
        }

        afterEach(fn) {
            if (!this.currentSuite) {
                throw new Error("'afterEach' must be called within a 'describe' block");
            }
            this.currentSuite.afterEachFns.push(fn);
        }

        afterAll(fn) {
            if (!this.currentSuite) {
                throw new Error("'afterAll' must be called within a 'describe' block");
            }
            this.currentSuite.afterAllFns.push(fn);
        }

        async runTests() {
            const results = [];
            await this.runSuite(this.suites, results);
            return results;
        }

        async runSuite(suites, results, parentBeforeAllFns = [], parentBeforeEachFns = [], parentAfterEachFns = [], parentAfterAllFns = []) {
            for (const suite of suites) {
                const suiteResult = { description: suite.description, specs: [], suites: [] };
                results.push(suiteResult);

                const beforeAllFns = [...parentBeforeAllFns, ...suite.beforeAllFns];
                const beforeEachFns = [...parentBeforeEachFns, ...suite.beforeEachFns];
                const afterEachFns = [...suite.afterEachFns, ...parentAfterEachFns];
                const afterAllFns = [...suite.afterAllFns, ...parentAfterAllFns];

                // Run beforeAll hooks
                for (const beforeAllFn of beforeAllFns) {
                    await this.queue.push(beforeAllFn);
                }

                // Run specs
                for (const spec of suite.specs) {
                    await this.runSpec(spec, beforeEachFns, afterEachFns, suiteResult);
                }

                // Run nested suites
                await this.runSuite(suite.suites, suiteResult.suites, beforeAllFns, beforeEachFns, afterEachFns, afterAllFns);

                // Run afterAll hooks
                for (const afterAllFn of afterAllFns) {
                    await this.queue.push(async () => {
                        try {
                            await afterAllFn();
                        } catch (error) {
                            console.error(`Error in afterAll hook: ${error.message}`);
                        }
                    });
                }
            }
        }

        async runSpec(spec, beforeEachFns, afterEachFns, suiteResult) {
            const timeout = spec.timeout || this.defaultTimeout;

            await this.queue.push(async () => {
                const timeoutPromise = new Promise((_, reject) => {
                    setTimeout(() => reject(new Error(`Test timed out after ${timeout}ms`)), timeout);
                });

                try {
                    // Run beforeEach hooks
                    for (const beforeEachFn of beforeEachFns) {
                        await Promise.race([beforeEachFn(), timeoutPromise]);
                    }

                    await Promise.race([spec.testFunction(), timeoutPromise]);
                    suiteResult.specs.push({ description: spec.description, status: 'pass' });
                    window.updateProgress('pass');

                } catch (error) {
                    suiteResult.specs.push({
                        description: spec.description,
                        status: 'fail',
                        error: error.message
                    });
                    window.updateProgress('fail');
                    this.failures++;
                } finally {
                    // Run afterEach hooks
                    for (const afterEachFn of afterEachFns) {
                        try {
                            await Promise.race([afterEachFn(), timeoutPromise]);
                        } catch (error) {
                            console.error(`Error in afterEach hook: ${error.message}`);
                        }
                    }
                }
            });
        }

        expect(actual) {
            return {
                toBe: (expected) => {
                    if (actual !== expected) {
                        throw new Error(`Expected ${actual} to be ${expected}`);
                    }
                },
                toEqual: (expected) => {
                    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
                        throw new Error(`Expected ${JSON.stringify(actual)} to equal ${JSON.stringify(expected)}`);
                    }
                },
                toThrow: (expected) => {
                    if (typeof actual !== 'function') {
                        throw new Error('toThrow must be called on a function');
                    }
                    try {
                        actual();
                        throw new Error('Expected function to throw an error');
                    } catch (error) {
                        if (expected && error.message !== expected) {
                            throw new Error(`Expected error message "${expected}", but got "${error.message}"`);
                        }
                    }
                },
                not: {
                    toBe: (expected) => {
                        if (actual === expected) {
                            throw new Error(`Expected ${actual} not to be ${expected}`);
                        }
                    },
                    toThrow: () => {
                        if (typeof actual !== 'function') {
                            throw new Error('not.toThrow must be called on a function');
                        }
                        try {
                            actual();
                        } catch (error) {
                            throw new Error(`Expected function not to throw, but it threw ${error.message}`);
                        }
                    }
                },
                toContain: (expected) => {
                    if (!Array.isArray(actual)) {
                        throw new Error('toContain must be called on an array');
                    }
                    const containsItem = actual.some(item =>
                        Object.keys(expected).every(key => {
                            if (expected[key] && expected[key].asymmetricMatch) {
                                return expected[key].asymmetricMatch(item[key]);
                            }
                            return item[key] === expected[key];
                        })
                    );
                    if (!containsItem) {
                        throw new Error(`Expected ${JSON.stringify(actual)} to contain ${JSON.stringify(expected)}`);
                    }
                },
                toHaveBeenCalledWith: (...args) => {
                    if (typeof actual !== 'function' || !actual.calls) {
                        throw new Error('toHaveBeenCalledWith must be called on a spy function');
                    }
                    const calls = actual.calls;
                    const matchingCall = calls.find(call =>
                        call.length === args.length &&
                        call.every((arg, index) => this.deepEqual(arg, args[index]))
                    );
                    if (!matchingCall) {
                        throw new Error(`Expected spy to have been called with ${JSON.stringify(args)}, but it was not.`);
                    }
                }
            };
        }

        static any(type) {
            return {
                asymmetricMatch: (actual) => {
                    if (type === Number) return typeof actual === 'number';
                    if (type === String) return typeof actual === 'string';
                    if (type === Boolean) return typeof actual === 'boolean';
                    if (type === Function) return typeof actual === 'function';
                    if (type === Object) return typeof actual === 'object' && actual !== null;
                    if (type === Array) return Array.isArray(actual);
                    return actual instanceof type;
                },
                toString: () => `TestRunner.any(${type.name})`
            };
        }

        deepEqual(a, b) {
            if (a === b) return true;
            if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
            const keysA = Object.keys(a), keysB = Object.keys(b);
            if (keysA.length !== keysB.length) return false;
            return keysA.every(key => this.deepEqual(a[key], b[key]));
        }

        spyOn(obj, method) {
            const original = obj[method];
            const spy = function(...args) {
                spy.calls.push(args);
                return spy.returnValue ? spy.returnValue(...args) : undefined;
            };
            spy.calls = [];
            spy.and = {
                returnValue: (value) => {
                    spy.returnValue = typeof value === 'function' ? value : () => value;
                }
            };
            obj[method] = spy;
            return spy;
        }
    }

    // Create a single instance of TestRunner
    const testSuite = new TestRunner();

    // Expose test functions globally
    window.describe = testSuite.describe.bind(testSuite);
    window.it = (description, testFunction, timeout) => testSuite.it(description, testFunction, timeout);
    window.beforeAll = testSuite.beforeAll.bind(testSuite);
    window.beforeEach = testSuite.beforeEach.bind(testSuite);
    window.afterEach = testSuite.afterEach.bind(testSuite);
    window.afterAll = testSuite.afterAll.bind(testSuite);
    window.expect = testSuite.expect.bind(testSuite);
    window.expect.any = TestRunner.any;
    window.spyOn = testSuite.spyOn.bind(testSuite);

    // Define runTests function
    function runTests() {
        return testSuite.runTests().then(results => {
            window.testResults = results; // Store results globally
            if (window.TestRunnerDisplay) {
                window.TestRunnerDisplay.displaySummary(testSuite.totalSpecs, testSuite.failures);
                window.TestRunnerDisplay.showFilters(); // Show filters after tests are done
                window.TestRunnerDisplay.displayResults(results);
            } else {
                console.error('TestRunnerDisplay is not available');
            }
        });
    }

    // Expose runTests globally
    window.runTests = runTests;

    // Run tests when the page is fully loaded
    window.addEventListener('load', () => {
        if (window.TestRunnerDisplay) {
            new AsyncQueue().push(runTests);
        } else {
            console.error('TestRunnerDisplay is not available');
        }
    });

    // Expose updateProgress for use in TestRunner
    window.updateProgress = function(status) {
        if (window.TestRunnerDisplay && window.TestRunnerDisplay.updateProgress) {
            window.TestRunnerDisplay.updateProgress(status);
        } else {
            console.log('Test status:', status);
        }
    };

})();
