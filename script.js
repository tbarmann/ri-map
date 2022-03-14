let electionDataURL = './us-pres-by-town.json'
let riURL = './ri.geojson';

let geojson;
let electionData;

var tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0)
  .style("padding", "5px");

let canvas = d3.select('#canvas')

let width = 1000;
let height = 1100;

 let mouseOver = function(d) {
    d3.select(this)
      .raise()
      .transition()
      // .duration(200)
      .style("opacity", .5)
      .style("stroke", "black")
      .style("stroke-width", "3");
    tooltip.transition()
      .duration(200)
      .style("opacity", .9);
    tooltip.html(d.properties.NAME);
  }

  let mouseMove = function(d) {
    tooltip
      .style("left", (d3.mouse(this)[0]) + "px")
      .style("top", (d3.mouse(this)[1]) + "px");
  }

  let mouseLeave = function(d) {
    d3.select(this)
      .transition()
      .duration(200)
      .style("opacity", 1)
      .style("stroke", "white")
      .style("stroke-width", "1");
    tooltip.transition()
      .duration(500)
      .style("opacity", 0);
  }


let drawMap = () => {
  // fitsize:
  // https://stackoverflow.com/questions/14492284/center-a-map-in-d3-given-a-geojson-object
  var projection = d3.geoMercator().fitSize([width, height], geojson);
  var geoGenerator = d3.geoPath()
  .projection(projection);

  canvas.selectAll('path')
    .data(geojson.features)
    .enter()
    .append('path')
    .attr('d', geoGenerator)
    .attr('class', 'city')
    .attr('test-data', function (d) {
      return d.properties.NAME;
    })
    .attr('fill', (d) => {
      var name = (d.properties.NAME).toLowerCase().replace(" ", "_");
      var townData = electionData[name];
      var winner = townData.contests[0].candidates[0];
      if (winner.party_code === "DEM") {
        return 'lightblue';
      }
      if (winner.party_code === "REP") {
        return '#cc0000';
      }
      return "gray";
    })
    .style('stroke', 'white')
    .on("mouseover", mouseOver)
    .on("mouseleave", mouseLeave)
    .on("mousemove", mouseMove);
}

d3.json(riURL).then((data, error) => {
  if (error) {
    console.log(error);
  } else {
    geojson = data;
    d3.json(electionDataURL).then((data, error) => {
      if (error) {
        console.log(error);
      } else {
        electionData = data;
        drawMap();
      }
    })
  }
})