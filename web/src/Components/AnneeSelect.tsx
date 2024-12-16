
import { TraceItemInterface } from "../types/TraceItems";



export function AnneeSelect (props: any) {
    
    const traces =  props.traces as TraceItemInterface[]
    const curValue = props.current
    
    const trace_items = traces.map ( (item) => <option value={item.annee} key={item.annee}>{item.annee}</option>)

    function onChange(event: any) {
        var annee = event.target.value;
        var item = traces.find ( (item)=> item.annee == annee)
        props.onChange (item)
    }

    
    return (
        <form>
            <label>Choississez une année</label>
            <select onChange={onChange}  value={curValue?.annee}> {trace_items} </select>
        </form>
    );

}