from flask import Flask, request, jsonify
import cv2
import numpy as np
import time

app = Flask(__name__)


@app.route('/')
def home():
    return 'Hello Flask !!'


@app.route('/image', methods=['POST'])
def process_image():
    # Get data. Data is string about integer array for image.
    frame0 = request.form['frame0']
    frame1 = request.form['frame1']

    if frame0 and frame1:
        # Convert string to integer list
        lst_frame0 = list(map(int, frame0.split(',')))
        lst_frame1 = list(map(int, frame1.split(',')))
        # Convert integer list to numpy array
        np_frame0 = np.array(lst_frame0, dtype=np.uint8)
        np_frame1 = np.array(lst_frame1, dtype=np.uint8)
        # Convert numpy array to image
        img0 = cv2.imdecode(np_frame0, cv2.IMREAD_UNCHANGED)
        img1 = cv2.imdecode(np_frame1, cv2.IMREAD_UNCHANGED)

        # Test. If don't need, delete it
        print('img0 shape is ', img0.shape)
        print('img1 shape is ', img1.shape)

        '''
        TODO: Image Processing with img0 and img1
        '''
        cv2.imwrite('./images/img0.png', img0)
        cv2.imwrite('./images/img1.png', img1)

        return jsonify({
            'message': 'Image processing completed!'
        })


if __name__ == "__main__":
    app.run(host='0.0.0.0')
