class DividedString{
    constructor(stringsList){
        this.stringsList = stringsList;
        this.fullString = this.stringsList.join('');
        this.fullDividedString = this.stringsList.join('\t');// タグを除いたtweet内に#は出現しない
        this.stringsFullLengthList = DividedString.GetStringsFullLengthList();
    }

    //ここから
    getStringsList(index) {
        return this.stringsList[index];
    }

    static GetStringsFullLengthListstringsList() {
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

    getDividedStringByJapanese(){
        let newStringsList = [];
        let newCharKindList = [];
        let tempString = '';
        let tempCharKind = JapaneseCharacter.GetCharKind(this.fullString[0]);
    
        for(let fullStringIndex = 0; fullStringIndex < this.length; fullStringIndex++){
            const char = this.fullString[fullStringIndex];
            const charKind = JapaneseCharacter.GetCharKind(char);
    
            if(tempCharKind != charKind || this.isStartFullStringIndex(fullStringIndex)){
                newStringsList.push(tempString);
                tempString = '';
    
                newCharKindList.push(tempCharKind);
                tempCharKind = charKind;
            }
    
            tempString += char;
        }
    
        return [newStringsList, newCharKindList];
    }
    //ここまで

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