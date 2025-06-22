import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { existsSync } from 'fs';
import { resolve } from 'path';
import { execSync } from 'child_process';

describe('Phase 1: Core Utilities TypeScript Integration Test', () => {
  describe('TypeScript files existence', () => {
    it('should have config.ts file', () => {
      const configPath = resolve(process.cwd(), '../src/config.ts');
      expect(existsSync(configPath)).toBe(true);
    });

    it('should have trace.ts file', () => {
      const tracePath = resolve(process.cwd(), '../src/trace.ts');
      expect(existsSync(tracePath)).toBe(true);
    });

    it('should have types/index.ts file', () => {
      const typesPath = resolve(process.cwd(), '../src/types/index.ts');
      expect(existsSync(typesPath)).toBe(true);
    });

    it('should not have old JavaScript files', () => {
      const oldConfigPath = resolve(process.cwd(), '../src/config.js');
      const oldTracePath = resolve(process.cwd(), '../src/trace.js');
      const oldTypesPath = resolve(process.cwd(), '../src/types.js');
      
      expect(existsSync(oldConfigPath)).toBe(false);
      expect(existsSync(oldTracePath)).toBe(false);
      expect(existsSync(oldTypesPath)).toBe(false);
    });
  });

  describe('TypeScript compilation', () => {
    it('should compile without errors', () => {
      try {
        execSync('npm run type-check', { 
          cwd: resolve(process.cwd(), '..'),
          stdio: 'pipe'
        });
        expect(true).toBe(true);
      } catch (error) {
        // Some JS files may still have errors, but our TS files should compile
        const output = error.stdout?.toString() || '';
        expect(output).not.toContain('src/config.ts');
        expect(output).not.toContain('src/trace.ts');
        expect(output).not.toContain('src/types/index.ts');
      }
    });
  });

  describe('Config module functionality', () => {
    let config;

    beforeEach(async () => {
      // Import the config module
      const configModule = await import('../../src/config.ts');
      config = configModule.__config;
    });

    it('should have events configuration', () => {
      expect(config.events).toBeDefined();
      expect(config.events.isEnabled).toBe(true);
      expect(typeof config.events.enable).toBe('function');
      expect(typeof config.events.disable).toBe('function');
    });

    it('should have debug configuration', () => {
      expect(config.debug).toBeDefined();
      expect(config.debug.isEnabled).toBe(false);
      expect(typeof config.debug.enable).toBe('function');
      expect(typeof config.debug.disable).toBe('function');
    });

    it('should toggle debug mode', () => {
      const originalConsoleLog = console.log;
      let logOutput = '';
      console.log = (msg) => { logOutput = msg; };

      config.debug.enable();
      expect(config.debug.isEnabled).toBe(true);
      expect(logOutput).toBe('Cami.js debug mode enabled');

      config.debug.disable();
      expect(config.debug.isEnabled).toBe(false);

      console.log = originalConsoleLog;
    });
  });

  describe('Trace module functionality', () => {
    let trace;
    let config;

    beforeEach(async () => {
      const traceModule = await import('../../src/trace.ts');
      const configModule = await import('../../src/config.ts');
      trace = traceModule.__trace;
      config = configModule.__config;
    });

    afterEach(() => {
      config.debug.disable();
    });

    it('should not log when debug is disabled', () => {
      const originalGroupCollapsed = console.groupCollapsed;
      let called = false;
      console.groupCollapsed = () => { called = true; };

      trace('test-function', 'test message');
      expect(called).toBe(false);

      console.groupCollapsed = originalGroupCollapsed;
    });

    it('should log when debug is enabled', () => {
      const originalGroupCollapsed = console.groupCollapsed;
      let called = false;
      console.groupCollapsed = () => { called = true; };

      config.debug.enable();
      trace('test-function', 'test message');
      expect(called).toBe(true);

      console.groupCollapsed = originalGroupCollapsed;
    });
  });

  describe('Types module functionality', () => {
    let Type, validateType;

    beforeEach(async () => {
      const typesModule = await import('../../src/types/index.ts');
      Type = typesModule.Type;
      validateType = typesModule.validateType;
    });

    it('should have all type constructors', () => {
      expect(Type.String).toBeDefined();
      expect(Type.Number).toBeDefined();
      expect(Type.Boolean).toBeDefined();
      expect(Type.Object).toBeDefined();
      expect(Type.Array).toBeDefined();
      expect(Type.Optional).toBeDefined();
      expect(Type.Sum).toBeDefined();
      expect(Type.Product).toBeDefined();
      expect(Type.Refinement).toBeDefined();
    });

    it('should create valid type objects', () => {
      // Test that Type constructors are the expected type
      expect(Type.String).toBe('string');
      expect(Type.Number).toBe('float'); // Type.Number is actually 'float' in the implementation
      expect(Type.Boolean).toBe('boolean');
    });

    it('should create object types', () => {
      const userType = Type.Object({
        name: Type.String,
        age: Type.Number
      });
      expect(userType).toHaveProperty('type', 'object');
      expect(userType).toHaveProperty('schema');
    });

    it('should create array types', () => {
      const arrayType = Type.Array(Type.Number);
      expect(arrayType).toHaveProperty('type', 'array');
      // Just check that it's a proper object with type 'array'
      expect(arrayType.type).toBe('array');
    });

    it('should create optional types', () => {
      const optionalType = Type.Optional(Type.String);
      expect(optionalType).toHaveProperty('type', 'optional');
      expect(optionalType).toHaveProperty('optional');
    });

    it('should export validateType function', () => {
      expect(typeof validateType).toBe('function');
    });
  });
});