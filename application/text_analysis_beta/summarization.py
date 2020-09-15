# Reference: https://github.com/theeluwin/lexrankr
from lexrankr import LexRank


def summarize(text, num_summaries=None):
    lexrank = LexRank()  # can init with various settings
    lexrank.summarize(text)
    summaries = lexrank.probe(num_summaries)  # `num_summaries` can be `None` (using auto-detected topics)
    return summaries
