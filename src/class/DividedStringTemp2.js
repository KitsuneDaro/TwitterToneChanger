class DividedString{
    constructor(stringsList){
        this.stringsList = stringsList;
        this.fullString = this.stringsList.join('');
        this.fullDividedString = this.stringsList.join('\t');// タグを除いたtweet内に\tは出現しない
        this.stringsFullLengthList = DividedString.GetStringsFullLengthListstringsList(this.stringsList);
    }

    get(i) {
        return this.stringsList[i];
    }

    getStringsList(index) {
        return this.stringsList[index];
    }

    static GetStringsFullLengthListstringsList(stringsList) {
        let stringsFullLengthList = [];
        let stringLength = 0;
        
        for(let stringsListIndex = 0; stringsListIndex < stringsList.length; stringsListIndex++){
            stringLength += stringsList[stringsListIndex].length;
            stringsFullLengthList[stringsListIndex] = stringLength;
        }

        return stringsFullLengthList;
    }

    getStringsListIndexByFullStringIndex(fullStringIndex) {
        let flag = false;
        
        for(let stringsListIndex = 0; stringsListIndex < this.stringsList.length; stringsListIndex++){
            if(this.stringsFullLengthList[stringsListIndex] <= fullStringIndex){
                flag = true;
                break;
            }
        }

        if(flag){
            return stringsListIndex;
        }

        return -1;
    }

    isStartFullStringIndex(fullStringIndex) {
        const stringsListIndex = this.getStringsListIndexByFullStringIndex(fullStringIndex);
        const stringLength = this.stringsFullLengthList[stringsListIndex];
        
        if(fullStringIndex == stringLength) {
            return true;
        }

        return false;
    }

    getDividedStringByJapanese() {
        let newStringsList = [];
        let tempString = '';
        let tempCharKind = JapaneseCharacter.GetCharKind(this.fullDividedString[0]);
    
        for(let fullStringIndex = 0; fullStringIndex < this.fullDividedString.length; fullStringIndex++){
            const char = this.fullDividedString[fullStringIndex];
            const charKind = JapaneseCharacter.GetCharKind(char);
            

            if(tempCharKind != charKind){
                if(tempCharKind == JapaneseCharacter.DividedKind()){
                    tempString = '';
                }

                newStringsList.push({segment: tempString, kind: tempCharKind});
                tempString = '';
                tempCharKind = charKind;
            }
    
            tempString += char;
        }
        
        if(tempCharKind == JapaneseCharacter.DividedKind()){
            tempString = '';
        }

        newStringsList.push({segment: tempString, kind: tempCharKind});
    
        return newStringsList;
    }

    copy() {
        return DividedString(this.stringsList);
    }

    delete(prefixDeleteCharNum, deleteCharLength){
        let string = '';
        let stringsIndex = 0;
        let stringsCharNum = 0;
        let stringLength = 0;
        let breakFlag = false;

        this.fullString = this.fullString.slice(0, prefixDeleteCharNum) + this.fullString.slice(prefixDeleteCharNum + deleteCharLength, this.fullString.length);

        while(stringsIndex < this.stringsList.length) {
            string = this.stringsList[stringsIndex];
            stringLength = string.length;
            stringsCharNum += stringLength;
            
            if(stringsCharNum > prefixDeleteCharNum){
                stringsCharNum -= stringLength;
                breakFlag = true;
                break;
            }

            stringsIndex += 1;
        }

        if(!breakFlag) {
            return false;
        }

        const prefixStringCharNum = prefixDeleteCharNum - stringsCharNum;

        if(prefixStringCharNum + deleteCharLength < stringLength) {
            this.stringsList[stringsIndex] = string.slice(0, prefixStringCharNum) + string.slice(prefixStringCharNum + deleteCharLength, stringLength);
        }else{
            this.stringsList[stringsIndex] = string.slice(0, prefixStringCharNum);

            deleteCharLength -= stringLength - prefixStringCharNum;

            stringsIndex += 1;

            while(deleteCharLength > stringLength){
                string = this.stringsList[stringsIndex];

                deleteCharLength -= stringLength;
                this.stringsList[stringsIndex] = '';
                
                stringsIndex += 1;

                if(stringsIndex >= this.stringsList.length) {
                    breakFlag = true;
                    break;
                }
            }

            if(breakFlag) {
                return true;
            }

            this.stringsList[stringsIndex] = string.slice(deleteCharLength, stringLength);
        }

        return true;
    }

    insert(prefixInsertCharNum, insertString){
        let string = '';
        let stringsIndex = 0;
        let stringsCharNum = 0;
        let stringLength = 0;
        let breakFlag = false;

        this.fullString = this.fullString.slice(0, prefixInsertCharNum) + insertString + this.fullString.slice(prefixInsertCharNum, this.fullString.length);

        while(stringsIndex < this.stringsList.length) {
            string = this.stringsList[stringsIndex];
            stringLength = string.length;
            stringsCharNum += stringLength;
            
            if(stringsCharNum >= prefixInsertCharNum){
                stringsCharNum -= stringLength;
                breakFlag = true;
                break;
            }

            stringsIndex += 1;
        }

        if(!breakFlag) {
            return false;
        }

        const prefixStringCharNum = prefixInsertCharNum - stringsCharNum;

        this.stringsList[stringsIndex] = string.slice(0, prefixStringCharNum) + insertString + string.slice(prefixStringCharNum, string.length);

        return true;
    }

    replace(replaceInformation){
        this.delete(replaceInformation.prefixCharNum, replaceInformation.charLength);
        this.insert(replaceInformation.prefixCharNum, replaceInformation.replaceString);
    }

    replaceByInformationsList(replaceInformationsList){
        const sortedReplaceInformationsList = replaceInformationsList.sort(function(i1, i2) {
            return (i1.prefixCharNum > i2.prefixCharNum) ? -1 : 1;
        });

        for(const replaceInformation of sortedReplaceInformationsList){
            this.replace(replaceInformation);
        }
    }
}

class ReplaceInformation{
    constructor(prefixCharNum, charLength, replaceString){
        this.prefixCharNum = prefixCharNum;
        this.charLength = charLength;
        this.replaceString = replaceString;
    }
}

class JapaneseCharacter {
    static IsHiragana(char){
        return /[\u{3041}-\u{3093}\u{309B}-\u{309E}]/mu.test(char);
    }

    static IsKatakana(char){
        return /[\u{30A1}-\u{30F6}]/mu.test(char);
    }

    static IsKanji(char){
        return /^([\u{3005}\u{3007}\u{303b}\u{3400}-\u{9FFF}\u{F900}-\u{FAFF}\u{20000}-\u{2FFFF}][\u{E0100}-\u{E01EF}\u{FE00}-\u{FE02}]?)$/mu.test(char);
    }

    static IsEnter(char){
        return char == '\n';
    }

    static IsDivided(char){
        return char == '\t';
    }

    static IsJapaneseKind(kind){
        return (kind == JapaneseCharacter.HiraganaKind() || kind == JapaneseCharacter.KatakanaKind() || kind == JapaneseCharacter.KanjiKind());
    }

    static IsSignKind(kind){
        return (kind == JapaneseCharacter.EnterKind() || kind == JapaneseCharacter.DividedKind() || kind == JapaneseCharacter.OtherKind());
    }

    static HiraganaKind() {
        return 1;
    }

    static KatakanaKind() {
        return 2;
    }

    static KanjiKind() {
        return 3;
    }
    
    static EnterKind() {
        return 4;
    }

    static DividedKind() {
        return 5;
    }

    static OtherKind() {
        return 0;
    }

    static GetCharKind(char){
        if(JapaneseCharacter.IsHiragana(char)){
            return JapaneseCharacter.HiraganaKind();
        }else if(JapaneseCharacter.IsKatakana(char)){
            return JapaneseCharacter.KatakanaKind();
        }else if(JapaneseCharacter.IsKanji(char)){
            return JapaneseCharacter.KanjiKind();
        }else if(JapaneseCharacter.IsEnter(char)){
            return JapaneseCharacter.EnterKind();
        }else if(JapaneseCharacter.IsDivided(char)){
            return JapaneseCharacter.DividedKind();
        }else{
            return JapaneseCharacter.OtherKind();
        }
    }
}