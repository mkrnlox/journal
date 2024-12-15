const fetch = require("node-fetch");

exports.handler = async (event) => {
  const { path, httpMethod, headers, body } = event;

  // Убираем префикс `/journal/api` из пути
  const targetPath = path.replace("/journal/api", "/api");

  const targetUrl = `https://msapi.top-academy.ru${targetPath}`;

  try {
    const response = await fetch(targetUrl, {
      method: httpMethod,
      headers,
      body: httpMethod !== "GET" ? body : undefined,
    });

    const responseData = await response.text();

    return {
      statusCode: response.status,
      body: responseData,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "text/plain",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: `Error: ${error.message}`,
    };
  }
};
