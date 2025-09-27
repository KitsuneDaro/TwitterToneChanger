class Tweet{
    constructor(article, dic){
        // mainTextDiv, userNameDiv, userNameSpan, userNameSpan, userAvatarDiv, userAvatarImg
        this.article = article;
        this.mainTextDiv = dic.mainTextDiv;
        this.userNameDiv = dic.userNameDiv;
        this.userNameSpan = dic.userNameSpan;
        this.userIdSpan = dic.userIdSpan;
        this.userAvatarDiv = dic.userAvatarDiv;
        this.userAvatarImg = dic.userAvatarImg;
    }

    // Tweetオブジェクト生成系
    static GetTweetByArticle(article) {
        mainTextDiv = GetMainTextDivByArticle(article);

        const tweet = Tweet(article);
        return tweet;
    }

    // callback呼び出し系
    static ObserveMainTextDiv(article, callback){
        const mainTextDiv = Tweet.GetMainTextDivByArticle(article);

        if(mainTextDiv == undefined){
            const observer = new MutationObserver(((m, o) => {
                const mainTextDiv = Tweet.GetMainTextDivByArticle(article);

                if(mainTextDiv != undefined){
                    callback(new Tweet(article, {mainTextDiv: mainTextDiv}));
                    o.disconnect();
                }
            }));

            observer.observe(article, {
                childList: true,
                subtree: true
            });
        }else{
            callback(new Tweet(article, {mainTextDiv: mainTextDiv}));
        }
    }

    // element取得系
    static GetMainTextDivByArticle(article) {
        const mainTextDiv = article;//Tweet.GetElementByTestid(article, 'tweetText');
        console.log(mainTextDiv);
        
        return mainTextDiv;
    }

    static GetUserNameDivByArticle(article) {
        const userNameDiv = Tweet.GetElementByTestid(article, 'User-Name');
    }
    
    static GetElementByTestid(article, testid) {
        return article.querySelector('[data-testid="' + testid + '"]');
    }

    static GetElementByPrefixTestid(article, testid) {
        return article.querySelector('[data-testid^="' + testid + '"]');
    }

    static GetMainTextSpansInMainTextDiv(mainTextDiv) {
        const spansList = mainTextDiv.querySelectorAll('span');//getElementsByTagName('span');
        const mainTextSpansList = [];
        console.log(spansList);

        for(const span of spansList) {
            if(Tweet.IsMainTextSpan(span)){
                mainTextSpansList.push(span);
            }
        }

        return mainTextSpansList;
    }

    static GetDividedStringByMainTextSpans(mainTextSpansList) {
        const stringsList = [];

        for(const span of mainTextSpansList) {
            stringsList.push(span.innerText);
        }

        return new DividedString(stringsList);
    }

    static SetMainTextSpansByDividedString(mainTextSpansList, dividedText) {
        for(let i = 0; i < mainTextSpansList.length; i++){
            const span = mainTextSpansList[i];
            const text = dividedText.get(i);

            span.innerText = text;
        }
    }

    // 判定系
    static IsMainTextSpan(span) {// css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-1tl8opc
        console.log('oh');
        if (span.getAttribute('class') == 'css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-1tl8opc') {//'css-901oao css-16my406 r-1tl8opc r-bcqeeo r-qvutc0') {
            console.log('good');
            if (span.parentNode.tagName == 'DIV' && span.parentNode.parentNode.tagName != 'A' && span.innerText != '·') {
                return true;
            }
        }

        return false;
    }
    
    static IsNonfixedTweetArticle(article){
        if(typeof article != 'undefined' && article.getAttribute('data-fixed') != 'true'){
            if (article.getAttribute('data-testid') == 'tweet') {
                return true;
            }
        }

        return false;
    }
}