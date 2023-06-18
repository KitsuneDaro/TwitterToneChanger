window.addEventListener('load', function () {
    startTweetObserver();
});

function startTweetObserver() {
    getJSON('src/replace_word_dictionary.json').then((r) => {
        var dictionary = JSON.parse(r).ojosama;

        const callback = (tweet) => {
            fixTweet(tweet, dictionary);
        };

        const tweetObserver = new TweetObserver({mainText:callback});
        tweetObserver.observe();

        // ここにイベントリスナーで監視をやめる処理
    });
}

function fixTweet(tweet, dictionary) {
    const mainTextSpansList = Tweet.GetMainTextSpansInMainTextDiv(tweet.mainTextDiv);
    const dividedString = Tweet.GetDividedStringByMainTextSpans(mainTextSpansList);
    const changedDividedString = TextToneChanger.ChangeTextTone(dividedString, dictionary);

    Tweet.SetMainTextSpansByDividedString(mainTextSpansList, changedDividedString);
}

function log(value) {
    console.log(value, 'test');
}

function getJSON(filename) {
    return new Promise((r) => {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', chrome.runtime.getURL(filename), true);
        xhr.onreadystatechange = function() {
            if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                r(xhr.responseText);
            }
        };
        xhr.send();
    });
}