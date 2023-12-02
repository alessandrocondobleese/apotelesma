# Apotelesma

Apotelesma is a TypeScript/typescript library designed to provide a robust structure for handling operations that may result in success or failure. Inspired by functional design patterns and the Kotlin implementation, this library makes error handling and successful data flow management easier through specific classes and methods.

## Features
- Simple and expressive handling of successful and failed operations.
- Methods for transforming, recovering, and acting on results.
- Clear and concise control flows for complex business logic.

## Installation
```bash
npm install apotelesma
```

## Usage

## Result<T>

This abstract class represents the outcome of an operation, which can be either successful (`Result.success`) or a failure (`Result.failure`).

### Methods

#### `isSuccess(): this is Result.success<T>`
- **Description**: Determines if the result is a success.
- **Returns**: `boolean` - `true` if the result is a success, otherwise `false`.
- **Example**:
```typescript
if (result.isSuccess()) {
    console.log("Operation was successful.");
}
```

#### `isFailure(): this is Result.failure<unknown>`
- **Description**: Determines if the result is a failure.
- **Returns**: `boolean` - `true` if the result is a failure, otherwise `false`.
- **Example**:
```typescript
if (result.isFailure()) {
    console.log("Operation failed.");
}
```

#### `exceptionOrNull(): unknown | null`
- **Description**: Retrieves the exception if the result is a failure, otherwise returns `null`.
- **Returns**: `unknown | null` - The exception if present, otherwise `null`.
- **Example**:
```typescript
const error = result.exceptionOrNull();
if (error) {
    console.error(error);
}
```

#### `getOrNull(): T | null`
- **Description**: Gets the value if the result is a success, otherwise returns `null`.
- **Returns**: `T | null` - The success value or `null`.
- **Example**:
```typescript
const value = result.getOrNull();
if (value) {
    console.log("Received value:", value);
}
```

#### `getOrThrow(): T | never`
- **Description**: Gets the value if the result is a success, otherwise throws the exception.
- **Returns**: `T` - The success value.
- **Throws**: The exception if the result is a failure.
- **Example**:
```typescript
try {
    const value = result.getOrThrow();
    console.log("Received value:", value);
} catch (error) {
    console.error("Error occurred:", error);
}
```

#### `getOrDefault<U>(defaultValue: U): T | U`
- **Description**: Gets the value if the result is a success, otherwise returns the provided default value.
- **Parameters**: `defaultValue: U` - The default value to return if the result is a failure.
- **Returns**: `T | U` - The success value or the default value.
- **Example**:
```typescript
const value = result.getOrDefault("Default Value");
console.log("Received value:", value);
```

#### `getOrElse<U>(onFailure: (exception: unknown) => U): T | U`
- **Description**: Gets the value if the result is a success, or executes a function and returns its result if a failure.
- **Parameters**: `onFailure: (exception: unknown) => U` - Function to execute if the result is a failure.
- **Returns**: `T | U` - The success value or the result of the `onFailure` function.
- **Example**:
```typescript
const value = result.getOrElse(error => {
    console.error("Error occurred:", error);
    return "Fallback Value";
});
console.log("Received value:", value);
```

#### `fold<U>(onSuccess: (value: T) => U, onFailure: (exception: unknown) => U): U`
- **Description**: Applies one of two functions based on whether the result is a success or a failure.
- **Parameters**:
  - `onSuccess: (value: T) => U` - Function to apply if the result is a success.
  - `onFailure: (exception: unknown) => U` - Function to apply if the result is a failure.
- **Returns**: `U` - The result of the applied function.
- **Example**:
```typescript
const foldedResult = result.fold(
    value => `Success with value: ${value}`,
    error => `Failure with error: ${error}`
);
console.log(foldedResult);
```

#### `map<U>(transform: (value: T) => U): Result<U>`
- **Description**: Transforms the success value using the provided function. If called on a `Failure`, it does nothing and returns the original `Failure`.
- **Parameters**: `transform: (value: T) => U` - Function to transform the success value.
- **Returns**: `Result<U>` - A new `Result` with the transformed value if called on `Success`, otherwise the original `Failure`.
- **Example**:
```typescript
const result = Result.success(5);
const mappedResult = result.map(value => value * 2);
console.log(mappedResult.getOrNull()); 
// Outputs: 10
```

#### `mapCatching<U>(transform: (value: T) => U): Result<U>`
- **Description**: Similar to `map`, but catches any exceptions thrown by the transform function and returns a `Failure` if an exception occurs.
- **Parameters**: `transform: (value: T) => U` - Function to transform the success value.
- **Returns**: `Result<U>` - A `Success` with the transformed value or a `Failure` if an exception is thrown.
- **Example**:
```typescript
const result = Result.success(5);
const mappedResult = result.mapCatching(value => {
if (value === 5) throw new Error("Error occurred");
    return value * 2;
});
console.log(mappedResult.isFailure()); // Outputs: true
```

#### `recover<U>(transform: (exception: unknown) => U): Result<T> | Result<U>`
- **Description**: Transforms a `Failure` into a `Success` by applying the provided function to the failure value. If called on a `Success`, it does nothing and returns the original `Success`.
- **Parameters**: `transform: (exception: unknown) => U` - Function to transform the failure value.
- **Returns**: `Result<T> | Result<U>` - A `Success` if called on a `Failure`, otherwise the original `Success`.
- **Example**:
```typescript
const result = Result.failure("Error");
const recoveredResult = result.recover(error => "Recovered from " + error);
console.log(recoveredResult.getOrNull()); 
// Outputs: "Recovered from Error"
```

#### `recoverCatching<U>(transform: (exception: unknown) => U): Result<T> | Result<U>`
- **Description**: Similar to `recover`, but catches any exceptions thrown by the transform function and returns a `Failure` if an exception occurs.
- **Parameters**: `transform: (exception: unknown) => U` - Function to transform the failure value.
- **Returns**: `Result<T> | Result<U>` - A `Success` with the transformed value or a `Failure` if an exception is thrown.
- **Example**:
```typescript
const result = Result.failure("Error");
const recoveredResult = result.recoverCatching(error => {
    throw new Error("Another error");
});
console.log(recoveredResult.isFailure()); // Outputs: true
```

#### `onSuccess(action: (value: T) => void): Result<T>`
- **Description**: Executes the provided action if the result is a `Success`. Does nothing if it is a `Failure`.
- **Parameters**: `action: (value: T) => void` - Action to execute with the success value.
- **Returns**: `Result<T>` - The original `Result` for method chaining.
- **Example**:
```typescript
Result.success("Operation successful")
    .onSuccess(value => console.log(value)); 
    // Outputs: "Operation successful"
```

#### `onFailure(action: (exception: unknown) => void): Result<T>`
- **Description**: Executes the provided action if the result is a `Failure`. Does nothing if it is a `Success`.
- **Parameters**: `action: (exception: unknown) => void` - Action to execute with the failure value.
- **Returns**: `Result<T>` - The original `Result` for method chaining.
- **Example**:
```typescript
Result.failure("Operation failed")
    .onFailure(error => console.error(error)); 
    // Outputs: "Operation failed"
```

## Static methods

#### `Result.success<T>(value: T): Success<T>`
- **Description**: Creates a `Success` instance with the provided value. This method is used to represent a successful outcome of an operation.
- **Parameters**: `value: T` - The success value.
- **Returns**: `Success<T>` - An instance representing a successful result.
- **Example**:
```typescript
const success = Result.success("Operation succeeded");
console.log(success.getOrNull()); 
// Outputs: "Operation succeeded"
```

#### `Result.failure<T>(exception: T): Failure<T>`
- **Description**: Creates a `Failure` instance with the provided exception. This method is used to represent a failed outcome of an operation, typically with an error or exception.
- **Parameters**: `exception: T` - The failure exception or error.
- **Returns**: `Failure<T>` - An instance representing a failed result.
- **Example**:
```typescript
const failure = Result.failure(new Error("Operation failed"));
console.log(failure.exceptionOrNull()); 
// Outputs: Error: "Operation failed"
```

These static methods provide a convenient way to create `Success` and `Failure` instances, encapsulating the outcome of operations in your code. This makes handling different results more straightforward and expressive, following functional programming patterns.

#### `Result.runCatching<U>(block: () => U): Result<U>`

- **Description**: Executes a block of code that may throw an exception. Returns a `Success` with the value if the block succeeds, or a `Failure` with the exception if it fails.
- **Parameters**: `block: () => U` - A function that returns a value or throws an exception.
- **Returns**: `Result<U>` - A `Success` or `Failure` depending on the outcome of the block.
- **Example**:
```typescript
const result = Result.runCatching(() => {
    if (someCondition) {
        throw new Error("Error occurred");
    }
    return "Success value";
});

result.onSuccess(value => console.log(value));
result.onFailure(error => console.error(error));
```



