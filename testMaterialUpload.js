const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');

const testMaterialUpload = async () => {
  const form = new FormData();
  form.append('file', fs.createReadStream('C:/Users/Essete/OneDrive/Desktop/test.txt')); // Path to your file

  const response = await fetch('http://localhost:8080/api/uploads/upload', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJ1c3NzZXIiLCJlbWFpbCI6InRlc0BleGFtcGxlLmNvbSIsImlhdCI6MTc0NTg0OTgyMywiZXhwIjoxNzQ1ODUzNDIzfQ.gOiF5Oo4TmWSk6H7Jio14SDU-vL1JQrPBoObWYmmh8s',
    },
    body: form,
  });

  const result = await response.json();
  console.log(result);
};

testMaterialUpload();
