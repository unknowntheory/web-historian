const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const http = require('http');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(this.paths.list, (err, file) => {
    callback(file.toString().split('\n'));
  });
};

exports.isUrlInList = function(url, callback) {
  fs.readFile(this.paths.list, (err, file) => {
    let fileArr = file.toString().split('\n');
    callback(fileArr.includes(url));
  });
};

exports.addUrlToList = function(url, callback) {
  fs.appendFile(this.paths.list, url, () => {
    callback(this.paths.list.toString().split('\n'));
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.readdir(this.paths.archivedSites, (err, files) => {
    callback(files.includes(url));
  });
};

exports.downloadUrls = function(urls) {
  _.each(urls, url => {
    let file = fs.createWriteStream(`${this.paths.archivedSites}/${url}`);
    http.get(`http://${url}`, (response) => response.pipe(file));
  });
};
