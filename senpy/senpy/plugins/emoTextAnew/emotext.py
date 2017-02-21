# -*- coding: utf-8 -*-

import re
import nltk
import csv
import logging
import sys
import os
import unicodedata
import string
import xml.etree.ElementTree as ET
import math

from sklearn.svm import LinearSVC
from sklearn.feature_extraction import DictVectorizer

from nltk import bigrams
from nltk import trigrams
from nltk.corpus import WordNetCorpusReader
from nltk.corpus import stopwords

from pattern.en import parse as parse_en
from pattern.es import parse as parse_es
from senpy.plugins import SentimentPlugin, SenpyPlugin
from senpy.models import Response, EmotionSet, Entry, Emotion


logger = logging.getLogger(__name__)

class EmotionTextPlugin(SentimentPlugin):
    
    def __init__(self, info, *args, **kwargs):
        super(EmotionTextPlugin, self).__init__(info, *args, **kwargs)
        self.id = info['module']
        self.info = info
        self.stopwords = stopwords.words('english')
        self.local_path=os.getcwd()
        self.anew_path_es=info['anew_path_es']
        self.anew_path_en=info['anew_path_en']
        self.centroids={'anger':{'V':2.70,'A':6.95,'D':5.10},'joy':{'V':8.60,'A':7.22,'D':6.28},'fear':{'V':3.20,'A':6.50,'D':360}
          ,'sadness':{'V':2.21,'A':5.21,'D':2.82},'disgust':{'V':2.70,'A':5.3,'D':8.05}}
        self.emotions_ontology={'anger':'http://gsi.dit.upm.es/ontologies/wnaffect/ns#anger','joy':'http://gsi.dit.upm.es/ontologies/wnaffect/ns#joy',
        'fear':'http://gsi.dit.upm.es/ontologies/wnaffect/ns#negative-fear','sadness':'http://gsi.dit.upm.es/ontologies/wnaffect/ns#sadness','disgust':'http://gsi.dit.upm.es/ontologies/wnaffect/ns#disgust',
        'neutral':'http://gsi.dit.upm.es/ontologies/wnaffect/ns#neutral-emotion'}

    def activate(self, *args, **kwargs):

        logger.info("EmoText plugin is ready to go!")

    def deactivate(self, *args, **kwargs):

        logger.info("EmoText plugin is being deactivated...")

    def _my_preprocessor(self, text):

        regHttp = re.compile('(http://)[a-zA-Z0-9]*.[a-zA-Z0-9/]*(.[a-zA-Z0-9]*)?')
        regHttps = re.compile('(https://)[a-zA-Z0-9]*.[a-zA-Z0-9/]*(.[a-zA-Z0-9]*)?')
        regAt = re.compile('@([a-zA-Z0-9]*[*_/&%#@$]*)*[a-zA-Z0-9]*')
        text = re.sub(regHttp, '', text)
        text = re.sub(regAt, '', text)
        text = re.sub('RT : ', '', text)
        text = re.sub(regHttps, '', text)
        text = re.sub('[0-9]', '', text)
        text = self._delete_punctuation(text)
        return text

    def _delete_punctuation(self, text):

        exclude = set(string.punctuation)
        s = ''.join(ch for ch in text if ch not in exclude)
        return s

    def _extract_ngrams(self, text, lang):

        unigrams_lemmas = []
        pos_tagged = []
        if lang == 'es':
            sentences = parse_es(text,lemmata=True).split()
        else:
            sentences = parse_en(text,lemmata=True).split()

        for sentence in sentences:
            for token in sentence:
                if token[0].lower() not in self.stopwords:
                    unigrams_lemmas.append(token[4])  
                    pos_tagged.append(token[1])        

        return unigrams_lemmas,pos_tagged

    def _find_ngrams(self, input_list, n):
        return zip(*[input_list[i:] for i in range(n)])

    def _emotion_calculate(self, VAD):
        emotion=''
        value=10000000000000000000000.0
        for state in self.centroids:
            valence=VAD[0]-self.centroids[state]['V']
            arousal=VAD[1]-self.centroids[state]['A']
            dominance=VAD[2]-self.centroids[state]['D']
            new_value=math.sqrt((valence*valence)+(arousal*arousal)+(dominance*dominance))
            if new_value < value:
                value=new_value
                emotion=state
        return emotion
    
    def _extract_features(self, tweet,dictionary,lang):
        feature_set={}
        ngrams_lemmas,pos_tagged = self._extract_ngrams(tweet,lang)
        pos_tags={'NN':'NN', 'NNS':'NN', 'JJ':'JJ', 'JJR':'JJ', 'JJS':'JJ', 'RB':'RB', 'RBR':'RB',
         'RBS':'RB', 'VB':'VB', 'VBD':'VB', 'VGB':'VB', 'VBN':'VB', 'VBP':'VB', 'VBZ':'VB'}
        totalVAD=[0,0,0]
        matches=0
        for word in ngrams_lemmas:
            VAD=[]
            if word in dictionary:
                matches+=1
                totalVAD = [totalVAD[0]+float(dictionary[word]['V']),
                            totalVAD[1]+float(dictionary[word]['A']),totalVAD[2]+float(dictionary[word]['D'])]
        if matches==0:
            emotion='neutral'
        else:
            totalVAD=[totalVAD[0]/matches,totalVAD[1]/matches,totalVAD[2]/matches]
            emotion=self._emotion_calculate(totalVAD)
        feature_set['emotion']=emotion
        feature_set['V']=totalVAD[0]
        feature_set['A']=totalVAD[1]
        feature_set['D']=totalVAD[2]
        return feature_set

    def analyse(self, **params):

        logger.debug("Analysing with params {}".format(params))

        text_input = params.get("input", None)

        text=self._my_preprocessor(text_input)
        dictionary={}
        lang = params.get("language", "auto")
        if lang == 'es':
            with open(self.local_path+self.anew_path_es,'rb') as tabfile:
                reader = csv.reader(tabfile, delimiter='\t')
                for row in reader:
                    dictionary[row[2]]={}
                    dictionary[row[2]]['V']=row[4]
                    dictionary[row[2]]['A']=row[6]
                    dictionary[row[2]]['D']=row[8]
        else:
            with open(self.local_path+self.anew_path_en,'rb') as tabfile:
                reader = csv.reader(tabfile, delimiter='\t')
                for row in reader:
                    dictionary[row[0]]={}
                    dictionary[row[0]]['V']=row[2]
                    dictionary[row[0]]['A']=row[4]
                    dictionary[row[0]]['D']=row[6]

        feature_set=self._extract_features(text,dictionary,lang)

        p = params.get("prefix", None)
        response = Response(prefix=p)

        entry = Entry(id="Entry",
                  text=text_input,
                  prefix=p)
        emotions = EmotionSet(id="Emotions0")
        emotion1 = Emotion(id="Emotion0")
        
        emotion1["onyx:hasEmotionCategory"] = self.emotions_ontology[feature_set['emotion']]
        emotion1["http://www.gsi.dit.upm.es/ontologies/onyx/vocabularies/anew/ns#valence"] = feature_set['V']
        emotion1["http://www.gsi.dit.upm.es/ontologies/onyx/vocabularies/anew/ns#arousal"] = feature_set['A']
        emotion1["http://www.gsi.dit.upm.es/ontologies/onyx/vocabularies/anew/ns#dominance"] = feature_set['D']

        emotions.emotions.append(emotion1)


        entry.emotionSets.append(emotions)
        entry.language = lang
        response.entries.append(entry)
        return response
