// nS - No Space
// lC - Lowercase

export function filesToModifyContent(currentAppName, newName, projectName) {
  const nS_CurrentAppName = currentAppName.replace(/\s/g, '');
  const nS_NewName = newName.replace(/\s/g, '');
  const lC_Ns_CurrentAppName = nS_CurrentAppName.toLowerCase();
  const lC_Ns_NewName = nS_NewName.toLowerCase();

  return [
    {
      regex: `<string name="app_name">${currentAppName}</string>`,
      replacement: `<string name="app_name">${newName}</string>`,
      paths: ['./android/app/src/main/res/values/strings.xml']
    },
    {
      regex: nS_CurrentAppName,
      replacement: nS_NewName,
      paths: [
        './index.android.js',
        './index.ios.js',
        `./ios/${nS_NewName}.xcodeproj/project.pbxproj`,
        `./ios/${nS_NewName}.xcworkspace/contents.xcworkspacedata`,
        `./ios/${nS_NewName}.xcodeproj/xcshareddata/xcschemes/${nS_NewName}-tvOS.xcscheme`,
        `./ios/${nS_NewName}.xcodeproj/xcshareddata/xcschemes/${nS_NewName}.xcscheme`,
        `./ios/${nS_NewName}/AppDelegate.m`,
        './android/settings.gradle',
        `./ios/${nS_NewName}Tests/${nS_NewName}Tests.m`,
        './ios/build/info.plist',
        './ios/Podfile'
      ]
    },
    {
      regex: `text="${currentAppName}"`,
      replacement: `text="${newName}"`,
      paths: [`./ios/${nS_NewName}/Base.lproj/LaunchScreen.xib`]
    },
    {
      regex: currentAppName,
      replacement: newName,
      paths: [`./ios/${nS_NewName}/Info.plist`]
    },
    {
      regex: `"name": "${nS_CurrentAppName}"`,
      replacement: `"name": "${nS_NewName}"`,
      paths: ['./package.json']
    },
    {
      regex: nS_CurrentAppName,
      replacement: nS_NewName,
      paths: ['./app.json']
    },
    {
      regex: `"displayName": "${currentAppName}"`,
      replacement: `"displayName": "${newName}"`,
      paths: ['./app.json']
    }
  ];
}
