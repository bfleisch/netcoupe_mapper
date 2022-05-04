
# Netcoupe mapper


Create an interactive map with traces from multiple IGC files  


## Installation

Install all required librairies

```pip -r requirements.txt```

## Usage

1. Put all IGC files into a single directory 

2. Run `python netcoupe_mapper.py <IGC_DIRECTORY>`

3. The script creates the map in the HTML file `web/map.html`


## Customization

You can customize the template file `web/map.template.thml` to match your needs or use a different tiles server (by default it uses OSM services).


