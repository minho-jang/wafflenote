# -*- coding: utf-8 -*-
from konlpy.tag import Mecab
from collections import Counter
import re


def remove_brackets(text):
    return re.sub('[()\[\]]', ' ', text)


def remove_special_characters(text):
    return re.sub('[-=+,#/?:^$.@*"~&%!‘|\[\]`\';]', '', text)


# 데이터 로딩
def load_data(path):
    with open(path, 'r') as text_file:
        text = text_file.read()
        text = cleaning_text(text)

    return text


# 텍스트 데이터 전처리
def cleaning_text(text):
    text = remove_brackets(text)
    text = remove_special_characters(text)

    return text


def remove_stopwords_in_words(words, stopwords):
    hit = 0
    keyword_list = []
    for i, w in enumerate(words):
        if w not in stopwords:
            hit += 1
            keyword_list.append(w)

    # print('removed : ', hit)
    return keyword_list


def remove_one_character(words):
    filtered_words = []
    for w in words:
        if len(w) > 1:
            filtered_words.append(w)

    return filtered_words


def text_analysis(text_data):
    # Tokenize
    tokenizer = Mecab()
    noun = tokenizer.nouns(text_data)  # 명사(noun) 추출
    noun = remove_one_character(noun)  # 한 글자 단어 제거

    # 많이 등장한 단어 순
    count = Counter(noun)
    noun_list = count.most_common()

    return noun_list

