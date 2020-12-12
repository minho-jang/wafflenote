from keyword_extraction import load_data, text_analysis

# TEST 1
# result1_many = remove_stopwords_in_words(word_list1, stopwords)
# print(result1_many)

# TEST 2
# result2_many = remove_stopwords_in_words(word_list2, stopwords)
# print(result2_many)

# TEST 3
# result3_many = remove_stopwords_in_words(word_list3, stopwords)
# print(result3_many)

# stopwords를 만든 텍스트가 아닌 다른 텍스트로 테스트
# TEST 4
# text4 = load_data('../data/test4_chunk.txt')
# result4 = text_analysis(text4)
# word_list4 = [x[0] for x in result4]
# print(word_list4)
# result4_filtered = remove_stopwords_in_words(word_list4, stopwords)
# print(result4_filtered)

# TEST 5
text5 = load_data('../data/test5_chunk.txt')
result5 = text_analysis(text5)
print(result5)
word_list5 = [x[0] for x in result5]
print(word_list5)
# result5_filtered = remove_stopwords_in_words(word_list5, stopwords)
# print(result5_filtered)
