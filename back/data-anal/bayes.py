import numpy as np
import scipy.stats as ss; import scipy.special as sp
import csv
import time
import os
from sys import argv
import json

cwd = os.getcwd()

script, dataset, shape, rate, l1, l2, social = argv 
SHAPE = float(shape)
RATE = float(rate)
L1 = int(l1)
L2 = int(l2)
SOCIAL = float(social)
#import matplotlib.pyplot as plt

##The point of the script is to abstract away all of the fucking math
##And just simply attempt to estimate the true rate at which people
##Come into coffehouse. The mean and a 95% credible interval are provided;
##The site should display the credible interval as its "guess" of how many
##people are waiting at coffeehouse based on past data

#create empty dictionary that will store values for the next time around
parameter_dict = {}

def convert_time(time_string):
    """
    Input a time in HH:MM:SS form and output 
    a time object representing that
    """
    return time.strptime(time_string, "%H:%M")

#print(convert_time('07:15'))
with open(cwd + '/data-anal/' + dataset) as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    for row in csv_reader:
        time = row[0] #Extracting time out of a row of data
        point = int(row[1])
        parameter_dict[time] = [point]
    
def posterior(y,a ,b ):
    """
    given data, a, and b from the previous func
    calculate the shape and the rate of the posterior
    """
    shape = a + sum(y)
    rate = b + len(y)
    
    return shape, rate

def credible_interval(shape, rate, alpha = 0.1):
    """
    given the shape, rate, and alpha, return
    a 1 - alpha% CI for the data
    """
    lb = ss.gamma.ppf(alpha/2, a = shape, scale = 1/rate)
    ub = ss.gamma.ppf(1 - alpha/2, a = shape, scale = 1/rate)
    return lb, ub

def construct_credible_interval(data, alpha = 0.1):
    """
    final function
    """
    a, b = jeffreys_prior(data, a_in = SHAPE, b_in = RATE)
    shape, rate = posterior(data, a, b)
    return credible_interval(shape, rate, alpha)

for item in parameter_dict.items():
    shape, rate = posterior(item[1], a = SHAPE, b = RATE)
    lb, ub = credible_interval(shape, rate)
    item[1].pop()
    item[1].append(shape / rate)
    item[1].append(shape)
    item[1].append(rate)
    item[1].append(round(lb))
    item[1].append(round(ub))

final_list = [i for sublist in parameter_dict.values() for i in sublist]

def people_in_rec_area(length_1, length_2, social_d):
    """This function's job is to tell us how many people can fit in a rectangular area. We model people as equally sized circles, with the distance between the center of two circles being the "social distance" between them. Our function takes the lengths of the rectangle and the distance between the center of two adjacent circles as inputs.
    The circles are laid out in a rectangular grid within the rectangular area. This way, the lengths of the sides of the rectange can be given by L1=n*2r and L2 = m*2r where n and m are the number of circles and r is the radius of each circle. We also let social_d = 2r, the distane between the center of two circles."""
    if length_1 <= 0 or length_2 <= 0 or social_d <= 0: #We want our lengths and social_d to be positive numbers.
        raise Exception("Lengths of rectangle and the social distance should be positve numbers.") #Raises exception to inform user of mistake.
    else:
        area = length_1*length_2 #We model our waiting area as a rectangle whose area we define as the product of its length and width.
        max_people_in_rec = int(area/(social_d**2)) #We take A = n*m*social_d^2, where n*m yields the max number of people that can fit in the area. We get: n*m = number of people = area/social_d^2
        return (max_people_in_rec) #returns the maximum number of people in the rectangular area

def is_it_safe(population, max):
    if 0.8*max < population:
        return ('r')
    elif 0.5*max < population <= 0.8*max:
        return ('y')
    elif 0 <= population <= 0.5*max:
        return ('g')

def rewrite_output(ls, l1 = L1, l2 = L2, social = SOCIAL):
    """
    add rgy colors to output 
    """
    max_no = people_in_rec_area(l1, l2, social)
    lsc = ls.copy()
    second = []
    for i in range(len(lsc)):
        second.append(lsc[i])
        if i % 5 == 0:
            second.append(is_it_safe(lsc[i], max_no))
    #second.append(lsc[-1])
    return second

print(str(rewrite_output(final_list))[1:-1])