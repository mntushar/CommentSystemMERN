class Errors extends Error {
  constructor(errorOrMessage, statusCode = 500, productionError = null) {
    if (typeof errorOrMessage === "string") {
      super(errorOrMessage);
      this.productionError = errorOrMessage;
    } else {
      super(JSON.stringify({ message: errorOrMessage.message, details: errorOrMessage }));
      this.productionError = productionError;
    }
    this.statusCode = statusCode;
  }

  toJSON() {
    return {
      message: this.message,
      stack: this.stack,
      statusCode: this.statusCode,
    };
  }

  static throwError(error, res) {
    error = error instanceof Errors ? error : new Errors(error);

    if (process.env.IS_DEVELOP === 'true') {
      return res.status(error.statusCode).json(error.toJSON());
    }

    return res
      .status(error.statusCode)
      .json({ message: error.productionError ?? 'Something went wrong. Please try again after some time.' });
  }
}

export default Errors;