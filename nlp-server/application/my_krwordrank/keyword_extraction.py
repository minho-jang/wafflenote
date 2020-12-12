from krwordrank.hangle import normalize
from krwordrank.word import KRWordRank

# 데이터 로딩
with open('../data/test1_chunk.txt', 'r') as text_file:
    text = text_file.read()
    texts = text.split('\n')

# 전처리
texts = [normalize(text, english=True, number=True) for text in texts]

min_count = 5  # 단어의 최소 출현 빈도수 (그래프 생성 시)
max_length = 10  # 단어의 최대 길이
wordrank_extractor = KRWordRank(min_count=min_count,
                                max_length=max_length)

beta = 0.85  # PageRank의 decaying factor beta
max_iter = 10

keywords, rank, graph = wordrank_extractor.extract(texts, beta, max_iter)

# 후처리
stopwords = {'같은', '먼저', '그다음에', '하겠습니다', '경우', '보시면', '때문에', '같습니다', '있습니다', '강의를'}  # ...etc
passwords = {word: score for word, score in sorted(
    keywords.items(), key=lambda x: -x[1])[:300] if not (word in stopwords)}

# 출력
for word, r in passwords.items():
    print('%8s:\t%.4f' % (word, r))
