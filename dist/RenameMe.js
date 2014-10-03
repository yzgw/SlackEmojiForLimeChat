var apiToken = "YOUR API TOKEN HERE";
var refreshMilliSeconds = 10 * 60 * 1000;

(function(){

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

  var SlackEmoji = function(keyAndValue){

    this.resolve = function (key) { return resolve(key); };
  
    function resolve(key) {
      var value = keyAndValue[key];
    
      if (value !== null) {
        if (value.lastIndexOf('alias', 0) === 0) {
          return resolve( value.substr(value.indexOf(':') + 1, value.length) );
        } else {
          return value;
        }
      } else {
        return undefined;
      }
    }
  };

  var SlackEmojiProvider = function(apiToken, refreshMilliSeconds) {
    var emojiApiEndPoint = "https://slack.com/api/emoji.list";
    var requestUrl = emojiApiEndPoint + "?token=" + apiToken;

    var slackEmoji;

    this.get = function () { return slackEmoji; };

    function refresh() {
      var r = new XMLHttpRequest();
      r.open("GET", requestUrl, true);
      r.onload = function() {
        if (r.status == 200) {
          slackEmoji = new SlackEmoji(JSON.parse(r.responseText).emoji);
        }
      };
      r.send();
    }

    // refresh slackEmoji per specified minutes.
    setInterval(refresh(), refreshMilliSeconds);

    // refresh emoji list at construction.
    refresh();
  };

  var SlackEmojiReplacer = function(slackEmojiProvider) {
    var nameRegex = /:([\w\d+\-_]+):/g;

    this.replace = function(message) {
      return message.replace(nameRegex, function(name) {
        var iconName = name.substr(1, name.length-2);
        var iconUrl = slackEmojiProvider.get().resolve(iconName);
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

})();
