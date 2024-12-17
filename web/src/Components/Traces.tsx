// composant qui affiche traces des vols d'une année sur une carte

import { useEffect, useRef } from "react"
import {   useMap } from "react-leaflet"
import {  GeoJSON } from "react-leaflet"
import L from 'leaflet';


interface TracesProps  {
    data: any
}

export function Traces (props:TracesProps) {

    const map = useMap()
    const data = props.data
    const geoJsonRef = useRef<L.GeoJSON | null>(null)

    useEffect ( () => {
        if (! geoJsonRef.current || !map)
            return
        const geoJsonBounds = geoJsonRef.current.getBounds();
        
        if (!geoJsonBounds.isValid()) 
            return;

        map.fitBounds(geoJsonBounds);

    }, [data])


    var traces_style = {
        "color": "#050067",
    //    "color": "darkblue",
        "weight": 3,
        "opacity": 0.35
    };
    
    var traces_style_clicked = {
        "color": "red",
        "weight": 4,
        "opacity":1
    };

    let lastClickedLayer: L.Path | null = null;

    function onEachFeature(_: GeoJSON.Feature, layer: L.Layer) {
        layer.on ( 'click', () => {// Reset the last clicked layer to its default style

            if (layer instanceof L.Path){ 
                if (lastClickedLayer) {
                    lastClickedLayer.setStyle(traces_style);
                  }
      
                  // Apply the clicked style to the current feature
                  layer.setStyle(traces_style_clicked)
                  layer.bringToFront()
                  if (layer instanceof L.Polyline)
                    map.fitBounds(layer.getBounds());
      
                  // Update the last clicked layer reference
                  lastClickedLayer = layer              
            }
        })
    }

    return <GeoJSON 
        data={data}  
        ref ={geoJsonRef} key={Math.random()} 
        onEachFeature={onEachFeature}    
   />
}