
    const traces = [
      { label: '2021', value: 'traces_2021.json' },
      { label: '2022', value: 'traces_2022.json' }
    ];


    var curr_trace;

    class AnneeSelect extends React.Component {
      
        constructor(props) {
            super(props);
            this.trace_items =  traces.map( (trace, index)  => <option key={trace.value} value={trace.value}>{trace.label}</option>);
            this.state = {
                "curr_trace":  curr_trace
            }
        };

        handleChange = event => {
            var trace = event.target.value;
            charge_trace(trace);
            this.setState ({"curr_trace": trace});
        }

        render() {
            return (
                <form>
                    <label className="choix_annee_label">Choississez une année</label>
                    <select onChange={this.handleChange} value={this.state.curr_trace} > {this.trace_items} </select>
                </form>
           );
        }
    }
    
    
    const e = React.createElement;
    const domContainer = document.querySelector('#choix_annee_container');
    const root = ReactDOM.createRoot(domContainer);
    const composant = e(AnneeSelect);
    root.render(composant);
    
    
    
    var DEV=true
     
    var map = L.map('map') 
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
    
    
    var tilelayer=undefined
    
    if (DEV==false) {
    
        tilelayer =  L.tileLayer('https://tile.jawg.io/jawg-terrain/{z}/{x}/{y}.png?access-token={accessToken}', {
        attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: 0,
        maxZoom: 22,
        subdomains: 'abcd',
        accessToken: 'RiHOgP3XYTh4KO3DtLriOxUKJ0bYSAro7sY8RDOwR7QrJVx6Fc89vVVMCZYols6J' });
    } else
    { 
        tilelayer = L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: ['a','b','c']});
    }
    
    
    tilelayer.addTo(map)
    
    var clicked_layer = undefined
    
    function whenClicked(e) {
      map.fitBounds(e.target.getBounds());
      var layer = e.target;
      if (layer.red !==undefined & layer.red==true) {
          layer.setStyle(traces_style);
          layer.red = false
      } else {
          if (clicked_layer !==undefined) { 
              clicked_layer.setStyle (traces_style);
              clicked_layer.red=false;
          } 
          layer.setStyle(traces_style_clicked); 
          layer.red=true
      }
      
      clicked_layer = layer
    
    }
    
    
    function onEachFeature(feature, layer) {
        layer.on({
            click: whenClicked
        });
    }

    function charge_trace (file) {
        $.getJSON(file, function(data){
            
               if (dataLayer!==undefined ) {
                    map.removeLayer (dataLayer)
               }

               dataLayer = L.geoJson(data, {
                   style: traces_style,
                   onEachFeature: onEachFeature
               });
               
               map.addLayer(dataLayer)
               //dataLayer.addTo(map)
               map.fitBounds( dataLayer.getBounds())
             }
           );
    }
    
    
    var curr_trace = traces.slice(-1)[0].value;
    var dataLayer = undefined;
    charge_trace ( curr_trace);