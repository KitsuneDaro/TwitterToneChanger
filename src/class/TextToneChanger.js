class TextToneChanger {
    static ChangeTextTone(dividedString, dictionary) {
        const japaneseStringInfosList = JapaneseStringInfosList.GetDividedStringByJapanese(dividedString);

        let prefixCharNum = 0;
        let replaceInformationsList = [];

        for (let stringInfosIndex = 0; stringInfosIndex < japaneseStringInfosList.length; stringInfosIndex++) {
            const stringInfo = japaneseStringInfosList.getInfo(stringInfosIndex);
            const string = stringInfo.segment;
            const charKind = stringInfo.kind;

            if (JapaneseCharacter.IsJapaneseKind(charKind)) {
                const nextStringInfo = japaneseStringInfosList.getInfo(stringInfosIndex + 1);
                const nextCharKind = nextStringInfo.kind;

                if (JapaneseCharacter.IsSignKind(nextCharKind)) {
                    if (charKind == JapaneseCharacter.HiraganaKind()) {
                        replaceInformationsList = TextToneChanger.ChangeTextToneInEndOfHiragana(string, prefixCharNum, japaneseStringInfosList, replaceInformationsList, stringInfosIndex, nextStringInfo, dictionary);
                    } else {
                        replaceInformationsList = TextToneChanger.ChangeTextToneInEndOfNotHiragana(string, prefixCharNum, japaneseStringInfosList, replaceInformationsList, stringInfosIndex, nextStringInfo, dictionary);
                    }
                }
            }
            prefixCharNum += string.length;
        }

        dividedString.replaceByInformationsList(replaceInformationsList);

        return dividedString;
    }

    static ChangeTextToneInEndOfHiragana(string, prefixCharNum, japaneseStringInfosList, replaceInformationsList, stringInfosIndex, nextStringInfo, dictionary) {
        const next2StringInfo = japaneseStringInfosList.getInfo(stringInfosIndex + 2);

        if (JapaneseCharacter.IsSignKind(nextStringInfo.kind) && (nextStringInfo.kind != JapaneseCharacter.OtherKind() || !JapaneseCharacter.IsJapaneseKind(next2StringInfo.kind))) {
            const isNextQuestion = JapaneseStringInfo.IsIncludingQuestionMark(nextStringInfo.segment);
            const nextQuestionKey = ['notQuestion', 'question'][(new Number(isNextQuestion)).valueOf()];

            // ～ねなどの語尾がつく終端単語
            const suffixableEndDictionary = dictionary.suffixableEnd[nextQuestionKey];

            for (const originalWord in suffixableEndDictionary.words) {
                const replacedWord = suffixableEndDictionary.words[originalWord];
                const reg = new RegExp(originalWord + suffixableEndDictionary.suffixReg + '$');

                if (reg.test(string)) {
                    const replaceString = string.match(reg)[0];
                    replaceInformationsList.push(new ReplaceInformation(prefixCharNum + string.length - replaceString.length, replaceString.length, replacedWord));
                    return replaceInformationsList;
                }
            }

            // ～ねなどの語尾がつかない終端単語
            const notSuffixableEndDictionary = dictionary.notSuffixableEnd[nextQuestionKey];

            for (const originalWord in notSuffixableEndDictionary) {
                const replacedWord = notSuffixableEndDictionary[originalWord];
                const reg = new RegExp(originalWord + '$');

                if (reg.test(string)) {
                    const replaceString = string.match(reg)[0];
                    replaceInformationsList.push(new ReplaceInformation(prefixCharNum + string.length - replaceString.length, replaceString.length, replacedWord));
                    return replaceInformationsList;
                }
            }

            // questionありも試す
            if(!isNextQuestion){
                const suffixableEndDictionary = dictionary.suffixableEnd.question;

                for (const originalWord in suffixableEndDictionary.words) {
                    const replacedWord = suffixableEndDictionary.words[originalWord];
                    const reg = new RegExp(originalWord + suffixableEndDictionary.suffixReg + '$');

                    if (reg.test(string)) {
                        const replaceString = string.match(reg)[0];
                        replaceInformationsList.push(new ReplaceInformation(prefixCharNum + string.length - replaceString.length, replaceString.length, replacedWord));
                        return replaceInformationsList;
                    }
                }

                const notSuffixableEndDictionary = dictionary.notSuffixableEnd.question;

                for (const originalWord in notSuffixableEndDictionary) {
                    const replacedWord = notSuffixableEndDictionary[originalWord];
                    const reg = new RegExp(originalWord + '$');

                    if (reg.test(string)) {
                        const replaceString = string.match(reg)[0];
                        replaceInformationsList.push(new ReplaceInformation(prefixCharNum + string.length - replaceString.length, replaceString.length, replacedWord));
                        return replaceInformationsList;
                    }
                }
            }
            
            // それ以外の終端単語
            if (nextStringInfo.kind == JapaneseCharacter.EndKind() || next2StringInfo.kind == JapaneseCharacter.EnterKind() || next2StringInfo.kind == JapaneseCharacter.OutRangeKind()) {
                replaceInformationsList.push(new ReplaceInformation(prefixCharNum + string.length, 0, dictionary.otherHiraganaSuffix[nextQuestionKey]));
                return replaceInformationsList;
            }
        }

        return replaceInformationsList;
    }

    static ChangeTextToneInEndOfNotHiragana(string, prefixCharNum, japaneseStringInfosList, replaceInformationsList, stringInfosIndex, nextStringInfo, dictionary) {
        const isNextQuestion = JapaneseStringInfo.IsIncludingQuestionMark(nextStringInfo.segment);
        const nextQuestionKey = ['notQuestion', 'question'][(new Number(isNextQuestion)).valueOf()];
        
        if (nextStringInfo.kind != JapaneseCharacter.OtherKind()) {
            replaceInformationsList.push(new ReplaceInformation(prefixCharNum + string.length, 0, dictionary.notHiraganaSuffix[nextQuestionKey]));
        } else {
            const next2StringInfo = japaneseStringInfosList.getInfo(stringInfosIndex + 2);
            const next2CharKind = next2StringInfo.kind;

            if (next2CharKind == JapaneseCharacter.OutRangeKind() || next2CharKind == JapaneseCharacter.EnterKind()) {
                replaceInformationsList.push(new ReplaceInformation(prefixCharNum + string.length, 0, dictionary.notHiraganaSuffix[nextQuestionKey]));
            }
        }

        return replaceInformationsList;
    }

    static GetSegmentsListByIterator(dividedSegmentsIterator) {
        let segmentStringsList = [];

        for (const segment of dividedSegmentsIterator) {
            if (segment.segment != '\t') {
                segmentStringsList.push(segment.segment);
            }
        }

        return segmentStringsList;
    }
}