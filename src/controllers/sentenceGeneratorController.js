const request = require("request");
const cheerio = require('cheerio');


export function getSentence(req, res){
    const URL_TO_PARSE = "https://randomword.com/sentence";
    request(URL_TO_PARSE, (err, response, body) => {
        if (err) throw new Error("Something went wrong");
        // Load the HTML into cheerio's DOM
        const $ = cheerio.load(body);
        // Print the text nodes of the <table> in the HTML
        res.send($('#random_word').text());
    });
    
    
}
