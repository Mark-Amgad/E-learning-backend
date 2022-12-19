const axios = require("axios");

export function checkForErrors(req, res) {
  console.log(req);
  const language = req.body.language;
  const text = req.body.text;

  const encodedParams = new URLSearchParams();
  encodedParams.append("language", language);          // what is the language of the text
  encodedParams.append("text", text);  // text that we want to check

  const options = {
    method: 'POST',
    url: 'https://api.languagetoolplus.com/v2/check',
    data: encodedParams
  };

  axios.request(options).then(function (response) {
    console.log(response.data);
    res.json(response.data);
  }).catch(function (error) {
    console.error(error);
  });
}