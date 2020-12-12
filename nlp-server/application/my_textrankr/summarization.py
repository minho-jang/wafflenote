from typing import List
from textrankr import TextRank
from konlpy.tag import Okt


class OktTokenizer:
    okt: Okt = Okt()

    def __call__(self, text: str) -> List[str]:
        tokens: List[str] = self.okt.phrases(text)
        return tokens


okt_tokenizer: OktTokenizer = OktTokenizer()
textrank: TextRank = TextRank(okt_tokenizer)

# num sentences in the resulting summary
k: int = 5
with open('../data/test1_punct.txt', 'r') as f:
    text = f.read().split('\n')
    text = ' '.join(text)

# summarized: str = textrank.summarize(text, k)
# print(summarized)

# if verbose=False, it returns a list
summaries: List[str] = textrank.summarize(text, k, verbose=False)
for i, summary in enumerate(summaries):
    print(i, summary)
