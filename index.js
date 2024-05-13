const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();

app.use(bodyParser.raw({ limit: "10mb", type: "*/*" }));

// Define a route to handle the raw content
app.post("/webhook-trigger", (req, res) => {
  const rawContent = req.body.toString(); 

  const jsonObject = JSON.parse(rawContent);

  const screenerChatId = jsonObject.screenerChatId;
  console.log("screenerChatId:", screenerChatId);
  // console.log("screenerChatHistory:", jsonObject.screenerChatHistory);

  const base64PdfString = jsonObject.file;

  if (base64PdfString) {
    // Decode Base64 string to a buffer
    const pdfBuffer = Buffer.from(base64PdfString, "base64");
    // Define the file path
    const filePath = `report-${screenerChatId}.pdf`;
    // Write buffer to file
    fs.writeFile(filePath, pdfBuffer, (err) => {
      if (err) throw err;
      console.log("The file has been saved!");
    });
  }

  res.send("Raw content received successfully");
});

app.listen(4001, () => {
  console.log("Server is running on port 4001");
});
