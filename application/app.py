from flask import Flask, request, jsonify, abort

app = Flask(__name__)


@app.route('/')
def home():
    return 'Hello Flask !!'


@app.route('/keyword-extraction', methods=['POST'])
def keyword_extraction():
    # test code
    data = request.get_json()
    text = data['text']
    print(text)
    return 'length of text is {}.'.format(len(text))


if __name__ == "__main__":
    app.run(host='0.0.0.0')
