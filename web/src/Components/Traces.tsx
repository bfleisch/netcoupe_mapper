// composant qui affiche traces des vols d'une année sur une carte

import { useEffect, useRef } from "react"
import {   useMap } from "react-leaflet"
import {  GeoJSON } from "react-leaflet"
import L from 'leaflet';
import { Feature, Geometry } from "geojson"
import { LeafletEvent } from "leaflet";


interface TracesProps  {
    data: any
}

export function Traces (props:TracesProps) {

    const map = useMap()
    const data = props.data
    var click_feature: Feature<Geometry, any>;

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

        
    function whenClicked(e: LeafletEvent)  {

        if (!e.target) return; 
        var feature = (e.target) as Feature

        map.fitBounds(e.target.getBounds());

        if (feature == click_feature) {
            click_feature.setStyle (traces_style);
        } else {
            if (click_feature) {
                click_feature.setStyle (traces_style);
            }
            feature.setStyle(traces_style_clicked); 
        }
        click_feature = feature
    }

    function onEachFeature(feature: Feature, layer: L.Layer) {
        layer.addEventListener ("click", whenClicked, feature)
    }



    return <GeoJSON 
        data={data}  
        ref ={geoJsonRef} key={Math.random()} 
        onEachFeature={onEachFeature}    
   />

}