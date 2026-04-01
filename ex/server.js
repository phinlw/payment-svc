const express = require("express");
const { generateHeaders } = require("./services/header-service");
require("dotenv").config();
const axios = require("axios");

const app = express();
app.use(express.json());

app.post("/generate-qr", async (req, res) => {
  try {
    const body = req.body;

    // Generate headers and digest for the request
    const headers = generateHeaders(body);

    //Set up API headers
    const apiHeaders = {
      "x-client-transaction-id": headers["x-client-transaction-id"],
      "x-client-Transaction-datetime": headers["x-client-transaction-datetime"],
      partnerId: process.env.LDB_PARTNER_ID,
      digest: headers.digest,
      signature: headers.signature,
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.LDB_BEARER_TOKEN}`,
      Cookie: "JSESSIONID=DB79189C5E045CAF67A320F4F3EAB3FE",
    };

    // console.log("apiHeaders", apiHeaders);

    console.log("body", body);

    const url = new URL("initiate.service", process.env.LDB_URL).toString();

    const response = await axios.post(url, JSON.stringify(body), {
      headers: apiHeaders,
    });

    console.log("response", response);

  return  res.json({
      success: true,
      // requestHeaders: apiHeaders,
      apiResponse: response.data,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "ERROR",
      message: err.response?.data || err.message,
    });
  }
});

// run server
app.listen(3000, () => {
  console.log("API running on port 3000");
});

