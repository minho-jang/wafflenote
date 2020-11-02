# -*- coding: utf-8 -*-
from flask import Flask, request, jsonify, abort
from text_analysis_beta.keyword_extraction import cleaning_text, text_analysis
from text_analysis_beta.summarization import summarize
from text_analysis_beta.key_sentences import get_key_sentences

app = Flask(__name__)


@app.route('/')
def home():
    return 'Hello Flask !!'


@app.route('/keyword-extraction', methods=['POST'])
def keyword_extraction():
    data = request.get_json()
    text = data['text']

    text = cleaning_text(text)            # 텍스트 전처리
    keywords = text_analysis(text)        # 빈도수 기반 단어 리스트

    return jsonify({
        'keywords': keywords
    })


@app.route('/summarization', methods=['POST'])
def summarization():
    data = request.get_json()
    text = data['text']
    num_summaries = data['num']

    try:
        summary = summarize(text, num_summaries)
        if summary[:20] == "SummarizationError: ":
            raise Exception(summary)

        return jsonify({
            'summary': summary
        })
    except Exception as e:
        return jsonify({
            'error': str(e),
            'summary': text
        })


@app.route('/key-sentences', methods=['POST'])
def key_sentences():
    try:
        data = request.get_json()
        text = data['text']
        num = data['num']

        sents = get_key_sentences(text, num)
        if sents[0][:20] == "KeySentencesError: ":
            raise Exception(sents[0])

        return jsonify({
            'key_sentences': sents
        })
    except KeyError as e:
        return abort(400, description="Need parameters 'text' and 'num'")
    except Exception as e:
        import re
        sents = re.split("[.?!]", text)
        sents = [s.strip() for s in sents]
        sents = sents[:num]
        return jsonify({
            'error': str(e),
            'key_sentences': sents
        })

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
