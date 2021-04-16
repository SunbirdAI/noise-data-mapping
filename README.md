Leaflet map  for putting noise data points on a map.
### Features
* Data is in tabular delimited-text (csv, etc.) with two required columns: `lat` and `lng`
* Points are plotted on full-screen 
* Point markers are clustered dynamically based on zoom level.
* Clicking on a point cluster will zoom into the extent of the underlying features.
* Hovering on the point will display the name. 
* Clicking will display a popup with columns/properties displayed as an html table.
* Full text filtering with typeahead
* Completely client-side javascript with all dependencies included or linked via CDN

### Usage
Download, add your own data csv, copy the `config.js.template` to `config.js`, edit it according to your needs, then load index.html in a browser.



