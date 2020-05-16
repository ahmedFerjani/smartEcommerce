from django.shortcuts import render

from imutils import paths
import face_recognition
import argparse
import pickle
import numpy as np
import cv2
import csv
import requests
import imutils
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework import status
from .models import client
from django.http import JsonResponse
from .serializers import clientSerialize
from django.views.decorators.csrf import csrf_exempt
from django.forms.models import model_to_dict
from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import os
import time



class clientList(viewsets.ModelViewSet):
    queryset=client.objects.all()
    serializer_class=clientSerialize


@csrf_exempt
def createuser(request):
    if request.method == "POST":
        try:
            firstname = request.POST.get('firstname')
            lastname = request.POST.get('lastname')
            email = request.POST.get('email')
            password = request.POST.get('password')
            client.objects.create(firstname=firstname,lastname=lastname , email=email, password=password)
            return JsonResponse({"message":"User successfully created"}, status=200)
        except Exception as e:
            print(e)
            return JsonResponse({"message":"Can't create user"}, status=500)



@csrf_exempt
def userinfo(request):
    if request.method == "POST":
        try:
            user = client.objects.get(email=request.POST.get('email'))
        except Exception as e:
            return JsonResponse({"message":"user does not exist"},status=404)
        user = client.objects.get(email=request.POST.get('email'))
        return JsonResponse({"user":model_to_dict(user)}, status=200)

@csrf_exempt
def login(request):
    if request.method == "POST":
        try:
            user=client.objects.get(email=request.POST.get('email'))
        except Exception as e:
            return JsonResponse({"message":"user does not exist"}, status=404) 
        password=request.POST.get('password')
        if(password==user.password):
            return JsonResponse({"message":'login successful'},status=200)
        else:
            return JsonResponse({"message":'password dont match'},status=500)



@csrf_exempt
def AddImage(request):
    if request.method=="POST":
        if (os.path.exists(settings.BASE_DIR+'/images/'+request.POST.get('email'))):
            file = request.FILES['image']
            if(  os.path.exists(settings.BASE_DIR+'/images/'+request.POST.get('email')+'/'+file.name) ):
                return JsonResponse({"message": "image already exists"}, status=500)
            else:
                path = default_storage.save(settings.BASE_DIR+'/images/'+request.POST.get('email')+'/'+file.name, ContentFile(file.read()))
        else:
            new_dir_path = os.path.join(settings.BASE_DIR+'/images/', request.POST.get('email'))
            os.mkdir(new_dir_path)
            file = request.FILES['image']
            path = default_storage.save(settings.BASE_DIR + '/images/' + request.POST.get('email') + '/' + file.name,ContentFile(file.read()))

        imagePath =settings.BASE_DIR + '/images/' + request.POST.get('email') + '/' +file.name
        # initialize the list of known encodings and known names
        f = open(settings.BASE_DIR+"/webapp/encoding.pkl", "rb")
        #f = open("C:/Users/DELL/PycharmProjects/DjangoRest/myproject/webapp/encoding.pkl", "rb")
        try:
            data = pickle.load(f)
            encodings=data['encodings']
            names=data['names']
        except:
            encodings=[]
            names=[]

        print(names)
        name = request.POST.get('email')
        print(name)
        # load the input image and convert it from BGR (OpenCV ordering)
        # to dlib ordering (RGB)
        print("starting encoding")
        image = cv2.imread(imagePath)
        resized = cv2.resize(image, (350,200), interpolation=cv2.INTER_AREA)
        rgb = cv2.cvtColor(resized, cv2.COLOR_BGR2RGB)
        boxes = face_recognition.face_locations(rgb, model="cnn")
        encodingss = face_recognition.face_encodings(rgb, boxes)
        for encoding in encodingss:
            # add each encoding + name to our set of known names and
            # encodings
            encodings.append(encoding)
            names.append(name)

        print("[INFO] serializing encodings...")
        data = {"encodings": encodings, "names": names}
        #f = open("C:/Users/DELL/PycharmProjects/DjangoRest/myproject/webapp/encoding.pkl", "wb")
        f = open(settings.BASE_DIR+"/webapp/encoding.pkl", "wb")
        f.write(pickle.dumps(data))
        f.close()
        return JsonResponse({"message": "image added"}, status=201)


@csrf_exempt
def Recognize(request):
    if request.method=="POST":
        #file=request.FILES['image']
        print("[INFO] loading encodings...")
        #data = pickle.loads(open("C:/Users/DELL/PycharmProjects/DjangoRest/myproject/webapp/encoding.pkl", "rb").read())
        data = pickle.loads(open(settings.BASE_DIR+"/webapp/encoding.pkl", "rb").read())
        # load the input image and convert it from BGR to RGB
        filestr = request.FILES['image'].read()
        # convert string data to numpy array
        npimg = np.fromstring(filestr, np.uint8)
        # convert numpy array to image
        image = cv2.imdecode(npimg, cv2.IMREAD_UNCHANGED)
        resized = cv2.resize(image, (350,200), interpolation=cv2.INTER_AREA)
        rgb = cv2.cvtColor(resized, cv2.COLOR_BGR2RGB)
        # detect the (x, y)-coordinates of the bounding boxes corresponding
        # to each face in the input image, then compute the facial embeddings
        # for each face
        print("[INFO] recognizing faces...")
        boxes = face_recognition.face_locations(rgb, model="cnn")
        encodings = face_recognition.face_encodings(rgb, boxes)
        names = []
        for encoding in encodings:
            matches = face_recognition.compare_faces(data["encodings"], encoding)
            name = "Unknown"
            
            if True in matches:
                # find the indexes of all matched faces then initialize a
                # dictionary to count the total number of times each face
                # was matched
                matchedIdxs = [i for (i, b) in enumerate(matches) if b]
                counts = {}
                # loop over the matched indexes and maintain a count for
                # each recognized face face
                for i in matchedIdxs:
                    name = data["names"][i]
                    counts[name] = counts.get(name, 0) + 1
                # determine the recognized face with the largest number of
                # votes (note: in the event of an unlikely tie Python will
                # select first entry in the dictionary)
                name = max(counts, key=counts.get)
            # update the list of names
            names.append(name)
            if(names[0]!="Unknown"):
                user = client.objects.get(email=names[0])
                return JsonResponse({"user":model_to_dict(user)}, status=200)
            return JsonResponse({"message": "unknown"}, status=404)
        return JsonResponse({"message": "not an image of person"}, status=500)

        # # loop over the recognized faces
        # for ((top, right, bottom, left), name) in zip(boxes, names):
        #     # draw the predicted face name on the image
        #     cv2.rectangle(image, (left, top), (right, bottom), (0, 255, 0), 2)
        #     y = top - 15 if top - 15 > 15 else top + 15
        #     cv2.putText(image, name, (left, y), cv2.FONT_HERSHEY_SIMPLEX,
        #                 0.75, (0, 255, 0), 2)
        # # show the output image
        # cv2.imshow("image", image)
        # cv2.waitKey(0)


class ColorDescriptor:
    def __init__(self, bins):
        # store the number of bins for the 3D histogram
        self.bins = bins

    def describe(self, image):
        image = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        features = []
        (h, w) = image.shape[:2]
        (cX, cY) = (int(w * 0.5), int(h * 0.5))
        segments = [(0, cX, 0, cY), (cX, w, 0, cY), (cX, w, cY, h), (0, cX, cY, h)]
        (axesX, axesY) = (int(w * 0.75) // 2, int(h * 0.75) // 2)
        ellipMask = np.zeros(image.shape[:2], dtype="uint8")
        cv2.ellipse(ellipMask, (cX, cY), (axesX, axesY), 0, 0, 360, 255, -1)
        for (startX, endX, startY, endY) in segments:
            cornerMask = np.zeros(image.shape[:2], dtype="uint8")
            cv2.rectangle(cornerMask, (startX, startY), (endX, endY), 255, -1)
            cornerMask = cv2.subtract(cornerMask, ellipMask)
            hist = self.histogram(image, cornerMask)
            features.extend(hist)
        hist = self.histogram(image, ellipMask)
        features.extend(hist)
        return features

    def histogram(self, image, mask):

        hist = cv2.calcHist([image], [0, 1, 2], mask, self.bins, [0, 180, 0, 256, 0, 256])
        # normalize the histogram if we are using OpenCV 2.4
        if imutils.is_cv2():
            hist = cv2.normalize(hist).flatten()
        # otherwise handle for OpenCV 3+
        else:
            hist = cv2.normalize(hist, hist).flatten()
        # return the histogram
        return hist


class Searcher:
    def __init__(self, indexPath):
        self.indexPath = indexPath
    def search(self, queryFeatures, limit = 10):
        results = {}
        # open the index file for reading
        with open(self.indexPath) as f:
            # initialize the CSV reader
            reader = csv.reader(f)
            # loop over the rows in the index
            for row in reader:
                features = [float(x) for x in row[1:]]
                d = self.chi2_distance(features, queryFeatures)
                results[row[0]] = d
            f.close()
        results = sorted([(v, k) for (k, v) in results.items()])
        # return our (limited) results
        return results[:limit]
    def chi2_distance(self, histA, histB, eps = 1e-10):
        d = 0.5 * np.sum([((float(a) - float(b)) ** 2) / (float(a) + float(b) + eps) for (a, b) in zip(histA, histB)])
        return d


@csrf_exempt
def searchimage(request):
    if request.method=="POST":
        url = "https://southcentralus.api.cognitive.microsoft.com/customvision/v3.0/Prediction/bacf249f-dabd-49b7-bfc4-0a550ce20d36/detect/iterations/Iteration10/image"
        filestr = request.FILES['image'].read()
        headers = {'Prediction-Key': "706fa7352ab24ada8ffa319750e4f238",
                   'Content-Type': 'application/octet-stream'}
        response = requests.post(url, headers=headers, data=filestr)
        response=response.json()
        predictions=response['predictions']
        first_predict=predictions[0]
        tagname=first_predict['tagName']
        print(tagname)
        npimg = np.fromstring(filestr, np.uint8)
        query = cv2.imdecode(npimg, cv2.IMREAD_UNCHANGED)
        cd = ColorDescriptor((8, 12, 3))
        features = cd.describe(query)
        searcher = Searcher(settings.BASE_DIR+"/webapp/index.csv")
        results = searcher.search(features)
        pics=[]
        print(results)
        for x in results:
            if(os.path.exists(settings.BASE_DIR+'/Products/'+tagname+'/'+x[1])):
                pics.append(x[1])
        return JsonResponse({"message": pics}, status=200)


@csrf_exempt
def cardnumber(request):
    if request.method=="POST":
        ocr_url = "https://textanaylser.cognitiveservices.azure.com/vision/v2.1/read/core/asyncBatchAnalyze"
        filestr = request.FILES['image'].read()
        headers = {'Ocp-Apim-Subscription-Key': "3a7f9e778d2c4b898e3fe5228c86f3f1",'Content-Type': 'application/octet-stream'}
        params = {'language': 'unk', 'detectOrientation': 'true'}
        response = requests.post(ocr_url, headers=headers, data=filestr)
        response.raise_for_status()

        operation_url = response.headers["Operation-Location"]

        analysis = {}
        poll = True
        while (poll):
            response_final = requests.get(
                response.headers["Operation-Location"], headers=headers)
            analysis = response_final.json()
            time.sleep(3)
            if ("recognitionResults" in analysis):
                poll = False
            if ("status" in analysis and analysis['status'] == 'Failed'):
                poll = False
        polygons = []
        if ("recognitionResults" in analysis):
            # Extract the recognized text, with bounding boxes.
            polygons = [line["text"]
                        for line in analysis["recognitionResults"][0]["lines"]]
        print(polygons)
        for x in polygons:
            if (len(x)==19):
                number=x
    return JsonResponse({"cardnumber": number}, status=200)

