const defaultHeaders = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS,GET,PUT,PATCH,POST,DELETE",
};

const apiResponses = {
  _200: (body: { [key: string]: any }) => {
    return {
      statusCode: 200,
      body: JSON.stringify(body, null, 2),
      headers: defaultHeaders,
    };
  },
  _201: (body: { [key: string]: any }) => {
    return {
      statusCode: 201,
      body: JSON.stringify(body, null, 2),
      headers: defaultHeaders,
    };
  },
  _204: (body: { [key: string]: any }) => {
    return {
      statusCode: 204,
      body: JSON.stringify(body, null, 2),
      headers: defaultHeaders,
    };
  },
  _400: (body: { [key: string]: any }) => {
    return {
      statusCode: 400,
      body: JSON.stringify(body, null, 2),
      headers: defaultHeaders,
    };
  },
  _500: (body: { [key: string]: any }) => {
    return {
      statusCode: 500,
      body: JSON.stringify(body, null, 2),
      headers: defaultHeaders,
    };
  },
};

export default apiResponses;
