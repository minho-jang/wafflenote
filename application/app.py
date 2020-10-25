# -*- coding: utf-8 -*-
from flask import Flask, request, jsonify
from text_analysis_beta.keyword_extraction import cleaning_text, text_analysis
from text_analysis_beta.summarization import summarize

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


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
