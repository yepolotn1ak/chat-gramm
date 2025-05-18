import { ApiError } from '../exceptions/api.error.js';

export const errorMiddleware = (error, req, res) => {
  if (error instanceof ApiError) {
    const { status, message, errors } = error;

    res.status(status).send({
      message,
      errors,
    });

    return;
  }

  res.status(500).send({ message: 'Server error' });
};
