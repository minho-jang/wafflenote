from krwordrank.word import KRWordRank
from krwordrank.sentence import MaxScoreTokenizer
from krwordrank.sentence import summarize_with_sentences, keysentence, make_vocab_score
from konlpy.tag import Mecab


def get_stopwords():
    with open('../my_konlpy/stopword_list.txt', 'r') as f:
        default_stopwords = f.read().split('\n')

    with open('../my_konlpy/custom_stopword_list.txt', 'r') as f:
        custom_stopwords = f.read().split('\n')

    stopwords = custom_stopwords + default_stopwords
    return set(stopwords)


with open('../data/test4_punct.txt', 'r') as f:
    text = f.read().split('\n')
    text = ' '.join(text)
    text = text.split('. ')

stopwords = get_stopwords()
print(stopwords)
print('====================')
keywords, sents = summarize_with_sentences(text,
                                           stopwords=stopwords,
                                           num_keywords=100,
                                           diversity=0.7,
                                           num_keysents=5,
                                           scaling=lambda x: 1,
                                           verbose=True)
print(list(keywords.items())[:10])
print('====================')
for i, s in enumerate(sents):
    print(i, s)

print('====================')
wordrank_extractor = KRWordRank(min_count=3,        # 단어의 최소 출현 빈도수 (그래프 생성 시)
                                max_length=20,      # 단어의 최대 길이
                                verbose=True)
beta = 0.85    # PageRank의 decaying factor beta
max_iter = 10
keywords, rank, graph = wordrank_extractor.extract(text, beta, max_iter, num_keywords=100)

vocab_score = make_vocab_score(keywords, stopwords, scaling=lambda x: 1)
tokenizer = MaxScoreTokenizer(vocab_score)
tokenizer2 = Mecab()
sents2 = keysentence(vocab_score,
                     text,
                     tokenizer2.nouns,
                     diversity=0.7,
                     topk=5)
for i, s in enumerate(sents2):
    print(i, s)
