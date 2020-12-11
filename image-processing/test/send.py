import cv2
import numpy as np
from scipy.linalg import norm
from scipy import sum, average
import traceback
import csv



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

def run(x, y, wr):
    img0 = cv2.imread(str(x)+'.png', 1)
    img1 = cv2.imread(str(y)+'.png', 1)

    # 이미지 화면에 표시
    #cv2.imshow('Test Image', img0)
    #cv2.waitKey(0)

    image0 = to_grayscale(img0.astype(float))
    image1 = to_grayscale(img1.astype(float))

    n_m, n_0 = compare_images(image0, image1)
    print(str(x), "  :  Manhattan norm:", n_m, "/ per pixel:", round(n_m / image0.size, 1))
    wr.writerow([x, y, "", round(n_m / image0.size, 1)])


def main():
    f = open('4.csv', 'w', encoding='utf-8')
    wr = csv.writer(f)

    for i in range(379):
        run(i+1, i+2, wr)

    f.close()


main()