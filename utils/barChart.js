// Declare the chart dimensions and margins.
const w = 1000;
const h = 600;
const marginTop = 30;
const marginRight = 0;
const marginBottom = 30;
const marginLeft = 40;

document.addEventListener("DOMContentLoaded", function () {
  fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
  )
    .then((response) => response.json())
    .then((data) => {
      const dataset = data.data;
      loadChart(dataset);
    });

  let loadChart = function (dataset) {
    const xScale = d3
      .scaleTime()
      .domain([
        d3.min(dataset, (d) => new Date(d[0])),
        d3.max(dataset, (d) => new Date(d[0])),
      ])
      .range([marginLeft, w - marginRight]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataset, (d) => d[1])])
      .range([h - marginBottom, marginTop]);
    //Tool-tip scratch
    d3.select("body")
      .append("div")
      .attr("class", "tool-tip")
      .attr("id", "tooltip");
    const svg = d3
      .select("body")
      .append("svg")
      .attr("width", w)
      .attr("height", h);
    svg
      .selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("fill", "steelblue")
      .attr("class", "bar")
      .attr("data-date", (d) => d[0])
      .attr("data-gdp", (d) => d[1])
      .attr("x", (d) => {
        return xScale(new Date(d[0]));
      })
      .attr("y", (d, i) => {
        return yScale(d[1]) - marginBottom;
      })
      .attr("width", w / dataset.length)
      .attr("height", (d, i) => h - yScale(d[1]))
      .on("mouseover", (d, i) => {
        d3.select("#tooltip").transition().duration(200).style("opacity", 0.9);
        d3.select("#tooltip")
          .html(`${d[1]} Billion`)
          .attr("data-date", d[0])
          .style("color", "red");
      })
      .on("mouseout", (d, i) => {
        d3.select("#tooltip").transition().duration(200).style("opacity", 0);
      })
      .append("title")
      .text((d) => `$ ${d[1]} Billion \n ${d[0]}`);

    svg
      .append("g")
      .attr("transform", `translate(0,${h - marginBottom})`)
      .attr("id", "x-axis")
      .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y")));

    // Add the y-axis.
    svg
      .append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .attr("id", "y-axis")
      .call(d3.axisLeft(yScale))

      .call((g) =>
        g
          .append("text")
          .attr("x", marginLeft)
          .attr("y", h / 5)
          .attr("fill", "currentColor")
          .attr("font-size", "16px")
          .attr("text-anchor", "start")
          .attr("writing-mode", "vertical-rl")
          .text("Gross Domestic Product")
      );
  };
});
