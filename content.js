window.addEventListener('load', function () {
    getJSON('src/replace_word_dictionary.json').then((r) => {
        var dictionary = JSON.parse(r).ojosama;

        const callback = (tweet) => {
            fixTweet(tweet, dictionary);
        };

        const tweetObserver = new TweetObserver({mainText:callback});
        tweetObserver.observe();
    });
});

class TextToneChanger{
    static ChangeTextTone(dividedString, dictionary) {
        const japaneseStringInfosList = dividedString.getDividedStringByJapanese();

        let prefixCharNum = 0;
        let replaceInformationsList = [];

        for(let stringInfosIndex = 0; stringInfosIndex < japaneseStringInfosList.length; stringInfosIndex++){
            const stringInfo = japaneseStringInfosList[stringInfosIndex];
            const string = stringInfo.segment;
            const charKind = stringInfo.kind;
            let nextStringInfo;

            if(JapaneseCharacter.IsJapaneseKind(charKind)){
                if(stringInfosIndex + 1 < japaneseStringInfosList.length){
                    nextStringInfo = japaneseStringInfosList[stringInfosIndex + 1];
                }else{
                    nextStringInfo = {segment: '', kind: JapaneseCharacter.DividedKind()};
                }

                const nextCharKind = nextStringInfo.kind;

                if(JapaneseCharacter.IsSignKind(nextCharKind)) {
                    if(charKind == JapaneseCharacter.KatakanaKind() || charKind == JapaneseCharacter.KanjiKind()) {
                        if(nextCharKind != JapaneseCharacter.OtherKind()){
                            replaceInformationsList.push(new ReplaceInformation(prefixCharNum + string.length, 0, dictionary.notHiraganaSuffix));
                        }else{
                            if(stringInfosIndex + 2 < japaneseStringInfosList.length){
                                const next2CharKind = japaneseStringInfosList[stringInfosIndex + 2].kind;

                                if(next2CharKind == JapaneseCharacter.EnterKind() || next2CharKind == JapaneseCharacter.DividedKind()){
                                    replaceInformationsList.push(new ReplaceInformation(prefixCharNum + string.length, 0, dictionary.notHiraganaSuffix));
                                }
                            }else{
                                replaceInformationsList.push(new ReplaceInformation(prefixCharNum + string.length, 0, dictionary.notHiraganaSuffix));
                            }
                        }
                    }
                }
            }

            prefixCharNum += string.length;
        }

        dividedString.replaceByInformationsList(replaceInformationsList);

        log(dividedString.getDividedStringByJapanese());

        return dividedString;
    }

    static GetSegmentsListByIterator(dividedSegmentsIterator){
        let segmentStringsList = [];
    
        for(const segment of dividedSegmentsIterator){
            if(segment.segment != '\t') {
                segmentStringsList.push(segment.segment);
            }
        }

        return segmentStringsList;
    }
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