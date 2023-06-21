class JapaneseStringInfosList {
    constructor(stringInfosList) {
        this.stringInfosList = stringInfosList;
        this.length = stringInfosList.length;
    }

    getInfo(index) {
        if (index >= 0 && index < this.stringInfosList.length) {
            return this.stringInfosList[index];
        }

        return JapaneseStringInfo.OutRange();
    }

    static GetDividedStringByJapanese(dividedString) {
        let newStringInfosList = [];
        let tempString = '';
        let tempCharKind = JapaneseCharacter.GetCharKind(dividedString.fullDividedString[0]);

        for (let fullStringIndex = 0; fullStringIndex < dividedString.fullDividedString.length; fullStringIndex++) {
            const char = dividedString.fullDividedString[fullStringIndex];
            const charKind = JapaneseCharacter.GetCharKind(char);


            if (tempCharKind != charKind) {
                if (tempCharKind == JapaneseCharacter.DividedKind()) {
                    tempString = '';
                }

                newStringInfosList.push(new JapaneseStringInfo(tempString, tempCharKind));
                tempString = '';
                tempCharKind = charKind;
            }

            tempString += char;
        }

        if (tempCharKind == JapaneseCharacter.DividedKind()) {
            tempString = '';
        }

        newStringInfosList.push(new JapaneseStringInfo(tempString, tempCharKind));

        return new JapaneseStringInfosList(newStringInfosList);
    }
}

class JapaneseStringInfo {
    constructor(segment, kind) {
        this.segment = segment;
        this.kind = kind;
    }

    static OutRange() {
        return new JapaneseStringInfo('', JapaneseCharacter.OutRangeKind());
    }

    static IsIncludingQuestionMark(string) {
        return /[？\?]/.test(string);
    }
}