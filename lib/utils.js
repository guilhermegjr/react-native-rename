'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadAndroidManifest = exports.loadAppConfig = exports.__dirname = undefined;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var devTestRNProject = ''; // For Development eg '/Users/junedomingo/Desktop/RN49'
var __dirname = exports.__dirname = devTestRNProject || process.cwd();

function readFile(filePath) {
  return new Promise(function (resolve, reject) {
    _fs2.default.readFile(filePath, function (err, data) {
      if (err) reject(err);
      resolve(data);
    });
  });
}

var loadAppConfig = exports.loadAppConfig = function loadAppConfig() {
  return readFile(_path2.default.join(__dirname, 'app.json')).then(function (data) {
    return JSON.parse(data);
  });
};

var loadAndroidManifest = exports.loadAndroidManifest = function loadAndroidManifest() {
  return readFile(_path2.default.join(__dirname, 'android/app/src/main/AndroidManifest.xml')).then(function (data) {
    return _cheerio2.default.load(data);
  });
};