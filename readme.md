Geographical maps are a radical simplification of reality. By reducing the world to two dimensions and taking a bird's eye view a focus is placed on the location of objects. The map serves an index where geographical location is the defining criterion.

What happens if a map is no longer ordered by the location of the objects it represents but by other, far more arbitrary, criteria? With "Neatmap", we try to answer this notion. We created a web-based map that can be re-sorted. Initially it shows the city of Karlsruhe, but as you move the mouse from left to right on the screen, the objects on the map are sorted by type (for now buildings, construction sites, and parks) as well as size.

Geographical data is provided by OpenStreetMap. Challenges included retrieving the right kind of data, converting it to an appropriate format, simplifying it to a degree where web browsers can handle it, and re-ordering large numbers of vector shapes.

As a technical note, OSM data was accessed through the Overpass API, the data was converted from  and accessed through its Overpass API, converted from JSON to GeoJSON to TopoJSON and displayed as an SVG graphic using d3.js.

There are lots of ways this project can be continued. As a first step, we plan to automate the data sourcing, conversion and display to a point where it is easy to compare different cities with each other.

[Fork the project on Github](https://github.com/bildlich/neatmap) or try it live at (Simon, can you add the link to the test site here?)