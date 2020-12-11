import csv
import numpy as np
import matplotlib.pyplot as plt
import matplotlib as mpl
from matplotlib import pyplot

set0 = [];
set1 = [];

f = open('4.csv', 'r', encoding='utf-8')
rdr = csv.reader(f)
for line in rdr:
    if line[2] == '0':
        set0.append(float(line[3]))
    elif line[2] == '1':
        set1.append(float(line[3]))
f.close()

f = open('1.csv', 'r', encoding='utf-8')
rdr = csv.reader(f)
for line in rdr:
    if line[2] == '0':
        set0.append(float(line[3]))
    elif line[2] == '1':
        set1.append(float(line[3]))
f.close()

f = open('3.csv', 'r', encoding='utf-8')
rdr = csv.reader(f)
for line in rdr:
    if line[2] == '0':
        set0.append(float(line[3]))
    elif line[2] == '1':
        set1.append(float(line[3]))
f.close()

print(len(set0))
print(len(set1))

arr0 = np.empty((0,2), float)
arr1 = np.empty((0,2), float)

arr0x = []
arr0y = []
arr1x = []
arr1y = []

for i in range(len(set0)):
    arr0x.append((i+1)/60)
    arr0y.append(set0[i])

for i in range(len(set1)):
    arr1x.append((i+1)/60)
    arr1y.append(set1[i])

pyplot.figure()

pyplot.xticks(np.arange(0, 250, step=5))
pyplot.yticks(np.arange(0, 5, step=5))

pyplot.scatter(arr0y, arr0x, color='r')
pyplot.scatter(arr1y, arr1x, color='b')



pyplot.show()




