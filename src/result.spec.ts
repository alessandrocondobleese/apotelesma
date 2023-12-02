import { Failure, Result, Success } from "./result";

describe("Given a Success", () => {
  const result = Result.success(1);
  const doubler = (value: number) => value * 2;
  const thrower = () => {
    throw new Error("error");
  };

  describe("when calling isSuccess", () => {
    it("then should return true", () => {
      expect(result.isSuccess()).toBeTruthy();
    });
  });

  describe("when calling isFailure", () => {
    it("then should return false", () => {
      expect(result.isFailure()).toBeFalsy();
    });
  });

  describe("when calling exceptionOrNull", () => {
    it("then should return null", () => {
      expect(result.exceptionOrNull()).toBeNull();
    });
  });

  describe("when calling getOrNull", () => {
    it("then should return value", () => {
      expect(result.getOrNull()).toBe(1);
    });
  });

  describe("when calling getOrThrow", () => {
    it("then should return value", () => {
      expect(result.getOrThrow()).toBe(1);
    });
  });

  describe("when calling getOrDefault", () => {
    it("then should return value", () => {
      expect(result.getOrDefault()).toBe(1);
    });
  });

  describe("when calling getOrElse", () => {
    it("then should return value", () => {
      expect(result.getOrElse()).toBe(1);
    });
  });

  describe("when calling fold", () => {
    const successCallback = jest.fn();

    it("then should call successCallback", () => {
      result.fold(successCallback);

      expect(successCallback).toHaveBeenCalled();
    });

    it("then should call successCallback with value", () => {
      result.fold(successCallback);

      expect(successCallback).toHaveBeenCalledWith(1);
    });
  });

  describe("when calling map with a transform function", () => {
    it("then should return a Success", () => {
      const transformed = result.map(doubler);

      expect(transformed.isSuccess()).toBeTruthy();
    });

    it("then should return a transformed value", () => {
      const transformed = result.map(doubler);

      expect(transformed.getOrNull()).toBe(2);
    });

    describe("and the transform function throws an error", () => {
      it("then should throw an error", () => {
        function transform() {
          result.map(thrower);
        }

        expect(() => transform()).toThrow();
      });
    });
  });

  describe("when calling mapCatching with a transform function", () => {
    it("then should return a Success", () => {
      const transformed = result.mapCatching(doubler);

      expect(transformed.isSuccess()).toBeTruthy();
    });

    it("then should return a transformed value", () => {
      const transformed = result.mapCatching(doubler);

      expect(transformed.getOrNull()).toBe(2);
    });

    describe("and the transform function throws an error", () => {
      it("then should return a Failure", () => {
        const transformed = result.mapCatching(thrower);

        expect(transformed.isFailure()).toBeTruthy();
      });

      it("then should return a Failure with error", () => {
        const transformed = result.mapCatching(thrower);

        expect(transformed.exceptionOrNull()).toBeInstanceOf(Error);
      });
    });
  });

  describe("when calling recover", () => {
    it("then should return a Success", () => {
      const recovered = result.recover();

      expect(recovered.isSuccess()).toBeTruthy();
    });

    it("then should return a Success with value", () => {
      const recovered = result.recover();

      expect(recovered.getOrNull()).toBe(1);
    });
  });

  describe("when calling recoverCatching", () => {
    it("then should return a Success", () => {
      const recovered = result.recoverCatching();

      expect(recovered.isSuccess()).toBeTruthy();
    });

    it("then should return a Success with value", () => {
      const recovered = result.recoverCatching();

      expect(recovered.getOrNull()).toBe(1);
    });
  });

  describe("when calling onSuccess", () => {
    it("then should call callback", () => {
      const callback = jest.fn();
      result.onSuccess(callback);

      expect(callback).toHaveBeenCalled();
    });

    it("then onSuccess should call callback with value", () => {
      const callback = jest.fn();
      result.onSuccess(callback);

      expect(callback).toHaveBeenCalledWith(1);
    });
  });
});

describe("Given a Failure", () => {
  const error = new Error("error");
  const result = Result.failure(error);
  const recoverer = () => 1;
  const thrower = () => {
    throw error;
  };

  describe("when calling isSuccess", () => {
    it("then should return true", () => {
      expect(result.isSuccess()).toBeFalsy();
    });
  });

  describe("when calling isFailure", () => {
    it("then should return false", () => {
      expect(result.isFailure()).toBeTruthy();
    });
  });

  describe("when calling exceptionOrNull", () => {
    it("then should return exception", () => {
      expect(result.exceptionOrNull()).toStrictEqual(error);
    });
  });

  describe("when calling getOrNull", () => {
    it("then should return value", () => {
      expect(result.getOrNull()).toBeNull();
    });
  });

  describe("when calling getOrThrow", () => {
    it("then should throw", () => {
      function getOrThrow() {
        result.getOrThrow();
      }

      expect(() => getOrThrow()).toThrow();
    });
  });

  describe("when calling getOrDefault", () => {
    it("then should return default value", () => {
      expect(result.getOrDefault(2)).toBe(2);
    });
  });

  describe("when calling getOrElse", () => {
    const elseBlock = jest.fn(() => 1);

    it("then should return the else value", () => {
      expect(result.getOrElse(elseBlock)).toBe(1);
    });
  });

  describe("when calling fold", () => {
    const successCallback = jest.fn();
    const failureCallback = jest.fn();

    it("then should call failureCallback", () => {
      result.fold(successCallback, failureCallback);

      expect(failureCallback).toHaveBeenCalled();
    });

    it("then should call failureCallback with value", () => {
      result.fold(successCallback, failureCallback);

      expect(failureCallback).toHaveBeenCalledWith(error);
    });

    it("then should not call successCallback", () => {
      result.fold(successCallback, failureCallback);

      expect(successCallback).not.toHaveBeenCalled();
    });

    describe("and the failure callback throws an error", () => {
      it("then should throw an error", () => {
        function fold() {
          result.fold(successCallback, thrower);
        }

        expect(() => fold()).toThrow();
      });
    });
  });

  describe("when calling map with a transform function", () => {
    it("then should return a Failure", () => {
      const transformed = result.map();

      expect(transformed.isFailure()).toBeTruthy();
    });

    it("then should return the exception", () => {
      const transformed = result.map();

      expect(transformed.exceptionOrNull()).toStrictEqual(error);
    });
  });

  describe("when calling mapCatching with a transform function", () => {
    it("then should return a Failure", () => {
      const transformed = result.mapCatching();

      expect(transformed.isFailure()).toBeTruthy();
    });

    it("then should return the exception", () => {
      const transformed = result.mapCatching();

      expect(transformed.exceptionOrNull()).toStrictEqual(error);
    });
  });

  describe("when calling recover", () => {
    it("then should return a Success", () => {
      const recovered = result.recover(recoverer);

      expect(recovered.isSuccess()).toBeTruthy();
    });

    it("then should return a Success with value", () => {
      const recovered = result.recover(recoverer);

      expect(recovered.getOrNull()).toBe(1);
    });

    describe("and the recover function throws an error", () => {
      it("then should throw an error", () => {
        function recover() {
          result.recover(thrower);
        }

        expect(() => recover()).toThrow();
      });
    });
  });

  describe("when calling recoverCatching", () => {
    it("then should return a Success", () => {
      const recovered = result.recoverCatching(recoverer);

      expect(recovered.isSuccess()).toBeTruthy();
    });

    it("then should return a Success with value", () => {
      const recovered = result.recoverCatching(recoverer);

      expect(recovered.getOrNull()).toBe(1);
    });

    describe("and the recover function throws an error", () => {
      it("then should return a Failure", () => {
        const recovered = result.recoverCatching(thrower);

        expect(recovered.isFailure()).toBeTruthy();
      });

      it("then should return a Failure with error", () => {
        const recovered = result.recoverCatching(thrower);

        expect(recovered.exceptionOrNull()).toStrictEqual(error);
      });
    });
  });

  describe("when calling onFailure", () => {
    it("then should call callback", () => {
      const callback = jest.fn();
      result.onFailure(callback);

      expect(callback).toHaveBeenCalled();
    });

    it("then should call callback with value", () => {
      const callback = jest.fn();
      result.onFailure(callback);

      expect(callback).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a Result", () => {
  describe("when calling runCatching", () => {
    it("should return Success when no exception is thrown", () => {
      const result = Result.runCatching(() => 42);
      expect(result).toBeInstanceOf(Success);
      expect(result.getOrNull()).toBe(42);
    });

    it("should return Failure when an exception is thrown", () => {
      const error = new Error("Test error");
      const result = Result.runCatching(() => {
        throw error;
      });
      expect(result).toBeInstanceOf(Failure);
      expect(result.exceptionOrNull()).toBe(error);
    });
  });

  describe("when calling success", () => {
    it("should create a Success instance with the provided value", () => {
      const success = Result.success(42);
      expect(success).toBeInstanceOf(Success);
      expect(success.getOrNull()).toBe(42);
    });
  });

  describe("when calling failure", () => {
    it("should create a Failure instance with the provided error", () => {
      const error = new Error("Test error");
      const failure = Result.failure(error);
      expect(failure).toBeInstanceOf(Failure);
      expect(failure.exceptionOrNull()).toBe(error);
    });
  });
});
