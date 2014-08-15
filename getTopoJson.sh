#!/bin/sh
# Download Geodata from OSM Overpass and convert it to TopoJSON
echo "Starting…"

# Download OSM JSON
wget -O $1".overpass-json" --post-file=$1".overpass-query"  "http://overpass-api.de/api/interpreter"

# Convert OSM JSON to GeoJSON
osmtogeojson $1".overpass-json" > $1".geojson"
rm $1".overpass-json"

# Convert GeoJSON to TopoJSON
# Simplificatino of 0.8 worked well for Karlsruhe buildings
topojson $1".geojson" > $1".topojson" $2
rm $1".geojson"

echo "Done."