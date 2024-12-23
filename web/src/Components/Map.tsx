import { MapContainer, TileLayer} from 'react-leaflet'
import { TraceItemInterface } from '../types/TraceItems'
import type { LatLngTuple } from 'leaflet'
import { AnneeSelect } from './AnneeSelect'
import { useEffect, useState } from 'react'
import { Traces } from './Traces'

export function Map() {

    const [traceItems, setTraceItems] =  useState<TraceItemInterface[]>([])
    const [ curTraceItem, setCurTraceItem] = useState<TraceItemInterface>()
    const position: LatLngTuple = [45.6556928,4.9049444,17] // CVVL à CORBAS! 
    const [traces, setTraces] = useState<TraceItemInterface> ()

    const API_ROOT = import.meta.env.DEV ? "http://localhost:8080/" : ""

    const fetchList :  () => Promise<TraceItemInterface[]> = async function () {
        var r = await fetch (API_ROOT + "list.php")
        if (r.ok) 
            return (await r.json()) as TraceItemInterface[]
        console.log (r.statusText)
        return []
    }

    const getTrace : (item:TraceItemInterface ) =>  Promise<any> = async function (item) {
        var r = await fetch (API_ROOT + "get.php?filename=" + item.filename)
        if (r.ok)
            return await r.json();
        console.log (r)
    }

    // (re)chargement des listes des traces

    useEffect ( ()=> {    
        fetchList()
        .then ( (traceItems) =>  {
            setTraceItems(traceItems)

            // se positionne sur la dernière année
            let lastItem = traceItems.reduce ( (max, item)=> item.annee > max?.annee ? item: max, traceItems[0])
            setCurTraceItem(lastItem)
        })

    }, [])

    // chargement d'une trace selectionnée
    useEffect ( () => {
        if (!curTraceItem) return;
        getTrace (curTraceItem)
        .then ((tr) => {
            setTraces (tr)
        })
    }, [curTraceItem])

    function onChangeAnnee (item:TraceItemInterface ) {
        setCurTraceItem (item)
    }

    return (<>        <MapContainer center={position} zoom={6} scrollWheelZoom={true}>
            <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <Traces data={traces}/>
    </MapContainer>
    <div className='select-annee'>
    <AnneeSelect traces={traceItems} current={curTraceItem} onChange={onChangeAnnee}/>
</div>
</>


    )
}