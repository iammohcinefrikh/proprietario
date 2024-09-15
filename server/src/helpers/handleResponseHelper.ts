import { Response } from "express";

interface AdditionalData {
  [key: string]: any;
}

const handleResponse = (response: Response, statusCode: number, responseType: "success" | "error", responseBody: string | object, messageBody: string | any, additionalData?: AdditionalData) => {
  const baseResponse = {
    statusCode: statusCode,
    [responseType]: responseBody,
    message: messageBody
  };

  const fullResponse = additionalData ? { ...baseResponse, ...additionalData } : baseResponse;

  response.status(statusCode).json(fullResponse);
};

export default handleResponse;