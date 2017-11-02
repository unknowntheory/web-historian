const path = require('path');
const archive = require('../helpers/archive-helpers');
const httpHelper = require('./http-helpers.js');
const fs = require('fs');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  
  
  if (req.method === 'GET' && req.url === '/') {
    // httpHelper.serveAssets(res, assets, callback);
    fs.readFile(`${archive.paths.siteAssets}/index.html`, (err, file) => {
      res.end(file);
    });
  }
  
  // console.log(req.url)
  if (!req.url.includes('.com') && req.url !== '/') {
    res.writeHead(404, req.method);
    res.end();
  }
  
  if (req.method === 'GET' && req.url !== '/') {
    archive.isUrlArchived(req.url.slice(1), (response) => {
      if (response) {
        fs.readFile(archive.paths.archiveSites + req.url, (file) => {
          res.end(file.toString());
        });
      } else {
        fs.readFile(`${archive.paths.siteAssets}/loading.html`, (err, file) => {
          res.end(file.toString());
          archive.addUrlToList(req.url.slice(1), () => console.log('addedToList'));
        });
      }
    });
  }
  
  if (req.method === 'POST') {
    let url = [];
    res.writeHead(302, req.method);
    
    req.on('data', (chunk) => {
      url.push(chunk);
    }).on('end', () => {    
      url = Buffer.concat(urlObj).toString(); 
      url = url.slice(4);
    }); 
    
    archive.isUrlInList(url + '\n', (response) => {
      if (response) {
        res.end();
      } else {
        archive.addUrlToList(url, (response) =>{
          res.end();
        });
      }
    });
  }
  
};
