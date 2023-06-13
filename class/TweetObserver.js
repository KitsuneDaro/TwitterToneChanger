class TweetObserver {
    constructor(callback) {
        this.timeline = null;
        this.url = '';
        this.callback = callback;
    }

    observe() {
        this.setup();

        const head = document.getElementsByTagName('head')[0];
        const observer = new MutationObserver(((m, o) => {this.setup(m, o)}).bind(this));

        observer.observe(head, {
            attributes: true,
            childList: true,
            subtree: true
        });
    }

    setup(mutationsList, ownObserver) {
        const nowURL = window.location.href;

        if (nowURL != this.url) {
            this.url = nowURL;

            this.loadTimeline();

            const root = document.getElementById('react-root');
            const observer = new MutationObserver(((m, o) => {this.loadTimeline(m, o)}).bind(this));

            observer.observe(root, {
                attributes: true,
                childList: true,
                subtree: true
            });
        }
    }

    loadTimeline(mutationsList, ownObserver) {
        this.timeline = document.getElementsByTagName('section')[0];

        if (typeof this.timeline != 'undefined') {
            if(ownObserver) {
                ownObserver.disconnect();
            }

            const observer = new MutationObserver(((m, o) => {this.updateAllTweets(m, o)}).bind(this));

            observer.observe(this.timeline, {
                attributes: true,
                childList: true,
                subtree: true
            });

            const articlesList = this.timeline.querySelectorAll('article');
            log(articlesList);

            for(const article of articlesList){
                this.updateTweet(article);
            }
        }
    }

    updateAllTweets(mutationsList, ownObserver) {
        for(const mutation of mutationsList){
            const elementsList = mutation.addedNodes;
            
            for (const element of elementsList) {
                if (element.nodeName == 'DIV') {
                    const article = element.getElementsByTagName('article')[0];
                    
                    this.updateTweet(article);
                }
            }
        }
    }

    updateTweet(article) {
        if(Tweet.IsNonfixedTweetArticle(article)){
            if(this.callback.mainText){
                Tweet.ObserveMainTextDiv(article, this.callback.mainText);
            }
            article.dataset.fixed = true;
        }
    }
}