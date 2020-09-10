# -*- coding: utf-8 -*-

from flask import Flask, request, jsonify
from my_konlpy.keyword_extraction import cleaning_text, text_analysis, remove_stopwords_in_words
from my_konlpy.stopword import get_stopwords

app = Flask(__name__)


@app.route('/')
def home():
    return 'Hello Flask !!'


@app.route('/keyword-extraction', methods=['POST'])
def keyword_extraction():
    data = request.get_json()
    text = data['text']

    text = cleaning_text(text)
    keywords = text_analysis(text)   # 빈도수 기반 단어 리스트
    keywords = [k[0] for k in keywords]   # 리스트 속 튜플 ('단어', 빈도수)에서 빈도수를 제외한 단어만 리스트로 만듦
    keywords = remove_stopwords_in_words(keywords, get_stopwords())   # 불용어. 쓸데 없는 단어 제거
    print('keywords : ', keywords)

    return jsonify({
        'keywords': keywords[:10]
    })


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001)
