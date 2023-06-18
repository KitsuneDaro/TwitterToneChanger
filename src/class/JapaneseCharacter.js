class JapaneseCharacter {
    static IsHiragana(char){
        return /[\u{3041}-\u{3093}\u{309B}-\u{309E}]/mu.test(char);
    }

    static IsKatakana(char){
        return /[\u{30A1}-\u{30F6}\u{30FB}-\u{30FC}]/mu.test(char);
    }

    static IsKanji(char){
        return /^([\u{3005}\u{3007}\u{303b}\u{3400}-\u{9FFF}\u{F900}-\u{FAFF}\u{20000}-\u{2FFFF}][\u{E0100}-\u{E01EF}\u{FE00}-\u{FE02}]?)$/mu.test(char);
    }

    static IsEnter(char){
        return char == '\n';
    }

    static IsDivided(char) {
        return char == '\t';
    }

    static IsEnd(char) {
        return /[。）」ｗw！？!?．　 ]/mu.test(char);
    }

    static IsJapaneseKind(kind){
        return (kind == JapaneseCharacter.HiraganaKind() || kind == JapaneseCharacter.KatakanaKind() || kind == JapaneseCharacter.KanjiKind());
    }

    static IsSignKind(kind){
        return (kind == JapaneseCharacter.EnterKind() || kind == JapaneseCharacter.DividedKind() || kind == JapaneseCharacter.OtherKind() || kind == JapaneseCharacter.OutRangeKind() || kind == JapaneseCharacter.EndKind());
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

    static OutRangeKind() {
        return 6
    }

    static EndKind() {
        return 7
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
        }else if(JapaneseCharacter.IsEnd(char)){
            return JapaneseCharacter.EndKind();
        }else{
            return JapaneseCharacter.OtherKind();
        }
    }
}