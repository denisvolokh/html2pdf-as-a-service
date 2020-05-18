#!/usr/bin/env node
'use strict'

const fs = require('fs')
const puppeteer = require("puppeteer");
const debug = require('debug')('html2pdf-as-a-service')

async function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
const html2pdf = async (params) => {
    console.log("[+] html2pdf received parameters:", params);

    const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();

    console.log("[+] html2pdf open url:", params.url);
    await page.goto(params.url, {
        waitUntil: 'networkidle2'
    });

    await timeout(5000);

    const parameters = {
        "format": params.format || "A4", 
        "printBackground": params.printBackground || true, 
        "scale": params.scale || 1, 
        "margin": {
            "left" : params.marginLeft || "3mm", 
            "right": params.marginRight || "3mm", 
            "top": params.marginTop || "3mm",
            "bottom": params.marginBottom || "3mm"
        }
    }

    console.log("[+] Render parameters: ", parameters);

    const pdf_in_buffer = await page.pdf(parameters);
    await browser.close();
    
    const path_filename = "/tmp/"+ new Date().toISOString().replace(/:/g, "-") + ".pdf"
    console.log("[+] PDF file name: " + path_filename);

    fs.writeFileSync(path_filename, pdf_in_buffer);

    console.log("[+] Successfully Saved to " + path_filename);

    return path_filename
};
  
module.exports = { html2pdf };