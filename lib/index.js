#!/usr/bin/env node
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// nS - No Space
// lC - Lowercase

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _nodeReplace = require('node-replace');

var _nodeReplace2 = _interopRequireDefault(_nodeReplace);

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _foldersAndFiles = require('./config/foldersAndFiles');

var _filesToModifyContent = require('./config/filesToModifyContent');

var _bundleIdentifiers = require('./config/bundleIdentifiers');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var androidEnvs = ['main', 'debug'];
var projectName = _package2.default.name;
var projectVersion = _package2.default.version;
var replaceOptions = {
  recursive: true,
  silent: true
};

function replaceContent(regex, replacement, paths) {
  (0, _nodeReplace2.default)(_extends({
    regex: regex,
    replacement: replacement,
    paths: paths
  }, replaceOptions));

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = paths[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var filePath = _step.value;

      console.log(filePath.replace(_utils.__dirname, '') + ' ' + _colors2.default.green('MODIFIED'));
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}

var cleanBuilds = function cleanBuilds() {
  var deleteDirectories = _shelljs2.default.rm('-rf', [_path2.default.join(_utils.__dirname, 'ios/build/*'), _path2.default.join(_utils.__dirname, 'android/.gradle/*'), _path2.default.join(_utils.__dirname, 'android/app/build/*'), _path2.default.join(_utils.__dirname, 'android/build/*')]);

  console.log('Done removing builds.'.green);

  return Promise.resolve(deleteDirectories);
};

(0, _utils.loadAppConfig)().then(function (appConfig) {
  var currentAppName = appConfig.name;
  var nS_CurrentAppName = currentAppName.replace(/\s/g, '');

  _commander2.default.version(projectVersion).arguments('[newName]').option('-b, --bundleID [value]', 'Set custom bundle identifier eg. "com.junedomingo.travelapp"').action(function (argName) {
    var newName = argName || currentAppName;
    var nS_NewName = newName.replace(/\s/g, '');
    var pattern = /^([a-z0-9]|_)+$/g;
    var bundleID = _commander2.default.bundleID ? _commander2.default.bundleID.toLowerCase() : null;
    var newBundlePath = void 0;
    var listOfFoldersAndFiles = (0, _foldersAndFiles.foldersAndFiles)(currentAppName, newName);
    var listOfFilesToModifyContent = (0, _filesToModifyContent.filesToModifyContent)(currentAppName, newName, projectName);

    if (bundleID) {
      newBundlePath = bundleID.replace(/\./g, '/');
      var id = bundleID.split('.');
      var validBundleID = /^([A-Za-z]([0-9A-Z_a-z])*\.)+[A-Za-z]([0-9A-Z_a-z])*$/;
      if (id.length < 2) {
        return console.log('Invalid Bundle Identifier. Add something like "com.travelapp" or "com.junedomingo.travelapp"');
      }
      if (!validBundleID.test(bundleID)) {
        return console.log('Invalid Bundle Identifier. It must have at least two segments (one or more dots). Each segment must start with a letter. All characters must be alphanumeric or an underscore [a-zA-Z0-9_]');
      }
    }

    if (!pattern.test(newName)) {
      return console.log('"' + newName + '" is not a valid name for a project. Please use a valid identifier name (lowercase letters and underscore).');
    }

    // Move files and folders from ./config/foldersAndFiles.js
    var resolveFoldersAndFiles = new Promise(function (resolve) {
      listOfFoldersAndFiles.forEach(function (element, index) {
        var dest = element.replace(new RegExp(nS_CurrentAppName, 'i'), nS_NewName);
        var itemsProcessed = 1;
        var successMsg = '/' + dest + ' ' + _colors2.default.green('RENAMED');

        setTimeout(function () {
          itemsProcessed += index;

          if (_fs2.default.existsSync(_path2.default.join(_utils.__dirname, element)) || !_fs2.default.existsSync(_path2.default.join(_utils.__dirname, element))) {
            var move = _shelljs2.default.exec('git mv -k "' + _path2.default.join(_utils.__dirname, element) + '" "' + _path2.default.join(_utils.__dirname, dest) + '"');

            if (move.code === 0) {
              console.log(successMsg);
            } else if (move.code === 128) {
              // if "outside repository" error occured
              if (_shelljs2.default.mv('-f', _path2.default.join(_utils.__dirname, element), _path2.default.join(_utils.__dirname, dest)).code === 0) {
                console.log(successMsg);
              } else {
                console.log("Ignore above error if this file doesn't exist");
              }
            }
          }

          if (itemsProcessed === listOfFoldersAndFiles.length) {
            resolve();
          }
        }, 200 * index);
      });
    });

    // Modify file content from ./config/filesToModifyContent.js
    var resolveFilesToModifyContent = function resolveFilesToModifyContent() {
      return new Promise(function (resolve) {
        var filePathsCount = 0;
        var itemsProcessed = 0;
        listOfFilesToModifyContent.map(function (file) {
          filePathsCount += file.paths.length;

          file.paths.map(function (filePath, index) {
            var newPaths = [];

            setTimeout(function () {
              itemsProcessed++;
              if (_fs2.default.existsSync(_path2.default.join(_utils.__dirname, filePath))) {
                newPaths.push(_path2.default.join(_utils.__dirname, filePath));
                replaceContent(file.regex, file.replacement, newPaths);
              }
              if (itemsProcessed === filePathsCount) {
                resolve();
              }
            }, 200 * index);
          });
        });
      });
    };

    var resolveBundleIdentifiers = function resolveBundleIdentifiers(params) {
      var currentBundleID = params.currentBundleID,
          newBundleID = params.newBundleID,
          newBundlePath = params.newBundlePath;


      var promises = (0, _bundleIdentifiers.bundleIdentifiers)({
        currentAppName: currentAppName,
        newName: newName,
        projectName: projectName,
        currentBundleID: currentBundleID,
        newBundleID: newBundleID,
        newBundlePath: newBundlePath
      }).map(function (file) {
        return Promise.all(file.paths.map(function (filePath) {
          return new Promise(function (resolve) {
            var newPaths = [];
            if (_fs2.default.existsSync(_path2.default.join(_utils.__dirname, filePath))) {
              newPaths.push(_path2.default.join(_utils.__dirname, filePath));
              replaceContent(file.regex, file.replacement, newPaths);
            }
            resolve();
          });
        }));
      });

      return Promise.all(promises);
    };

    var resolveJavaFiles = function resolveJavaFiles() {
      return new Promise(function (resolve) {
        (0, _utils.loadAndroidManifest)().then(function ($data) {
          var currentBundleID = $data('manifest').attr('package');
          var newBundleID = _commander2.default.bundleID ? bundleID : currentBundleID;

          var promises = androidEnvs.map(function (env) {
            return new Promise(function (envResolve) {
              var javaFileBase = 'android/app/src/' + env + '/java';

              var newJavaPath = javaFileBase + '/' + newBundleID.replace(/\./g, '/');
              var currentJavaPath = javaFileBase + '/' + currentBundleID.replace(/\./g, '/');
              var shouldDelete = !newJavaPath.includes(currentJavaPath);

              if (bundleID) {
                newBundlePath = newJavaPath;
              } else {
                newBundlePath = newBundleID.replace(/\./g, '/').toLowerCase();
                newBundlePath = javaFileBase + '/' + newBundlePath;
              }

              var fullCurrentBundlePath = _path2.default.join(_utils.__dirname, currentJavaPath);
              var fullNewBundlePath = _path2.default.join(_utils.__dirname, newBundlePath);

              // Create new bundle folder if doesn't exist yet
              if (!_fs2.default.existsSync(fullNewBundlePath)) {
                _shelljs2.default.mkdir('-p', fullNewBundlePath);
                var gitMove = _shelljs2.default.exec('git mv -k "' + fullCurrentBundlePath + '/"* "' + fullNewBundlePath + '"');
                var successMsg = newBundlePath + ' ' + _colors2.default.green('BUNDLE INDENTIFIER CHANGED');

                if (gitMove.code === 0) {
                  console.log(successMsg);
                } else if (gitMove.code === 128) {
                  var shellMove = _shelljs2.default.mv('-f', fullCurrentBundlePath + '/*', fullNewBundlePath);
                  // if "outside repository" error occured
                  if (shellMove.code === 0) {
                    console.log(successMsg);
                  } else {
                    console.log('Error moving: "' + currentJavaPath + '" "' + newBundlePath + '"');
                  }
                }

                if (shouldDelete) {
                  _shelljs2.default.rm('-rf', fullCurrentBundlePath);
                }
              }

              var vars = {
                currentBundleID: currentBundleID,
                newBundleID: newBundleID,
                newBundlePath: newBundlePath,
                javaFileBase: javaFileBase,
                currentJavaPath: currentJavaPath,
                newJavaPath: newJavaPath
              };

              return resolveBundleIdentifiers(vars).then(envResolve);
            });
          });

          return Promise.all(promises).then(resolve);
        });
      });
    };

    var rename = function rename() {
      resolveFoldersAndFiles.then(resolveFilesToModifyContent).then(resolveJavaFiles).then(cleanBuilds).then(function () {
        return console.log(('APP SUCCESSFULLY RENAMED TO "' + newName + '"! \uD83C\uDF89 \uD83C\uDF89 \uD83C\uDF89').green);
      }).then(function () {
        if (_fs2.default.existsSync(_path2.default.join(_utils.__dirname, 'ios', 'Podfile'))) {
          console.log('' + _colors2.default.yellow('Podfile has been modified, please run "pod install" inside ios directory.'));
        }
      }).then(function () {
        return console.log('' + _colors2.default.yellow('Please make sure to run "watchman watch-del-all" and "npm start --reset-cache" before running the app. '));
      });
    };

    rename();
  }).parse(process.argv);
  if (!process.argv.slice(2).length) _commander2.default.outputHelp();
}).catch(function (err) {
  if (err.code === 'ENOENT') return console.log('Directory should be created using "react-native init"');

  return console.log('Something went wrong: ', err);
});