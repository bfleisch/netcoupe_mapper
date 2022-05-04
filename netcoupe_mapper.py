# -*- coding: utf-8 -*-
"""
Created on Sun Dec 12 08:21:19 2021

@author: bruno
"""

import pandas as pd
import numpy as np

from datetime import datetime
from geojson import LineString, FeatureCollection
import re, base64, json
import glob



MAP_TEMPLATE_FILE='web/map.template.html'
MAP_FILE='web/map.html'
IGC_SAMPLE_FREQ ='30S'

# ----------------------------------------------------------



class IGC_file ():
    def __init__ (self, fname):
        self.load_igc_file (fname)
        
        
    def load_igc_file (self, fname):        
        log=[]
        file = open (fname,'r')        
        
        for line in file.readlines():
            if (line[0] !='B'):
                continue
        
            pattern= '^B(\d{6})(\d+)(\d{2})(\d{3})([NS])(\d+)(\d{2})(\d{3})([WE])'
            m =re.search (pattern, line)
            if (m):
                lat_multiplier = -1 if m[5]=='S' else 1
                long_multiplier = -1 if m[9]=='W' else 1
                
                time, lat, long = datetime.strptime( m.group(1), '%H%M%S'), \
                   float (int(m[2]) + int (m[3])/60 + int (m[4])/60000) * lat_multiplier, \
                   float (int(m[6]) + int (m[7])/60 + int (m[8])/60000) * long_multiplier    
                   
                log.append([time, lat,long])
                                                                                        
        self.logs = pd.DataFrame (log, columns=['time','lat','long'])
        self.logs = self.logs.resample (IGC_SAMPLE_FREQ, on='time').mean()
        return self
    
    
    def _haversine_distance (self, lat1, lat2, lon1, lon2):
        R =  6373.0
        dlon = np.radians(lon2) - np.radians(lon1)
        dlat = np.radians(lat2) - np.radians(lat1)
        a = np.sin(dlat / 2)**2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlon / 2)**2
        c = 2 * np.arctan2(np.sqrt(a), np.sqrt(1 - a))
        return R*c
    
    
    def filter (self, min_distance=None, max_distance=None):
        
        log_shifted = self.logs.shift(1)
        distance = self._haversine_distance (self.logs['lat'][:-1],
                                         log_shifted['lat'][1:],
                                         self.logs['long'][:-1],
                                         log_shifted['long'][1:])
        
        self.logs = self.logs[(distance > min_distance) & (distance < max_distance)]
        
    
#----------------


def parse_igc_files(root_dir):
  
    features=[]
    
    for file in glob.glob (root_dir+'/**/*.igc', recursive=True):
        print (file)
        igc = IGC_file (file)
        igc.filter (min_distance = .02, max_distance=10)
        tr = LineString ( zip(igc.logs['long'], igc.logs['lat']))
        features.append (tr)
  
    feature_collection = FeatureCollection(features)
    return feature_collection

 
#%%

import sys,os

def main(argv):
    
    if len (argv) < 2:
        print ("Usage: {} DOSSIER_IGC ".format(argv[0]))
        return 0
    
    root_dir = argv[1]
    
    if not os.path.exists (root_dir):
        print ("le dossier '{}' n'existe pas".format(root_dir))
        return 1
        
    feature_collection  = parse_igc_files (argv[1])
    
    if len(feature_collection.features) < 1:
        print ("Aucune trace trouvée.")
        return 1
    
    with open (MAP_TEMPLATE_FILE,'r') as f:
        template_html = ''.join(f.readlines())
        
        
    html_content = re.sub ('##GEOJSON##', base64.b64encode(
            json.dumps (feature_collection).encode('utf-8')).decode('utf-8'), template_html)
    
    
    with open (MAP_FILE, 'w') as f:
        f.write (html_content)
        f.close()
    
    print ("Fichier '{}' crée.".format(MAP_FILE))
    return 0
    
if __name__ == "__main__":
   main(sys.argv)