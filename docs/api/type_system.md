# Type System

Cami includes a runtime type system for validating store state and model schemas. It provides type constructors, validation functions, and integration with stores.

## Overview

The `Type` object provides constructors for defining types:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    import { Type, store } from "cami";
    // Define a schema
    const userSchema = {
        id: Type.Integer,
        name: Type.String,
        email: Type.Optional(Type.String),
        role: Type.Enum(["admin", "user", "guest"]),
        settings: Type.Object({
            theme: Type.String,
            notifications: Type.Boolean,
        }),
    };
    // Use with a store
    const UserStore = store({
        name: "UserStore",
        state: {
            id: 0,
            name: "",
            email: null,
            role: "guest",
            settings: { theme: "light", notifications: true },
        },
        schema: userSchema,
    });
    ```

=== "TypeScript"

    ```typescript
    import { Type, store, type TypeDefinition } from "cami";

    type Role = "admin" | "user" | "guest";

    interface UserState {
      id: number;
      name: string;
      email: string | null;
      role: Role;
      settings: { theme: string; notifications: boolean };
    }

    // Define a schema
    const userSchema = {
      id: Type.Integer,
      name: Type.String,
      email: Type.Optional(Type.String),
      role: Type.Enum(["admin", "user", "guest"]),
      settings: Type.Object({
        theme: Type.String,
        notifications: Type.Boolean,
      }),
    } satisfies Record<keyof UserState, TypeDefinition>;

    // Use with a store
    const UserStore = store<UserState>({
      name: "UserStore",
      state: {
        id: 0,
        name: "",
        email: null,
        role: "guest" as Role,
        settings: { theme: "light", notifications: true },
      },
      schema: userSchema,
    });
    ```

---

## Primitive Types

### Basic Primitives

| Type | Description | Example Values |
|------|-------------|----------------|
| `Type.String` | String values | `"hello"`, `""` |
| `Type.Float` | Floating point numbers | `3.14`, `-0.5` |
| `Type.Integer` | Integer numbers | `42`, `-1`, `0` |
| `Type.Natural` | Non-negative integers | `0`, `1`, `100` |
| `Type.Boolean` | Boolean values | `true`, `false` |
| `Type.BigInt` | BigInt values | `BigInt(9007199254740991)` |
| `Type.Symbol` | Symbol values | `Symbol("id")` |
| `Type.Null` | Null value | `null` |

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const schema = {
        name: Type.String,
        age: Type.Integer,
        score: Type.Float,
        isActive: Type.Boolean,
    };
    ```

=== "TypeScript"

    ```typescript
    const schema = {
      name: Type.String,
      age: Type.Integer,
      score: Type.Float,
      isActive: Type.Boolean,
    };
    ```

---

## Complex Types

### `Type.Object(schema)`

Defines an object with a specific shape:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const addressSchema = Type.Object({
        street: Type.String,
        city: Type.String,
        zip: Type.String,
        country: Type.Optional(Type.String),
    });
    ```

=== "TypeScript"

    ```typescript
    const addressSchema = Type.Object({
      street: Type.String,
      city: Type.String,
      zip: Type.String,
      country: Type.Optional(Type.String),
    });
    ```

### `Type.Array(itemType, options?)`

Defines an array of items:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const tagsSchema = Type.Array(Type.String);
    const numbersSchema = Type.Array(Type.Integer);
    // Allow empty arrays (default: true)
    const nonEmptyTags = Type.Array(Type.String, { allowEmpty: false });
    ```

=== "TypeScript"

    ```typescript
    const tagsSchema = Type.Array(Type.String);
    const numbersSchema = Type.Array(Type.Integer);

    // Allow empty arrays (default: true)
    const nonEmptyTags = Type.Array(Type.String, { allowEmpty: false });
    ```

### `Type.Optional(type)`

Makes a type nullable (accepts `undefined` or `null`):

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const schema = {
        nickname: Type.Optional(Type.String), // string | null | undefined
        bio: Type.Optional(Type.String),
    };
    ```

=== "TypeScript"

    ```typescript
    const schema = {
      nickname: Type.Optional(Type.String),  // string | null | undefined
      bio: Type.Optional(Type.String),
    };
    ```

### `Type.Enum(values)`

Restricts to specific values:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const statusSchema = Type.Enum(["pending", "active", "completed"]);
    const prioritySchema = Type.Enum([1, 2, 3, 4, 5]);
    ```

=== "TypeScript"

    ```typescript
    const statusSchema = Type.Enum(["pending", "active", "completed"]);
    const prioritySchema = Type.Enum([1, 2, 3, 4, 5]);
    ```

### `Type.Sum(types)`

Union type—value must match one of the types:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const idSchema = Type.Sum([Type.String, Type.Integer]);
    // Accepts: "abc123" or 42
    const responseSchema = Type.Sum([
        Type.Object({ success: Type.Boolean, data: Type.Any }),
        Type.Object({ error: Type.String }),
    ]);
    ```

=== "TypeScript"

    ```typescript
    const idSchema = Type.Sum([Type.String, Type.Integer]);
    // Accepts: "abc123" or 42

    const responseSchema = Type.Sum([
      Type.Object({ success: Type.Boolean, data: Type.Any }),
      Type.Object({ error: Type.String }),
    ]);
    ```

### `Type.Product(fields)`

Tuple-like type with named fields:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const coordinateSchema = Type.Product({
        x: Type.Float,
        y: Type.Float,
        z: Type.Optional(Type.Float),
    });
    ```

=== "TypeScript"

    ```typescript
    const coordinateSchema = Type.Product({
      x: Type.Float,
      y: Type.Float,
      z: Type.Optional(Type.Float),
    });
    ```

### `Type.Any`

Accepts any value (use sparingly):

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const schema = {
        metadata: Type.Any, // No validation
    };
    ```

=== "TypeScript"

    ```typescript
    const schema = {
      metadata: Type.Any,  // No validation
    };
    ```

---

## Advanced Types

### `Type.Refinement(baseType, predicate)`

Adds custom validation to a base type:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const positiveNumber = Type.Refinement(Type.Float, (value) => value > 0);
    const email = Type.Refinement(Type.String, (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
    const nonEmptyString = Type.Refinement(Type.String, (value) => value.length > 0);
    ```

=== "TypeScript"

    ```typescript
    const positiveNumber = Type.Refinement(
      Type.Float,
      (value) => value > 0
    );

    const email = Type.Refinement(
      Type.String,
      (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    );

    const nonEmptyString = Type.Refinement(
      Type.String,
      (value) => value.length > 0
    );
    ```

### `Type.Literal(value)`

Exact value match:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const statusSchema = Type.Literal("active");
    const versionSchema = Type.Literal(1);
    ```

=== "TypeScript"

    ```typescript
    const statusSchema = Type.Literal("active");
    const versionSchema = Type.Literal(1);
    ```

### `Type.Vect(length, elementType)`

Fixed-length array:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const rgb = Type.Vect(3, Type.Integer); // [r, g, b]
    const point2d = Type.Vect(2, Type.Float); // [x, y]
    ```

=== "TypeScript"

    ```typescript
    const rgb = Type.Vect(3, Type.Integer);  // [r, g, b]
    const point2d = Type.Vect(2, Type.Float);  // [x, y]
    ```

### `Type.Date`

Date objects:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const schema = {
        createdAt: Type.Date,
        updatedAt: Type.Optional(Type.Date),
    };
    ```

=== "TypeScript"

    ```typescript
    const schema = {
      createdAt: Type.Date,
      updatedAt: Type.Optional(Type.Date),
    };
    ```

### `Type.Void`

No value (undefined):

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const schema = {
        result: Type.Void, // Must be undefined
    };
    ```

=== "TypeScript"

    ```typescript
    const schema = {
      result: Type.Void,  // Must be undefined
    };
    ```

---

## Dependent Types

### `Type.DependentRecord(fields, validateFn)`

Object with cross-field validation:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const dateRangeSchema = Type.DependentRecord({
        startDate: Type.Date,
        endDate: Type.Date,
    }, (value) => value.startDate <= value.endDate || "End date must be after start date");
    ```

=== "TypeScript"

    ```typescript
    const dateRangeSchema = Type.DependentRecord(
      {
        startDate: Type.Date,
        endDate: Type.Date,
      },
      (value) => value.startDate <= value.endDate || "End date must be after start date"
    );
    ```

### `Type.DependentPair(firstType, secondTypeFn)`

Pair where second type depends on first:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const taggedValueSchema = Type.DependentPair(Type.Enum(["string", "number"]), (tag) => tag === "string" ? Type.String : Type.Integer);
    // ["string", "hello"] or ["number", 42]
    ```

=== "TypeScript"

    ```typescript
    const taggedValueSchema = Type.DependentPair(
      Type.Enum(["string", "number"]),
      (tag) => tag === "string" ? Type.String : Type.Integer
    );
    // ["string", "hello"] or ["number", 42]
    ```

### `Type.DependentArray(lengthFn, itemTypeFn)`

Array with dynamic length and item type:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const matrixRowSchema = Type.DependentArray((arr) => arr.length, // Must maintain length
    (index, arr) => Type.Float);
    ```

=== "TypeScript"

    ```typescript
    const matrixRowSchema = Type.DependentArray(
      (arr) => arr.length,  // Must maintain length
      (index, arr) => Type.Float
    );
    ```

---

## Model References

### `Type.Reference(modelName)`

Reference to another model (stores an ID):

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const Department = Type.Model("Department", {
        id: Type.Integer,
        name: Type.String,
    });
    const Employee = Type.Model("Employee", {
        id: Type.Integer,
        name: Type.String,
        departmentId: Type.Reference("Department"), // Stores department ID
    });
    ```

=== "TypeScript"

    ```typescript
    const Department = Type.Model("Department", {
      id: Type.Integer,
      name: Type.String,
    });

    const Employee = Type.Model("Employee", {
      id: Type.Integer,
      name: Type.String,
      departmentId: Type.Reference("Department"),  // Stores department ID
    });
    ```

---

## Tree Types

### `Type.Tree(valueType)`

Binary tree structure:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const binaryTreeSchema = Type.Tree(Type.Integer);
    // { value: 10, left: { value: 5 }, right: { value: 15 } }
    ```

=== "TypeScript"

    ```typescript
    const binaryTreeSchema = Type.Tree(Type.Integer);
    // { value: 10, left: { value: 5 }, right: { value: 15 } }
    ```

### `Type.RoseTree(valueType)`

N-ary tree with multiple children:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const fileSystemSchema = Type.RoseTree(Type.String);
    // { value: "root", children: [{ value: "folder1", children: [...] }] }
    ```

=== "TypeScript"

    ```typescript
    const fileSystemSchema = Type.RoseTree(Type.String);
    // { value: "root", children: [{ value: "folder1", children: [...] }] }
    ```

---

## Function Types

### `Type.Function(paramTypes, returnType)`

Function signature:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const handlerSchema = Type.Function([Type.String, Type.Integer], Type.Boolean);
    // (name: string, count: number) => boolean
    ```

=== "TypeScript"

    ```typescript
    const handlerSchema = Type.Function(
      [Type.String, Type.Integer],
      Type.Boolean
    );
    // (name: string, count: number) => boolean
    ```

### `Type.DependentFunction(paramTypes, returnTypeFn)`

Function with return type depending on parameters:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const parseSchema = Type.DependentFunction([Type.Enum(["string", "number"])], (format) => format === "string" ? Type.String : Type.Integer);
    ```

=== "TypeScript"

    ```typescript
    const parseSchema = Type.DependentFunction(
      [Type.Enum(["string", "number"])],
      (format) => format === "string" ? Type.String : Type.Integer
    );
    ```

---

## Using Types with Stores

### Schema Validation

When you provide a `schema` to a store, state is validated on changes:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const TodoStore = store({
        name: "TodoStore",
        state: {
            todos: [],
            filter: "all",
        },
        schema: {
            todos: Type.Array(Type.Object({
                id: Type.String,
                text: Type.String,
                done: Type.Boolean,
            })),
            filter: Type.Enum(["all", "active", "completed"]),
        },
    });
    // This will throw a validation error:
    TodoStore.defineAction("badAction", ({ state }) => {
        state.filter = "invalid"; // Not in enum!
    });
    ```

=== "TypeScript"

    ```typescript
    const TodoStore = store({
      name: "TodoStore",
      state: {
        todos: [],
        filter: "all",
      },
      schema: {
        todos: Type.Array(Type.Object({
          id: Type.String,
          text: Type.String,
          done: Type.Boolean,
        })),
        filter: Type.Enum(["all", "active", "completed"]),
      },
    });

    // This will throw a validation error:
    TodoStore.defineAction("badAction", ({ state }) => {
      state.filter = "invalid";  // Not in enum!
    });
    ```

### Validation Hooks

Use `useValidationHook` to add validation as a hook:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    import { useValidationHook, Type } from "cami";
    const schema = {
        count: Type.Natural, // Must be >= 0
    };
    CounterStore.beforeHook(useValidationHook(schema));
    ```

=== "TypeScript"

    ```typescript
    import { useValidationHook, Type } from "cami";

    const schema = {
      count: Type.Natural,  // Must be >= 0
    };

    CounterStore.beforeHook(useValidationHook(schema));
    ```

### Validation Thunk

Use `useValidationThunk` for async validation:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    import { useValidationThunk, Type } from "cami";
    const schema = {
        email: Type.Refinement(Type.String, (v) => v.includes("@")),
    };
    UserStore.afterHook(useValidationThunk(schema));
    ```

=== "TypeScript"

    ```typescript
    import { useValidationThunk, Type } from "cami";

    const schema = {
      email: Type.Refinement(Type.String, (v) => v.includes("@")),
    };

    UserStore.afterHook(useValidationThunk(schema));
    ```

---

## Manual Validation

### `validateType(value, type, path?, rootState?)`

Validate a value against a type definition:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    import { validateType, Type } from "cami";
    const userType = Type.Object({
        name: Type.String,
        age: Type.Integer,
    });
    try {
        validateType({ name: "John", age: 30 }, userType);
        console.log("Valid!");
    }
    catch (error) {
        console.error("Invalid:", error.message);
    }
    ```

=== "TypeScript"

    ```typescript
    import { validateType, Type } from "cami";

    const userType = Type.Object({
      name: Type.String,
      age: Type.Integer,
    });

    try {
      validateType({ name: "John", age: 30 }, userType);
      console.log("Valid!");
    } catch (error) {
      console.error("Invalid:", error.message);
    }
    ```

---

## Type Inference

The type system supports TypeScript inference for better IDE support:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    import { Type } from "cami";
    const userSchema = Type.Object({
        id: Type.Integer,
        name: Type.String,
        tags: Type.Array(Type.String),
    });
    // { id: number; name: string; tags: string[] }
    ```

=== "TypeScript"

    ```typescript
    import { Type, InferType } from "cami";

    const userSchema = Type.Object({
      id: Type.Integer,
      name: Type.String,
      tags: Type.Array(Type.String),
    });

    // Infer the TypeScript type from schema
    type User = InferType<typeof userSchema>;
    // { id: number; name: string; tags: string[] }
    ```

---

## API Reference

### Primitive Constructors

| Constructor | Validates |
|-------------|-----------|
| `Type.String` | `typeof value === "string"` |
| `Type.Float` | `typeof value === "number"` |
| `Type.Integer` | `Number.isInteger(value)` |
| `Type.Natural` | `Number.isInteger(value) && value >= 0` |
| `Type.Boolean` | `typeof value === "boolean"` |
| `Type.BigInt` | `typeof value === "bigint"` |
| `Type.Symbol` | `typeof value === "symbol"` |
| `Type.Null` | `value === null` |
| `Type.Any` | Always passes |
| `Type.Void` | `value === undefined` |
| `Type.Date` | `value instanceof Date` |

### Complex Constructors

| Constructor | Description |
|-------------|-------------|
| `Type.Object(schema)` | Object with specified properties |
| `Type.Array(itemType, options?)` | Array of items |
| `Type.Optional(type)` | Nullable type |
| `Type.Enum(values)` | One of specified values |
| `Type.Sum(types)` | Union of types |
| `Type.Product(fields)` | Tuple with named fields |
| `Type.Refinement(type, predicate)` | Type with custom validation |
| `Type.Literal(value)` | Exact value match |
| `Type.Vect(length, type)` | Fixed-length array |
| `Type.Reference(modelName)` | Reference to a model |
| `Type.Tree(valueType)` | Binary tree |
| `Type.RoseTree(valueType)` | N-ary tree |
| `Type.Function(params, return)` | Function signature |
| `Type.Model(name, properties)` | Create a Model class |

### Validation Functions

| Function | Description |
|----------|-------------|
| `validateType(value, type, path?, root?)` | Validate value against type |
| `useValidationHook(schema)` | Create validation hook |
| `useValidationThunk(schema)` | Create async validation thunk |
