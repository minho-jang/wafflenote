from lexrankr import LexRank

lexrank = LexRank(tagger='mecab')  # can init with various settings

with open('../data/test1_punct.txt', 'r') as f:
    text = f.read().split('\n')
    text = ' '.join(text)

lexrank.summarize(text)

num_summaries = 5
summaries = lexrank.probe(num_summaries)  # `num_summaries` can be `None` (using auto-detected topics)
for i, summary in enumerate(summaries):
    print(i, summary)
