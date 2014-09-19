var apiToken = "YOUR API TOKEN HERE";
var refreshMilliSeconds = 10 * 60 * 1000

function main() {
  var slackEmoji = new SlackEmoji(apiToken);
  var slackEmojiReplacer = new SlackEmojiReplacer(slackEmoji);

  // refresh cache per 10 minutes.
  setInterval(slackEmoji.refresh(), refreshMilliSeconds);

  // add event listener for message insertion.
  document.addEventListener("DOMNodeInserted", function(e) {
    var line = e.target;
    var msg = line.getElementsByClassName('message').item(0);
      if (/http:/.test(msg.innerHTML)) return;
    var replaced = slackEmojiReplacer.replace(msg.innerHTML);
    msg.innerHTML = replaced;
  }, false);
}

SlackEmoji = function(apiToken) {
  var emojiApiEndPoint = "https://slack.com/api/emoji.list";
  var requestUrl = emojiApiEndPoint + "?token=" + apiToken;

  var cache = {};

  this.get = function(key) {
    return cache[key];
  }

  this.refresh = function () {
    var r = new XMLHttpRequest();
    r.open("GET", requestUrl, true);
    r.onload = function() {
      if (r.status == 200) {
        cache = JSON.parse(r.responseText).emoji;
      }
    };
    r.send();
  }

  // refresh emoji list at construction.
  this.refresh();
}

SlackEmojiReplacer = function(slackEmoji) {
  var nameRegex = /:([\w\d+\-_]+):/g

  this.replace = function(message) {
    return message.replace(nameRegex, function(name) {
      var iconName = name.substr(1, name.length-2);
      var iconUrl = slackEmoji.get(iconName);
      if(iconUrl === undefined) {
        return name;
      } else {
        return generateIconImgTag(iconUrl);
      }
    });
  }

  function generateIconImgTag(iconUrl) {
    return '<img class="slack-emoji" src=' + iconUrl + '>'
  }
}

main();