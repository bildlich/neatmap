# Neatmap

## About this project

Geographical maps are a radical simplification of reality. By reducing the world to two dimensions and taking a bird's eye view a focus is placed on the location of objects. The map serves an index where geographical location is the defining criterion.

What happens if a map is no longer ordered by the location of the objects it represents but by other, far more arbitrary, criteria? With [Neatmap](http://bildlich.github.io/neatmap), we try explore this question. Neatmap is a web-based map that can be re-sorted. Initially it shows the city of Karlsruhe, but as you move the mouse from left to right on the screen, the objects on the map are sorted by type (for now buildings, construction sites, and parks) as well as size.

Geographical data was provided by OpenStreetMap. The challenges we faced included retrieving the right kind of data, converting it to an appropriate format, simplifying it to a degree where web browsers can handle it, and re-ordering large numbers of vector shapes.
On a technical note, OSM data was accessed through the Overpass API, converted from JSON to GeoJSON to TopoJSON and displayed as an SVG graphic using d3.js.

There are lots of ways this project can be continued. As a first step, we plan to automate the data sourcing, conversion and display to a point where it is easy to compare different cities with each other.

Neatmap was created by Simon Knebl and Matthias Gieselmann in a three-day workshop with Robert M. Ochshorn at HfG Karlsruhe in summer 2014.

[Fork the project on Github](https://github.com/bildlich/neatmap) or [try it in your browser](http://bildlich.github.io/neatmap).

## How to get GeoData

### Prerequisites

1. [osmtogeojson](https://github.com/tyrasd/osmtogeojson)
2. [topojson CLI](https://github.com/mbostock/topojson/wiki/Command-Line-Reference)

### A. With the shell script included in this Repo

1. Use [Overpass Turbo](http://overpass-turbo.eu/) to generate a Overpass query in Overpass-XML format. Save the query as a .overpass-query file e.g. 'buildings.overpass-query'

2. Make the script getTopoJson.sh executable

        $ chmod 755 ./getTopoJson.sh

3. Run 

        $ ./getTopoJson.sh buildings [topojson-options]

    `buildings` is just an example, it can be any token. This will look for the file 'buildings.overpass-query' and output the file 'buildings.topojson'

    `[topojson-options]` are optional parameters for the topojson CLI as listed [here](https://github.com/mbostock/topojson/wiki/Command-Line-Reference). You must put them in quotes.

    Note that execution can take a moment or two because Overpass may take a while to process the request.

    Examples:
        
        # This will look for buildings.overpass-query and generate buildings.topojson
        # It will also apply simplification
        $ ./getTopoJson.sh buildings "--simplify-proportion 0.8" 

        # This will look for parks.overpass-query and generate parks.topojson
        # It will also apply quantization.
        $ ./getTopoJson.sh parks "-q 1e5"

### B. Manually

1. Generate a Overpass query in as described above.

2. Run the following command to download OSM JSON:
        
        $ wget -O buildings.overpass-json --post-file="buildings.overpass-query"  "http://overpass-api.de/api/interpreter";

3. Run the following command to convert OSM JSON to GeoJSON
    
        $ osmtogeojson buildings.json > buildings.geojson

4. Run the following command to convert GeoJSON to TopoJSON
    
        $ topojson buildings.geojson > buildings.topojson
    
    You can pass additional parameters, e.g. `--simplify-proportion 0.8`
