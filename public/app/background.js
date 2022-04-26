/*global chrome*/

// Called when the user clicks on the browser action
chrome.browserAction.onClicked.addListener(function (tab) {
   // Send a message to the active tab
   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var activeTab = tabs[0];

      // chrome.storage.local.get(['user'], function (res) {
      //    console.log(res.user)
      // });
      chrome.tabs.sendMessage(
         activeTab.id,
         {
            "message": "clicked_browser_action",
            // "token": localStorage.getItem('token'),
            // "expiryDate": localStorage.getItem('expiryDate'),
            // "userId": localStorage.getItem('userId')
         });
   });
});