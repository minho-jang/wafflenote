from flask import Flask, request, jsonify, abort
import cv2
import numpy as np
from scipy.linalg import norm
from scipy import sum, average
import traceback

app = Flask(__name__)


@app.route('/')
def home():
    return 'Hello Flask !!'


@app.route('/image', methods=['POST'])
def process_image():
    def to_grayscale(arr):
        # If arr is a color image (3D array), convert it to grayscale (2D array).
        if len(arr.shape) == 3:
            return average(arr, -1)  # average over the last axis (color channels)
        else:
            return arr

    def compare_images(im0, im1):
        # normalize to compensate for exposure difference, this may be unnecessary
        # consider disabling it
        tmp0 = normalize(im0)
        tmp1 = normalize(im1)
        # calculate the difference and its norms
        diff = tmp0 - tmp1  # elementwise for scipy arrays
        m_norm = sum(abs(diff))  # Manhattan norm
        z_norm = norm(diff.ravel(), 0)  # Zero norm
        return m_norm, z_norm

    def normalize(arr):
        rng = arr.max() - arr.min()
        amin = arr.min()
        return (arr - amin) * 255 / rng

    def run_sift(img0, img1):
        sift = cv2.xfeatures2d.SIFT_create()
        kp0, des0 = sift.detectAndCompute(img0, None)
        kp1, des1 = sift.detectAndCompute(img1, None)
        bf = cv2.BFMatcher()
        hit = 0
        matches = bf.knnMatch(des0, des1, k=2)
        for m, n in matches:
            if m.distance < 0.3 * n.distance:
                hit += 1
        return hit

    # Get data. Data is string about integer array for image.
    data = request.get_json()

    if 'frame0' not in data or 'frame1' not in data:
        abort(400, 'No image data')

    frame0 = data['frame0']
    frame1 = data['frame1']

    if len(frame0) == 0 or len(frame1) == 0:
        abort(400, 'Data length is zero')

    img0 = None
    img1 = None
    try:
        # Convert string to integer list
        lst_frame0 = list(map(int, frame0.split(',')))
        lst_frame1 = list(map(int, frame1.split(',')))
        # Convert integer list to numpy array
        np_frame0 = np.array(lst_frame0, dtype=np.uint8)
        np_frame1 = np.array(lst_frame1, dtype=np.uint8)
        # Convert numpy array to image
        img0 = cv2.imdecode(np_frame0, cv2.IMREAD_UNCHANGED)
        img1 = cv2.imdecode(np_frame1, cv2.IMREAD_UNCHANGED)
    except Exception:
        print(traceback.print_exc())
        abort(500, 'Image load error')

    try:
        # Image Processing with img0 and img1
        image0 = to_grayscale(img0.astype(float))
        image1 = to_grayscale(img1.astype(float))

        # Calculation Norm1
        n_m, n_0 = compare_images(image0, image1)
        print("Manhattan norm:", n_m, "/ per pixel:", n_m / image0.size)
        # print("Zero norm:", n_0, "/ per pixel:", n_0*1.0/image0.size)

        # Pattern matching algorithm
        same_feature = run_sift(img0, img1)
        print("Pattern matching result:", same_feature)

        # cv2.imwrite('./images/img0.png', img0)
        # cv2.imwrite('./images/img1.png', img1)

        result = "False"
        if n_m / image0.size > 20 and same_feature < 1918 :
            result = "True"
        return result
        # return str(n_m/image0.size)
    except Exception:
        print(traceback.print_exc())
        abort(500, 'Image process error')


if __name__ == "__main__":
    app.run(host='0.0.0.0')
