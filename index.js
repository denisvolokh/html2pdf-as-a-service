'use strict'

const actions = require('./lib/actions')
const asyncHandler = require('express-async-handler')
const app = require('express')()
const port = 3000

var bodyParser = require('body-parser');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post('/data', function(req, resp) {
    console.log("[+] Request Body", req.body);

    resp.end();
})

app.post('/html2pdf', asyncHandler(async (req, resp, next) => {
    console.log("[+] Request Body", req.body.url);

    if (!("url" in req.body) || req.body.url == "") {
        try {
            const pdf_path_filename = await actions.html2pdf(req.body)
            resp.setHeader('Content-disposition', 'attachment; filename=' + pdf_path_filename)
            resp.download(pdf_path_filename)

        } catch (e) {
            resp.status(400).send('Failed to convert to PDF file: ' + e.message)
        }
    }

    // if (req.query == undefined) {
    //     resp.status(400).send("The query parameters are missing.")

    // } else if (!("url" in req.query) || req.query.url == "") {
    //     resp.status(400).send("The url parameter is missing.")

    // } else {
    //     try {
    //         const pdf_path_filename = await actions.html2pdf(req.query)
    //         resp.setHeader('Content-disposition', 'attachment; filename=' + pdf_path_filename)
    //         resp.download(pdf_path_filename)

    //     } catch (e) {
    //         resp.status(400).send('Failed to convert to PDF file: ' + e.message)
    //     }
        
    // }
}))

app.listen(port, () => console.log('[+] Server listening on port %d', port))
