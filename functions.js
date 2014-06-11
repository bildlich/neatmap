var jsonPathGreen = "green.topo.json";
var jsonPathBuildings = "buildings.topo.json";
//var jsonPath = "leisure-park.topo.json";

var transitionDuration = 1000; // ms
var gridGapX = 4;

var m_width = $("#map").width(),
    width = 938,
    height = 500,
    country,
    state;

var projection = d3.geo
    .mercator()
    .scale(400000)
    .center([8.404393,49.013669])
    .translate([width/2, height/2]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#map").append("svg")
    .attr("preserveAspectRatio", "xMidYMid")
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("width", m_width)
    .attr("height", m_width * height / width);

var g = svg.append("g");

function parse_path(pathstr) {
  //eg. pathstr is: d="M446.0252875413753,312.49818797687476L445.8401871266942,312.63011114730034L444.8529849150691,313.2017767016805L445.038085329752,313.5095955941215L444.4210839474854,313.94933562872757L443.9274828416728,314.3451004122908L443.31048145940986,314.5649692258012L443.187081182954,314.7848376745533L442.7551802153703,314.6529166490509L441.9530784184244,314.5649692258012L441.70627786551813,314.5649692258012L441.5211774508389,314.5649692258012L441.45947731261367,314.5649692258012L439.4233727511364,314.3451004122908L439.4233727511364,314.03728346053686L439.2999724746878,314.03728346053686L438.49787067774196,313.64151775767095L439.17657219823195,311.88254477846203L438.559570815969,311.5747221066995L436.89366708385387,310.8271497840906L435.351163628191,310.03559802244126L435.412863766418,309.94764753484924L435.1043630752865,309.81572169395804L434.9192626606073,310.4313744942774L434.734162245928,310.2554739860643L434.5490618312451,309.9036722691526L434.1171608636614,309.5078942212858L434.0554607254344,309.33199248723395L433.87036031075513,309.20006603354705L433.93206044898216,308.8922371307126L434.0554607254344,308.58440751282615L434.1171608636614,308.49645606207196L433.6852598960759,308.3645287765539L432.57465740799853,308.10067381137924L431.7725556110563,307.88079427249613L431.1555542287897,307.6609143687092L430.97045381411044,307.48501018306706L430.72365326120416,307.2651296225813L430.4768527082997,306.9572962249222L430.1066518789412,306.34162728454976L429.9215514642601,306.0337917416473L429.67475091135384,305.5940254399029L429.4896504966746,305.3301649583882L430.72365326120416,305.81390877321246L430.97045381411044,305.81390877321246L431.1555542287897,304.9783501657221L431.52575505815,305.0223270658753L431.40235478169416,305.5940254399029L433.6852598960759,306.561509377294L434.734162245928,307.1332011112099L434.672462107701,307.3530818905856L436.40006597804313,307.96874613179534L436.27666570158726,308.18862552481005L436.89366708385387,308.49645606207196L437.6340687425727,308.8042858842382L437.51066846611684,309.02416389086284L439.6084731658193,310.12354845163645L441.02757634502814,310.7391998218518L442.3849793860081,311.1789490494266L443.8040825652206,311.3548483319173L444.8529849150691,311.3548483319173L446.7656892000887,311.2668987198849L446.95078961477157,311.2668987198849L446.95078961477157,311.3548483319173L447.1358900294508,311.48677264049184L446.7039890618653,311.5747221066995L445.65508671201496,311.662671514423L444.6061843621628,311.662671514423L444.6061843621628,312.01446856169787L444.97638519152497,312.01446856169787L445.53168643556273,312.1024176776118L446.33378823250496,311.9704939818912L446.33378823250496,311.88254477846203L446.88908947654454,311.7945955165487L446.88908947654454,311.88254477846203L446.88908947654454,311.9704939818912Z"
  //returns Array with objects [{CMD, X, Y}]
  var cmdregex = /([MLZ])([\d.]+),([\d.]+)/g; ///[MLZ]/g;
  var vals = pathstr.split(cmdregex);
  var val;
  var pathArray = [];
  for (var i=0; i<vals.length; i++) {
    val = vals[i];
    if (val === "M" || val === "L") {
      pathArray.push({
        CMD: val,
        X: parseInt(vals[i+1]),
        Y: parseInt(vals[i+2])
      });
    }
    else if (val === "Z") {
      pathArray.push({
        CMD: "Z"
      });
    }
  }
  return pathArray;
}

function find_topleft(path) {
  // takes results of parse_path, and returns topleft coordinates
  // of the path's bounding rectangle as a list, [X, Y]
  var minX = path[0].X;
  var minY = path[0].Y;
  for (var i=1; i < path.length; i++) {
    if (path[i].X != null) {
        minX = Math.min(path[i].X, minX);
        minY = Math.min(path[i].Y, minY);
    }
  }
  return [minX, minY];
}

function apply_translation(path, topleft, newPos) {
  // calculate the vector between the old and new position.
  // then apply the vector to every point on the path.
  // (assumes path is in absolute coordinates)
  // return new path
  var vector = [newPos[0] - topleft[0], newPos[1] - topleft[1]];
  for (var i=0; i < path.length; i++) {
    path[i].X += vector[0];
    path[i].Y += vector[1];
  }
  return path;
}

function generate_translatecode(topleft, newPos){
  // return the SVG string to specify a translation to topleft coords
  var vector = [newPos[0] - topleft[0], newPos[1] - topleft[1]];
  return "translate("+vector[0]+","+vector[1]+")";  
}

function path_to_svgcode(path){
  // takes a path in the form of parse_path and returns a string suitable
  // for SVG
  var string = "";
  for (var i=0; i < path.length; i++) {
    string += path[i].CMD;
    if (path[i].X != null) {
      string += path[i].X.toString() + "," + path[i].Y.toString();
    }
  }
}

drawOneKindOfElement = function(jsonPath, className) {
  d3.json(jsonPath, function(error, us) {
    var geometries = topojson.feature(us, us.objects.geojson);
      g.selectAll("path")
        .data(geometries.features)
      .enter()
      .append("path")
      .attr("id", function(d) { return d.id; })
      .attr("class", className)
      .attr("d", function(d) {
        var transpath = path(d);
        return transpath;
      })
  });
}

/* Order items in grid */
arrangeItems = function(event) {
  var pathStr, pathArray, topLeft, translateCode, newX=0;
  var items = g.selectAll('path');
  items.each(function(item,index) {
    path = d3.select(this);
    pathStr = path.attr('d');
    pathArray = parse_path(pathStr);
    topLeft = find_topleft(pathArray);
    translateCode = generate_translatecode(topLeft, [newX,100]);
    path
      //.transition()
      //.duration(transitionDuration)
      .attr('transform', translateCode);
    newX += this.getBBox().width + gridGapX;
  });
};

/* Move items back to their original position */
itemsBackToOrigin = function(event) {
  var items = g.selectAll('path');
  items.each(function(item,index) {
    path = d3.select(this);
    path
      .transition()
      .duration(transitionDuration)
      .attr('transform', 'translate(0,0)');
  });
};

/* Draw the map */
drawOneKindOfElement(jsonPathBuildings, "buildings");

/* Bind user events */
$('a#order').on('click', arrangeItems);
$('a#disorder').on('click', itemsBackToOrigin);