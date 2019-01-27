""" Module for removing background from image as a pre-processing step"""
import numpy as np
import cv2 as cv

def crop_image(img):
    """ finds the max contour and crops image """
    gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
    _, threshed = cv.threshold(gray, 240, 255, cv.THRESH_BINARY_INV)

    kernel = cv.getStructuringElement(cv.MORPH_ELLIPSE, (11, 11))
    morphed = cv.morphologyEx(threshed, cv.MORPH_CLOSE, kernel)

    cnts = cv.findContours(morphed, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)[-2]
    cnt = sorted(cnts, key=cv.contourArea)[-1]

    x, y, w, h = cv.boundingRect(cnt)
    dst = img[y:y+h, x:x+w]
    cv.imwrite("001.png", dst)
    return dst

def remove_background(img):
    """ remove background from image """
    mask = np.zeros(img.shape[:2], np.uint8)
    bgdModel = np.zeros((1, 65), np.float64)
    fgdModel = np.zeros((1, 65), np.float64)
    rect = (50, 50, 450, 290)
    cv.grabCut(img, mask, rect, bgdModel, fgdModel, 5, cv.GC_INIT_WITH_RECT)
    mask2 = np.where((mask == 2)|(mask == 0), 0, 1).astype('uint8')
    img = img*mask2[:, :, np.newaxis]
    return img

def main():
    """ main function """
    img = cv.imread("TestImages/1.jpg")
    img = crop_image(img)
    img = remove_background(img)
    cv.imshow(img)
    cv.waitKey(0)

if __name__ == "__main__":
    main()
