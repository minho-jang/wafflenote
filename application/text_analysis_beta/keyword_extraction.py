# -*- coding: utf-8 -*-
from konlpy.tag import Mecab
from collections import Counter
import os.path
import re


# >>> 불용어(stopword) 정의 >>>
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

    stopwords = custom_stopwords + default_stopwords

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
    tokens = remove_one_character(tokens)
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
