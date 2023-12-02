'use strict';

class Result {
    static runCatching(block) {
        try {
            return Result.success(block());
        }
        catch (error) {
            return Result.failure(error);
        }
    }
    static success(value) {
        return new Success(value);
    }
    static failure(value) {
        return new Failure(value);
    }
}
class Success extends Result {
    constructor(value) {
        super();
        this.value = value;
    }
    isSuccess() {
        return true;
    }
    isFailure() {
        return false;
    }
    exceptionOrNull() {
        return null;
    }
    getOrNull() {
        return this.value;
    }
    getOrThrow() {
        return this.value;
    }
    getOrDefault() {
        return this.value;
    }
    getOrElse() {
        return this.value;
    }
    fold(onSuccess) {
        return onSuccess(this.value);
    }
    map(transform) {
        return new Success(transform(this.value));
    }
    mapCatching(transform) {
        return Result.runCatching(() => transform(this.value));
    }
    recover() {
        return this;
    }
    recoverCatching() {
        return this;
    }
    onSuccess(action) {
        action(this.value);
        return this;
    }
    onFailure() {
        return this;
    }
}
class Failure extends Result {
    constructor(exception) {
        super();
        this.exception = exception;
    }
    isSuccess() {
        return false;
    }
    isFailure() {
        return true;
    }
    exceptionOrNull() {
        return this.exception;
    }
    getOrNull() {
        return null;
    }
    getOrThrow() {
        throw this.exception;
    }
    getOrDefault(defaultValue) {
        return defaultValue;
    }
    getOrElse(transform) {
        return transform(this.exception);
    }
    fold(_onSuccess, onFailure) {
        return onFailure(this.exception);
    }
    map() {
        return this;
    }
    mapCatching() {
        return this;
    }
    recover(transform) {
        return new Success(transform(this.exception));
    }
    recoverCatching(transform) {
        return Result.runCatching(() => transform(this.exception));
    }
    onSuccess() {
        return this;
    }
    onFailure(action) {
        action(this.exception);
        return this;
    }
}

exports.Result = Result;
