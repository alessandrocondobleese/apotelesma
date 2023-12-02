export declare abstract class Result<T> {
    abstract isSuccess(): this is Success<T>;
    abstract isFailure(): this is Failure<unknown>;
    abstract exceptionOrNull(): unknown | null;
    abstract getOrNull(): T | null;
    abstract getOrThrow(): T | never;
    abstract getOrDefault<U>(defaultValue: U): T | U;
    abstract getOrElse<U>(onFailure: (exception: unknown) => U): T | U;
    abstract fold<U>(onSuccess: (value: T) => U, onFailure: (exception: unknown) => U): U;
    abstract map<U>(transform: (value: T) => U): Result<U>;
    abstract mapCatching<U>(transform: (value: T) => U): Result<U>;
    abstract recover<U>(transform: (exception: unknown) => U): Result<T> | Result<U>;
    abstract recoverCatching<U>(transform: (exception: unknown) => U): Result<T> | Result<U>;
    abstract onSuccess(action: (value: T) => void): Result<T>;
    abstract onFailure(action: (exception: unknown) => void): Result<T>;
    static runCatching<U>(block: () => U): Result<U>;
    static success<T>(value: T): Success<T>;
    static failure<T>(value: T): Failure<T>;
}
export declare class Success<T> extends Result<T> {
    private readonly value;
    constructor(value: T);
    isSuccess(): boolean;
    isFailure(): boolean;
    exceptionOrNull(): null;
    getOrNull(): T;
    getOrThrow(): T;
    getOrDefault(): T;
    getOrElse(): T;
    fold<U>(onSuccess: (value: T) => U): U;
    map<U>(transform: (value: T) => U): Success<U>;
    mapCatching<U>(transform: (value: T) => U): Result<U>;
    recover(): Success<T>;
    recoverCatching(): Success<T>;
    onSuccess(action: (value: T) => void): Success<T>;
    onFailure(): Success<T>;
}
export declare class Failure<T> extends Result<T> {
    private readonly exception;
    constructor(exception: T);
    isSuccess(): boolean;
    isFailure(): boolean;
    exceptionOrNull(): T;
    getOrNull(): null;
    getOrThrow(): never;
    getOrDefault<U>(defaultValue: U): U;
    getOrElse<U>(transform: (exception: T) => U): U;
    fold<U>(_onSuccess: (value: never) => U, onFailure: (exception: unknown) => U): U;
    map(): Failure<T>;
    mapCatching(): Failure<T>;
    recover<U>(transform: (exception: T) => U): Success<U>;
    recoverCatching<U>(transform: (exception: T) => U): Result<U>;
    onSuccess(): Failure<T>;
    onFailure(action: (exception: T) => void): Failure<T>;
}
//# sourceMappingURL=result.d.ts.map