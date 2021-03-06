'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bundleIdentifiers = bundleIdentifiers;

var _globby = require('globby');

var _globby2 = _interopRequireDefault(_globby);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function bundleIdentifiers(_ref) {
  var currentAppName = _ref.currentAppName,
      newName = _ref.newName,
      currentBundleID = _ref.currentBundleID,
      newBundleID = _ref.newBundleID,
      newBundlePath = _ref.newBundlePath;

  var nS_CurrentAppName = currentAppName.replace(/\s/g, '');
  var nS_NewName = newName.replace(/\s/g, '');

  return [{
    regex: currentBundleID,
    replacement: newBundleID,
    paths: ['android/app/BUCK', 'android/app/build.gradle', 'android/app/src/main/AndroidManifest.xml']
  }, {
    regex: currentBundleID,
    replacement: newBundleID,
    paths: _globby2.default.sync([newBundlePath + '/**/*.java'])
  }, {
    // App name (probably) doesn't start with `.`, but the bundle ID will
    // include the `.`. This fixes a possible issue where the bundle ID
    // also contains the app name and prevents it from being inappropriately
    // replaced by an update to the app name with the same bundle ID
    regex: new RegExp('(?!\\.)(.|^)' + nS_CurrentAppName, 'g'),
    replacement: '$1' + nS_NewName,
    paths: [newBundlePath + '/MainActivity.java']
  }];
} // nS - No Space
// lC - Lowercase