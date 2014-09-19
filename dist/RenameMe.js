var apiToken = "YOUR API TOKEN HERE";
var refreshMilliSeconds = 10 * 60 * 1000;

function main() {
  var slackEmojiProvider = new SlackEmojiProvider(apiToken, refreshMilliSeconds);
  var slackEmojiReplacer = new SlackEmojiReplacer(slackEmojiProvider);

  // add event listener for message insertion.
  document.addEventListener("DOMNodeInserted", function(e) {
    var line = e.target;
    var msg = line.getElementsByClassName('message').item(0);
      if (/http:/.test(msg.innerHTML)) return;
    var replaced = slackEmojiReplacer.replace(msg.innerHTML);
    msg.innerHTML = replaced;
  }, false);
}

SlackEmojiProvider = function(apiToken, refreshMilliSeconds) {
  var emojiApiEndPoint = "https://slack.com/api/emoji.list";
  var requestUrl = emojiApiEndPoint + "?token=" + apiToken;

  var cache = {};

  this.get = function(key) {
    return cache;
  };

  function refresh() {
    var r = new XMLHttpRequest();
    r.open("GET", requestUrl, true);
    r.onload = function() {
      if (r.status == 200) {
        cache = JSON.parse(r.responseText).emoji;
      }
    };
    r.send();
  }

  // refresh cache per 10 minutes.
  setInterval(refresh(), refreshMilliSeconds);

  // refresh emoji list at construction.
  refresh();
};

SlackEmojiReplacer = function(slackEmojiProvider) {
  var nameRegex = /:([\w\d+\-_]+):/g;

  this.replace = function(message) {
    return message.replace(nameRegex, function(name) {
      var iconName = name.substr(1, name.length-2);
      var iconUrl = slackEmojiProvider.get()[iconName];
      if(iconUrl === undefined) {
        return name;
      } else {
        return generateIconImgTag(iconUrl);
      }
    });
  };

  function generateIconImgTag(iconUrl) {
    return '<img class="slack-emoji" src=' + iconUrl + '>';
  }
};

main();
