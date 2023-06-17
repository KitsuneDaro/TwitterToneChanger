
class TweetEventListener{
    constructor(article, callback = (() => {})) {
        this.article = article
        this.callback = callback;

        this.mainTextDiv = this.getElementByTestid('tweetText');
        this.userNameDiv = this.getElementByTestid('User-Name');
        this.userAvatarDiv = this.getElementByFirstTestid('UserAvatar-Container');

        if(!this.isDivsUsable()){
            this.divsObserver = new MutationObserver(((m, o) => {
                this.getDivs(m, o);
            }).bind(this));

            this.divsObserver.observe(this.article, {
                childList: true,
                subtree: true
            });
        }
        
        this.userAvatarImg = this.userAvatarDiv.getElementsByTagName('img')[0];

        if(!this.userAvatarImg){
            this.userAvatarImgObserver = new MutationObserver(((m, o) => {
                this.getUserAvatarImg(m, o);
            }).bind(this));
            
            this.userAvatarImgObserver.observe(this.userAvatarDiv, {
                childList: true,
                subtree: true
            });
        }

        this.finishCallback();
    }

    getDivs(mutationsList, ownObserver) {
        this.mainTextDiv = this.getElementByTestid('tweetText');
        this.userNameDiv = this.getElementByTestid('User-Name');
        this.userAvatarDiv = this.getElementByFirstTestid('UserAvatar-Container');

        this.finishCallback();
    }

    getUserAvatarImg(mutationsList, ownObserver) {
        for(const mutation of mutationsList){
            const elementsList = mutation.addedNodes;
            
            for (const element of elementsList) {
                if (element.nodeName == 'IMG') {
                    ownObserver.disconnect();
                    
                    this.userAvatarImg = element;

                    break;
                }
            }
        }

        this.finishCallback();
    }

    getDividedStringFromMainText() {
        const spansList = this.mainTextDiv.getElementsByTagName('span');
        let textList = [];
        
        for(const span of spansList) {
            if(Tweet.IsTweetTextSpan(span)){
                textList.push(span.innerText);
            }
        }

        return new DividedString(textList);
    }

    setMainTextFromDividedString(dividedText) {
        const spansList = this.mainTextDiv.getElementsByTagName('span');

        let j = 0;

        for(let i = 0; i < spansList.length; i++){
            const text = dividedText.get(i);

            while(!Tweet.IsTweetTextSpan(spansList[j])){
                j += 1;
            }

            const span = spansList[j];

            span.innerText = text;

            j += 1;
        }
    }

    getElementByTestid(testid) {
        return this.article.querySelector('[data-testid="' + testid + '"]');
    }

    getElementByFirstTestid(testid) {
        return this.article.querySelector('[data-testid^="' + testid + '"]');
    }

    isDivsUsable() {
        if(this.mainTextDiv && this.userNameDiv && this.userAvatarDiv) {
            return true;
        }

        return false;
    }
    
    isAllValueUsable() {
        if(this.mainTextDiv && this.userNameDiv && this.userAvatarImg) {
            return true;
        }

        return false;
    }

    finishCallback() {
        if(this.isAllValueUsable()) {
            this.callback(this);
            
            if (this.divsObserver) {
                this.divsObserver.disconnect();
            }

            if(this.userAvatarImgObserver) {
                this.userAvatarImgObserver.disconnect();
            }
        }
    }
    
    static IsTweetTextSpan(span) {
        if (span.getAttribute('class') == 'css-901oao css-16my406 r-1tl8opc r-bcqeeo r-qvutc0') {
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
