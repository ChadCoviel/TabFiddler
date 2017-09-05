//@author: Chad Coviel

function getCurrentTab() {
  return browser.tabs.query({active: true});
}

function getCurrentWindowTabs() {
  return browser.tabs.query({currentWindow: true});
}

function onError(error) {
  console.log(`Error: ${error}`);
}

function getTabIDs(tabs) {
  return tabs.map(Tab => Tab.id);
}

browser.commands.onCommand.addListener(function(command) {
  switch (command) {
    case "move-to-back":
      moveCurrentTabsToBack();
      break;
    case "move-to-front":
      moveCurrentTabsToFront();
      break;
    case "alphabetical-order":
      alphabetizeCurrentWindowTabs();
      break
    case "move-left":
      moveCurrentTabsLeft();
      break
    case "move-right":
      moveCurrentTabsRight();
      break
    default:
      console.log('default'); 
  }  
});

function alphabetizeCurrentWindowTabs() {
	var getTabs = getCurrentWindowTabs();
	getTabs.then(function(result) {
      result.sort(function(a,b) {
        var tempA = a.url.toLowerCase().replace("https://","").replace("https://www.","")
        .replace("www.","").replace("http://","").replace("http://www.","");
        var tempB = b.url.toLowerCase().replace("https://","").replace("https://www.","")
        .replace("www.","").replace("http://","").replace("http://www.","");
        return (tempA < tempB ? -1 : (tempA > tempB ? 1 : 0));
      })
      console.log(result);
      browser.tabs.move(getTabIDs(result),{index:0});
  })
  .catch(onError);
}


function moveCurrentTabsToFront() {
  var tabs = getCurrentTab();
  tabs.then(function(result) {
    console.log(result);
    browser.tabs.move(getTabIDs(result),{index:0});
  })
  .catch(onError);
}

function moveCurrentTabsToBack() {
  var tabs = getCurrentTab();
  tabs.then(function(result) {
    browser.tabs.move(getTabIDs(result),{index:-1});    ;
  })
  .catch(onError);
}

function moveCurrentTabsLeft() {
  var tabs = getCurrentTab();
  tabs.then(function(result) {
    browser.tabs.move(getTabIDs(result),{index:result[0].index - 1});    
  })
  .catch(onError);
}

function moveCurrentTabsRight() {
  var tabs = getCurrentTab();
  tabs.then(function(currentTabs) {
    var nextIndex = currentTabs[0].index + 1;
    var currentWindowTabs = getCurrentWindowTabs();
    currentWindowTabs.then(function(currentWindowTabs) {
       browser.tabs.move(getTabIDs(currentTabs),
        {index: (nextIndex >= currentWindowTabs.length ? 0 : nextIndex)});  
    })
    .catch(onError);  
  })
  .catch(onError);
}