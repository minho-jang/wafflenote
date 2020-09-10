# -*- coding: utf-8 -*-
from .keyword_extraction import load_data, text_analysis
import os.path


# 공통 단어 찾기
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


# deprecated. 위 방법이 더 효과 좋음
# def get_common_word_in_three_list(list1, list2, list3):
#     s1 = set(list1)
#     s2 = set(list2)
#     s3 = set(list3)
#
#     tmp = s1.intersection(s2)
#     result = tmp.intersection(s3)
#
#     return list(result)


def list_to_file(filename, lst):
    with open(filename, 'w') as f:
        for item in lst:
            f.write("%s\n" % item)


def make_default_stopwords():
    text1 = load_data('../data/test1_chunk.txt')
    result1 = text_analysis(text1)
    word_list1 = [x[0] for x in result1]

    text2 = load_data('../data/test2_chunk.txt')
    result2 = text_analysis(text2)
    word_list2 = [x[0] for x in result2]

    text3 = load_data('../data/test3_chunk.txt')
    result3 = text_analysis(text3)
    word_list3 = [x[0] for x in result3]

    frequent_stopwords = get_common_word_in_three_list(word_list1, word_list2, word_list3)
    # save stopwords to txt file
    list_to_file('stopword_list.txt', frequent_stopwords)
    return frequent_stopwords


def get_stopwords():
    if not os.path.exists('my_konlpy/stopword_list.txt'):
        default_stopwords = make_default_stopwords()
    else:
        with open('my_konlpy/stopword_list.txt', 'r') as f:
            default_stopwords = f.read().split('\n')

    with open('my_konlpy/custom_stopword_list.txt', 'r') as f:
        custom_stopwords = f.read().split('\n')

    stopwords = custom_stopwords + default_stopwords

    return stopwords
