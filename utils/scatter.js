// Declare the chart dimensions and margins.
const w = 928;
const h = 600;
const marginTop = 25;
const marginRight = 20;
const marginBottom = 35;
const marginLeft = 40;

//Fetch API
document.addEventListener("DOMContentLoaded", function () {
  fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
  )
    .then((response) => response.json())
    .then((data) => {
      const dataset = data;
      loadChart(dataset);
    });

  //make function
  let loadChart = function (dataset) {
    const specifierYear = "%Y";
    const specifier = "%M:%S";
    const getParsedDataMinute = (dataset, specifier) => {
      return dataset.map((d) => {
        return d3.timeParse(specifier)(d.Time);
      });
    };
    const getParsedDataYearMin = (dataset, specifier) => {
      return dataset.map((d) => {
        return d3.timeParse(specifier)(d.Year - 1);
      });
    };
    const getParsedDataYearMax = (dataset, specifier) => {
      return dataset.map((d) => {
        return d3.timeParse(specifier)(d.Year + 1);
      });
    };
    //Transform dataset.Time "35:40" to validate Date
    const parsedData = getParsedDataMinute(dataset, specifier);
    const parsedDataMin = getParsedDataYearMin(dataset, specifierYear);
    const parsedDataMax = getParsedDataYearMax(dataset, specifierYear);

    console.log(d3.min(parsedData));
    //xScale: Year so need count year + 1 when put in new Date
    const xScale = d3
      .scaleTime()
      .domain([d3.min(parsedDataMin), d3.max(parsedDataMax)])
      .range([marginLeft, w - marginRight]);

    //yScale
    const yScale = d3
      .scaleTime()
      .domain([d3.max(parsedData), d3.min(parsedData)])
      .range([h - marginBottom, marginTop])
      .nice();
    // //Tooltip
    const getTooltip = () => {
      return d3
        .select("body")
        .append("div")
        .attr("id", "tooltip")
        .style("opacity", 0);
    };
    const getCustomLegend = () => {
      return d3
        .select("body")
        .append("div")
        .attr("id", "legend")
        .attr("height", 100)
        .attr("width", 100)
        .attr("fill", "red")
        .style("right", `200px`)
        .attr("font-size", "16px")
        .style("top", `300px`).html(`<div style="display:flex;font-size:13px;">
                   <div style="background-color:#5790C2;width:20px;height:20px;">
                   </div>
                   <div style="padding-left:10px;">Riders with doping allegations</div>
                  </div>
                  <div style="display:flex;padding-top:5px;font-size:13px;">
                   <div style="background-color:#FC813F;width:20px;height:20px;">
                   </div>
                   <div style="padding-left:10px;">No doping allegations</div>
                  </div>`);
    };
    let tooltip = getTooltip();
    let legend = getCustomLegend();

    //Make SVG and Rect
    const svg = d3
      .select("body")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    svg
      .selectAll("circle")
      .data(dataset)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d, i) => {
        return xScale(d3.timeParse(specifierYear)(d.Year));
      })
      .attr("cy", (d) => {
        return yScale(d3.timeParse(specifier)(d.Time));
      })
      .attr("r", 5)
      .attr("data-xvalue", (d) => d.Year)
      .attr("data-yvalue", (d, i) =>
        d3.timeParse(specifier)(d.Time).toISOString()
      )
      .attr("fill", (d, i) => {
        if (d.Doping) {
          return "#5790C2";
        }
        return "#FC813F";
      })
      .on("mouseover", (d, i) => {
        tooltip
          .style("opacity", 1)
          .attr("data-year", d.Year)
          .html(
            `${d.Name}: ${d.Nationality}<br>
                                  Year: ${d.Year} Time: ${d.Time}<br></br>${d.Doping}`
          )
          .style(
            "left",
            `${50 + xScale(d3.timeParse(specifierYear)(d.Year))}px`
          )
          .style("top", `${yScale(d3.timeParse(specifier)(d.Time))}px`);
      })
      .on("mouseout", (d, i) => {
        tooltip.style("opacity", 0);
      });

    svg
      .append("g")
      .attr("transform", `translate(0,${h - marginBottom})`)
      .attr("id", "y-axis")
      .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y")));

    // Add the y-axis.
    svg
      .append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S")))
      .attr("id", "x-axis")
      .call((g) =>
        g
          .append("text")
          .attr("x", 10)
          .attr("y", h / 5)
          .attr("fill", "currentColor")
          .attr("font-size", "16px")
          .attr("text-anchor", "start")
          .attr("writing-mode", "vertical-rl")
          .text("Time in Minutes")
      );
  };
});
