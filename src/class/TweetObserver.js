class TweetObserver {
    constructor(callback) {
        this.timeline = null;
        this.url = '';
        this.callback = callback;
        this.observer = null;
    }

    observe() {
        const observer = new MutationObserver(((m, o) => { this.setup(m, o) }).bind(this));

        observer.observe(document.head, {
            childList: true,
            subtree: true
        });
        
        this.setup();
    }

    setup(mutationsList, ownObserver) {
        const nowURL = window.location.href;
        const root = document.querySelector('#react-root main');

        if (nowURL != this.url && root) {
            const section = document.querySelectorAll('[class="css-175oi2r r-14lw9ot r-jxzhtn r-1ua6aaf r-th6na r-1phboty r-16y2uox r-184en5c r-1abdc3e r-1lg4w6u r-f8sm7e r-13qz1uu r-1ye8kvj"] section > [aria-label*="タイムライン"]')[0];
            //document.getElementsByClassName('css-1dbjc4n r-14lw9ot r-jxzhtn r-1ljd8xs r-13l2t4g r-1phboty r-16y2uox r-1jgb5lz r-11wrixw r-61z16t r-1ye8kvj r-13qz1uu r-184en5c')[0];
            console.log(section);

            if(section && !document.body.contains(this.timeline)){
                console.log(section);
                
                this.url = nowURL;
                this.timeline = section;//.querySelectorAll('div')[0].children[0];
                
                if(this.observer){
                    this.observer.disconnect();
                }

                this.loadTimeline();
            }
        }
    }

    loadTimeline() {
        this.observer = new MutationObserver(((m, o) => { this.updateAllTweets(m, o) }).bind(this));

        this.observer.observe(this.timeline, {
            attributes: true,
            childList: true,
            subtree: true
        });
        
        console.log(this.timeline);
        setTimeout(() => {
            const articlesList = this.timeline.querySelectorAll('article');
            console.log(this.timeline, articlesList);

            for (const article of articlesList) {
                this.updateTweet(article);
            }
        }, 10);
    }

    updateAllTweets(mutationsList, ownObserver) {
        const articlesList = this.timeline.querySelectorAll('article:not([data-fixed="true"])');

        for (const article of articlesList) {
            this.updateTweet(article);
        }
    }

    updateTweet(article) {
        console.log('hi')
        if (Tweet.IsNonfixedTweetArticle(article)) {
            console.log(this.callback.mainText);
            if (this.callback.mainText) {
                Tweet.ObserveMainTextDiv(article, this.callback.mainText);
            }
            article.dataset.fixed = true;
        }
    }
}