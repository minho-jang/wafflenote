from flask import Flask, request, jsonify
import cv2
import numpy as np
import time

ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
app = Flask(__name__)


@app.route('/')
def home():
    return 'Hello Flask !!'


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/image', methods=['POST'])
def process_image():
    # Check if the post request has the file part
    if 'frame' not in request.files:
        return jsonify({
            'message': 'No file part'
        })

    image = request.files['frame']

    # If user does not select file, browser also submit an empty part without filename
    if image.filename == '':
        return jsonify({
            'message': 'No selected file'
        })

    if image and allowed_file(image.filename):
        # Read image file string data
        file_str = image.read()
        # Convert string data to numpy array
        np_img = np.fromstring(file_str, np.uint8)
        # Convert numpy array to image
        img = cv2.imdecode(np_img, cv2.IMREAD_UNCHANGED)

        # cv2 Test. Delete it, if not required
        cv2.imwrite('images/' + str(time.time()) + '.jpg', img)

        '''
        TODO: Image Processing
        '''

        return jsonify({
            'message': 'Image processing completed!'
        })


if __name__ == "__main__":
    app.run()
