export abstract class Result<T> {
  public abstract isSuccess(): this is Success<T>;

  public abstract isFailure(): this is Failure<unknown>;

  public abstract exceptionOrNull(): unknown | null;

  public abstract getOrNull(): T | null;

  public abstract getOrThrow(): T | never;

  public abstract getOrDefault<U>(defaultValue: U): T | U;

  public abstract getOrElse<U>(onFailure: (exception: unknown) => U): T | U;

  public abstract fold<U>(
    onSuccess: (value: T) => U,
    onFailure: (exception: unknown) => U,
  ): U;

  public abstract map<U>(transform: (value: T) => U): Result<U>;

  public abstract mapCatching<U>(transform: (value: T) => U): Result<U>;

  public abstract recover<U>(
    transform: (exception: unknown) => U,
  ): Result<T> | Result<U>;

  public abstract recoverCatching<U>(
    transform: (exception: unknown) => U,
  ): Result<T> | Result<U>;

  public abstract onSuccess(action: (value: T) => void): Result<T>;

  public abstract onFailure(action: (exception: unknown) => void): Result<T>;

  public static runCatching<U>(block: () => U): Result<U> {
    try {
      return Result.success(block());
    } catch (error: unknown) {
      return Result.failure(error);
    }
  }

  public static success<T>(value: T): Success<T> {
    return new Success(value);
  }

  public static failure<T>(value: T): Failure<T> {
    return new Failure(value);
  }
}

export class Success<T> extends Result<T> {
  constructor(private readonly value: T) {
    super();
  }

  public isSuccess() {
    return true;
  }

  public isFailure() {
    return false;
  }

  public exceptionOrNull(): null {
    return null;
  }

  public getOrNull(): T {
    return this.value;
  }

  public getOrThrow(): T {
    return this.value;
  }

  public getOrDefault(): T {
    return this.value;
  }

  public getOrElse(): T {
    return this.value;
  }

  public fold<U>(onSuccess: (value: T) => U): U {
    return onSuccess(this.value);
  }

  public map<U>(transform: (value: T) => U): Success<U> {
    return new Success(transform(this.value));
  }

  public mapCatching<U>(transform: (value: T) => U): Result<U> {
    return Result.runCatching(() => transform(this.value));
  }

  public recover(): Success<T> {
    return this;
  }

  public recoverCatching(): Success<T> {
    return this;
  }

  public onSuccess(action: (value: T) => void): Success<T> {
    action(this.value);
    return this;
  }

  public onFailure(): Success<T> {
    return this;
  }
}

export class Failure<T> extends Result<T> {
  constructor(private readonly exception: T) {
    super();
  }

  public isSuccess() {
    return false;
  }

  public isFailure() {
    return true;
  }

  public exceptionOrNull(): T {
    return this.exception;
  }

  public getOrNull(): null {
    return null;
  }

  public getOrThrow(): never {
    throw this.exception;
  }

  public getOrDefault<U>(defaultValue: U): U {
    return defaultValue;
  }

  public getOrElse<U>(transform: (exception: T) => U): U {
    return transform(this.exception);
  }

  public fold<U>(
    _onSuccess: (value: never) => U,
    onFailure: (exception: unknown) => U,
  ): U {
    return onFailure(this.exception);
  }

  public map(): Failure<T> {
    return this;
  }

  public mapCatching(): Failure<T> {
    return this;
  }

  public recover<U>(transform: (exception: T) => U): Success<U> {
    return new Success(transform(this.exception));
  }

  public recoverCatching<U>(transform: (exception: T) => U): Result<U> {
    return Result.runCatching(() => transform(this.exception));
  }

  public onSuccess(): Failure<T> {
    return this;
  }

  public onFailure(action: (exception: T) => void): Failure<T> {
    action(this.exception);
    return this;
  }
}
