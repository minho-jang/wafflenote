# -*- coding: utf-8 -*-
from konlpy.tag import Mecab
from collections import Counter
import os.path
import re


# >>> 불용어(stopword) 정의 >>>
stopwords_ko = ["저", "것", "동시에", "몇", "고려하면", "관련이", "놀라다", "무엇", "어느쪽", "오", "정도의", "더구나", "아무도", "줄은모른다", "참", "아니",
                "휘익", "향하다", "응당", "알겠는가", "인젠", "그래서", "자신", "해서는", "둘", "이었다", "임에", "하도록시키다", "누구", "이때", "삼",
                "제외하고", "쿵", "하면", "좀", "그렇지않으면", "아니었다면", "이라면", "팍", "일", "통하여", "무엇때문에", "보아", "하게하다", "하는", "이르다",
                "타다", "까지도", "오직", "도달하다", "잠깐", "외에", "심지어", "하려고하다", "게다가", "후", "알", "비하면", "헉헉", "근거로", "월", "따라서",
                "않는다면", "일지라도", "함께", "이유는", "흥", "혼자", "관하여", "붕붕", "하다", "진짜로", "의해", "바와같이", "대하면", "퍽", "보다더",
                "그렇게", "끼익", "댕그", "시초에", "당장", "하는것만", "누가", "만이", "만일", "이지만", "하마터면", "꽈당", "만은", "우선", "없다", "휴",
                "하도록하다", "그런데", "비로소", "하게될것이다", "만큼 어찌됏든", "오히려", "을", "더라도", "안", "왜냐하면", "습니다", "줄은", "그리하여", "하",
                "어떻게", "대로", "기대여", "끙끙", "예를", "와르르", "이리하여", "이", "조차", "하고", "이젠", "뒤이어", "할줄알다", "반대로", "시각", "펄렁",
                "잇따라", "공동으로", "비록", "가까스로", "여덟", "비슷하다", "이상", "차라리", "이어서", "모두", "툭", "조차도", "헉", "부터", "혹시", "않고",
                "우리", "삐걱", "여보시오", "허", "해요", "견지에서", "하기는한데", "토하다", "않으면", "이봐", "관계가", "한다면", "시작하여", "연이서", "이외에도",
                "그", "운운", "에게", "그럼에도", "예", "만약에", "했어요", "결과에", "제", "오자마자", "것들", "약간", "것과", "일때", "셋", "각종",
                "아이구", "같은", "향해서", "일것이다", "해야한다", "아이야", "로", "편이", "등등", "해도좋다", "하기에", "김에", "몰랏다", "같이", "하도다",
                "즉시", "갖고말하자면", "우에", "어느", "허허", "하자마자", "에서", "그래도", "하여야", "된이상", "까악", "한켠으로는", "많은", "그중에서", "사",
                "낼", "뿐만", "저쪽", "어쩔수", "어떤것들", "물론", "결론을", "이만큼", "이렇게되면", "소인", "바꾸어말하면", "들", "이렇구나", "하물며", "얼마간",
                "얼마든지", "한항목", "하는것도", "졸졸", "한마디", "말할것도", "만약", "남들", "총적으로", "허걱", "그리고", "따지지", "구체적으로",
                "못하다    하기보다는", "언제", "따르는", "구토하다", "앞에서", "대해서", "아", "앞의것", "비걱거리다", "헐떡헐떡", "어찌하든지", "입장에서", "의",
                "마저", "바로", "하기만", "않기", "또한", "쓰여", "위해서", "의거하여", "인", "아니면", "를", "사람들", "할수있다", "일곱", "근거하여",
                "한적이있다", "함으로써", "낫다", "어떤것", "방면으로", "중의하나", "어", "무릎쓰고", "저것만큼", "서술한바와같이", "그런즉", "들자면", "하지", "아이고",
                "불문하고", "만", "마저도", "얼마만큼", "예컨대", "이렇게말하자면", "연관되다", "않다면", "들면", "이쪽", "의지하여", "여섯", "그저", "아니다",
                "그렇지만", "기준으로", "되어", "가", "무렵", "즉", "말하면", "어찌", "그럼", "그위에", "그런", "조금", "매번", "혹은", "이천구", "중에서",
                "따름이다", "하기", "가령", "잠시", "아무거나", "하기보다는", "주저하지", "당신", "봐라", "그렇지", "자기집", "할지라도", "요만한걸", "우르르",
                "못하다", "왜", "이렇게", "퉤", "관계없이", "그래", "대해", "쪽으로", "저것", "자기", "아홉", "지만", "구", "하지마", "따위", "하지만", "나",
                "해도", "전자", "그만이다", "안된다", "까닭으로", "되다", "오르다", "딱", "다음에", "너희들", "점에서", "아이쿠", "쾅쾅", "종합한것과같이",
                "할수있어", "그치지", "비교적", "륙", "되는", "개의치않고", "엉엉", "하든지", "때가", "영차", "바꿔", "더불어", "주룩주룩", "따라", "이용하여",
                "우리들", "여기", "더욱이는", "하더라도", "입각하여", "여러분", "마치", "하느니", "너", "어디", "제각기", "밖에", "봐", "위하여", "팔", "요만큼",
                "가서", "아니라면", "지든지", "참나", "할만하다", "타인", "든간에", "하겠는가", "거바", "겨우", "다음", "이러한", "이럴정도로", "각자", "어때",
                "지말고", "형식으로", "그러한즉", "아니나다를가", "할", "불구하고", "지경이다", "어떠한", "기점으로", "할때", "등", "다시", "시키다", "답다", "소생",
                "라", "로써", "각", "부류의", "알았어", "훨씬", "위에서", "뿐이다", "시간", "그러나", "하곤하였다", "일단", "막론하고", "좋아", "솨", "이곳",
                "뿐만아니라", "아울러", "옆사람", "다수", "예하면", "령", "어떤", "어떻해", "할수록", "말하자면", "전후", "메쓰겁다", "에", "으로써", "이번",
                "하면된다", "이것", "딩동", "양자", "달려", "본대로", "탕탕", "마음대로", "쉿", "미치다", "다시말하면", "동안", "그러니까", "과연", "뚝뚝",
                "거의", "이천팔", "이로", "않도록", "또", "한하다", "아래윗", "수", "다소", "어느것", "까지", "남짓", "저기", "관한", "무슨", "그에", "년도",
                "삐걱거리다", "이러이러하다", "와", "넷", "쳇", "논하지", "습니까", "이천육", "기타", "오로지", "어느곳", "설령", "할지언정", "칠", "다만",
                "반드시", "한데", "곧", "의해서", "얼마나", "아니라", "상대적으로", "너희", "있다", "인하여", "다섯", "생각이다", "몰라도", "정도에", "버금",
                "까닭에", "얼마큼", "전부", "로부터", "힘입어", "틈타", "해도된다", "나머지는", "흐흐", "그때", "하여금", "모", "이런", "바꾸어서", "비추어",
                "각각", "설사", "이래", "비길수", "하지마라", "응", "다른", "듯하다", "보는데서", "어쨋든", "대하여", "좍좍", "으로", "여차", "틀림없다", "과",
                "고로", "요컨대", "일반적으로", "줄", "하는바", "그들", "요만한", "윙윙", "콸콸", "어기여차", "언젠가", "이와", "할망정", "이천칠", "네", "없고",
                "둥둥", "겸사겸사", "그러므로", "안다", "거니와", "년", "여부", "때문에", "된바에야", "향하여", "때", "하하", "및", "오호", "하면서", "더군다나",
                "한", "이유만으로", "어이", "하나", "저희", "더욱더", "두번째로", "바꾸어말하자면", "이와같다면", "이르기까지", "단지", "그러면", "야", "결국", "영",
                "뒤따라", "즈음하여", "도착하다", "와아", "다음으로", "같다", "자", "아하", "생각한대로", "외에도", "의해되다", "설마", "으로서", "보면", "할뿐",
                "첫번째로", "아야", "어째서", "하는것이", "하구나", "않다", "힘이", "육", "그러니", "여전히", "어찌됏어", "어찌하여", "어느해", "앗", "게우다",
                "보드득", "관해서는", "자마자", "매", "하고있었다", "어느때", "여", "실로", "해봐요", "얼마", "아이"]


def get_common_word_in_three_list(list1, list2, list3):
    s1 = set(list1)
    s2 = set(list2)
    s3 = set(list3)
    result_set = set()

    tmp1 = s1.intersection(s2)
    result_set = result_set.union(tmp1)

    tmp2 = s2.intersection(s3)
    result_set = result_set.union(tmp2)

    tmp3 = s3.intersection(s1)
    result_set = result_set.union(tmp3)

    return list(result_set)


def list_to_file(filename, lst):
    with open(filename, 'w') as f:
        for item in lst:
            f.write("%s\n" % item)


def make_default_stopwords():
    text1 = load_data('data/test1_chunk.txt')
    result1 = text_analysis(text1)
    word_list1 = [x[0] for x in result1]

    text2 = load_data('data/test2_chunk.txt')
    result2 = text_analysis(text2)
    word_list2 = [x[0] for x in result2]

    text3 = load_data('data/test3_chunk.txt')
    result3 = text_analysis(text3)
    word_list3 = [x[0] for x in result3]

    frequent_stopwords = get_common_word_in_three_list(word_list1, word_list2, word_list3)
    # save stopwords to txt file
    list_to_file('stopword_list.txt', frequent_stopwords)
    return frequent_stopwords


def get_stopwords():
    with open('text_analysis_beta/stopword_list.txt', 'r') as f:
        default_stopwords = f.read().split('\n')

    with open('text_analysis_beta/custom_stopword_list.txt', 'r') as f:
        custom_stopwords = f.read().split('\n')

    stopwords = set(custom_stopwords + default_stopwords)
    stopwords = set.union(stopwords, set(stopwords_ko))
    return stopwords
# <<< 불용어(stopword) 정의 <<<


# >>> 텍스트 분석 >>>
def remove_brackets(text):
    return re.sub('[()\[\]]', ' ', text)


def remove_special_characters(text):
    return re.sub('[-=+,#/?:^$@*"~&%!‘|\[\]`\';]', '', text)


def load_data(path):
    with open(path, 'r') as text_file:
        text = text_file.read()
        text = cleaning_text(text)

    return text


def cleaning_text(text):
    text = remove_brackets(text)
    text = remove_special_characters(text)

    return text


def remove_stopwords_in_words(words, stopwords):
    keyword_list = []
    for i, w in enumerate(words):
        if w not in stopwords:
            keyword_list.append(w)

    return keyword_list


def remove_one_character(words):
    filtered_words = []
    for w in words:
        if len(w) > 1:
            filtered_words.append(w)

    return filtered_words


def text_tokenize(text):
    tokenizer = Mecab()
    tokens = tokenizer.nouns(text)  # 명사(noun) 추출
    return tokens


def post_process(tokens):
    # 한 글자 단어 제거
    #tokens = remove_one_character(tokens)
    # 불용어 제거
    stopwords = get_stopwords()
    tokens = remove_stopwords_in_words(tokens, stopwords)

    return tokens


def text_count(tokens):
    # 많이 등장한 단어 순
    count = Counter(tokens)
    noun_list = count.most_common()

    return noun_list


def text_analysis(text):
    tokens = text_tokenize(text)
    nouns = post_process(tokens)
    count = text_count(nouns)
    return count
# <<< 텍스트 분석 <<<
