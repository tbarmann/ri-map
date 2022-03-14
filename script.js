let electionDataURL = './us-pres-by-town.json'
let riURL = './ri.geojson';

let geojson;
let electionData;

var tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

let canvas = d3.select('#canvas')

var projection = d3.geoTransverseMercator()
  .scale(70000)
  .translate([500, 1150])
  .rotate([71 + 30 / 60, -41 - 5 / 60]);

var geoGenerator = d3.geoPath()
  .projection(projection);

let drawMap = () => {
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
    .on("mouseover", function (d) {
      tooltip.transition()
        .duration(200)
        .style("opacity", .9);
      tooltip.html(d.properties.NAME)
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", function (d) {
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    });
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