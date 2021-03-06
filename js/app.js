
var basemap = new L.TileLayer(baseUrl, {maxZoom: 17, attribution: baseAttribution, subdomains: subdomains, opacity: opacity});

//var center = new L.LatLng(0.3320, 32.5706);//Uganda cordinates on the world map
var center = new L.LatLng(1.06, 31.88);
var newCenter=center;

var map = new L.Map('map', {center: center, zoom: 2, maxZoom: maxZoom, layers: [basemap]});

var districtName=["x","Aber","Mbarara","Kampala","Soroti","Lira","Masindi","Mahagi","Arua","Jinja",
"FortPortal","Kasese","Moyo","Nebbi","Serere","Mpigi","Masaka","Kumi","Kisoro","Pallisa","Bushenyi","Kabale","Kitgum"];

var districtLat=[0,2.12,0.61,0.20,1.43,2.17,1.40,2.09,3.01,0.25,0.40,0.13,3.6527,
2.4409,1.4994,0.2274,0.3267,1.4856,1.2209,1.1707,0.4871,1.2420,3.2885];

var districtLng=[0,32.25,30.65,32.30,33.35,32.57,31.43,31.243,30.58,33.12,30.20,30.03,31.7281,31.3542,
33.5490,32.3249,31.7537,33.9332,29.6499,33.7099,30.2051,29.9856,32.8789];



var popupOpts = {
    autoPanPadding: new L.Point(5, 50),
    autoPan: true
};

var points = L.geoCsv (null, {
    firstLineTitles: true,
    fieldSeparator: fieldSeparator,
    onEachFeature: function (feature, layer) {
        var popup = '<div class="popup-content"><table class="table table-striped table-bordered table-condensed">';
        for (var clave in feature.properties) {
            var title = points.getPropertyTitle(clave).strip();
            var attr = feature.properties[clave];
            if (title == labelColumn) {
                layer.bindLabel(feature.properties[clave], {className: 'map-label'});
            }
            if (attr.indexOf('http') === 0) {
               // attr = '<a target="_blank" href="' + attr + '">'+ attr + '</a>';
               attr = '<img src="'+ attr + '" >';

            }
            if (attr) {
                popup += '<tr><th>'+title+'</th><td>'+ attr +'</td></tr>';
            }
        }
        popup += "</table></popup-content>";
        layer.bindPopup(popup, popupOpts);
    },
    filter: function(feature, layer) {
        total += 1;
        if (!filterString) {
            hits += 1;
            return true;
        }
        var hit = false;
        var lowerFilterString = filterString.toLowerCase().strip();
        $.each(feature.properties, function(k, v) {
            var value = v.toLowerCase();
            if (value.indexOf(lowerFilterString) !== -1) {
                hit = true;
                hits += 1;
                return false;
            }
        });
        return hit;
    }
});

var hits = 0;
var total = 0;
var filterString;
var markers = new L.MarkerClusterGroup();
var dataCsv;

var addCsvMarkers = function() {
    hits = 0;
    total = 0;
    filterString = document.getElementById('filter-string').value;

    if (filterString) {
        //alert("Yes");
        $("#clear").fadeIn();
        var searchIndex=districtName.indexOf(filterString);
        if(searchIndex>0)
        {
            newCenter=new L.LatLng(districtLat[searchIndex],districtLng[searchIndex]);
            map.setView(newCenter,10);

        }else
        {
            populateMap();
            //populateMap(markers,clusterOptions,points,dataCsv);
        }
        //check 
    } else {
        //alert("NO");
        $("#clear").fadeOut();
        populateMap();

    }

    /*map.removeLayer(markers);
    points.clearLayers();

    markers = new L.MarkerClusterGroup(clusterOptions);
    points.addData(dataCsv);
    markers.addLayer(points);

    map.addLayer(markers);*/
    try {
        var bounds = markers.getBounds();
        if (bounds) {
            map.fitBounds(bounds);
        }
    } catch(err) {
        // pass
    }
    if (total > 0) {
        $('#search-results').html("Showing " + hits + " of " + total);
    }
    return false;
};

var typeAheadSource = [];

function ArrayToSet(a) {
    var temp = {};
    for (var i = 0; i < a.length; i++)
        temp[a[i]] = true;
    var r = [];
    for (var k in temp)
        r.push(k);
    return r;
}

 function populateMap()
 {
    map.removeLayer(markers);
    points.clearLayers();

    markers = new L.MarkerClusterGroup(clusterOptions);
    points.addData(dataCsv);
    markers.addLayer(points);

    map.addLayer(markers);
 }

 
function populateTypeAhead(csv, delimiter) {
    var lines = csv.split("\n");
    for (var i = lines.length - 1; i >= 1; i--) {
        var items = lines[i].split(delimiter);
        for (var j = items.length - 1; j >= 0; j--) {
            var item = items[j].strip();
            item = item.replace(/"/g,'');
            if (item.indexOf("http") !== 0 && isNaN(parseFloat(item))) {
                typeAheadSource.push(item);
                var words = item.split(/\W+/);
                for (var k = words.length - 1; k >= 0; k--) {
                    typeAheadSource.push(words[k]);
                }
            }
        }
    }
}

if(typeof(String.prototype.strip) === "undefined") {
    String.prototype.strip = function() {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}

map.addLayer(markers);

$(document).ready( function() {
    $.ajax ({
        type:'GET',
        dataType:'text',
        url: dataUrl,
        contentType: "text/csv; charset=utf-8",
        error: function() {
            alert('Error retrieving csv file');
            
        },
        success: function(csv) {
            dataCsv = csv;
            populateTypeAhead(csv, fieldSeparator);
            typeAheadSource = ArrayToSet(typeAheadSource);
            $('#filter-string').typeahead({source: typeAheadSource,limit:20});
            addCsvMarkers();
        }
    });

    $("#clear").click(function(evt){
        evt.preventDefault();
        $("#filter-string").val("").focus();
        addCsvMarkers();
    });

});
