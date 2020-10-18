import React, { useRef, useEffect, useState } from 'react';
import Chart from 'chart.js';
import styled from 'styled-components';
var backgroundColor = 'white';
Chart.plugins.register({
    beforeDraw: function(c) {
        var ctx = c.chart.ctx;
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, c.chart.width, c.chart.height);
    }
});

const Wrapper = styled.canvas`
  margin: 20px 0;
`;

function Graph({ data }) {
  const chartRef = useRef();
  const dataset = data.slice(0, 10);
  useEffect(() => {
    if (data.length != 0) {
      const myChartRef = chartRef.current.getContext('2d');
      const labels = dataset.map((item) => item[0]);
      const data = dataset.map((item) => item[1]);
      const bgColor = dataset.map(dynamicColors);

      new Chart(myChartRef, {
        type: 'horizontalBar',
        data: {
          //Bring in data
          labels,
          datasets: [
            {
              label: '키워드',
              backgroundColor: bgColor,
              data,
            },
          ],
        },
        options: {
          scales: {
            xAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
          legend: {
            display: false,
          },
        },
      });
    }
  }, []);

  return (
    <>
      <Wrapper ref={chartRef} id="graph" >{}</Wrapper>
    </>
  );
}

function dynamicColors() {
  var r = Math.floor(Math.random() * 255);
  var g = Math.floor(Math.random() * 255);
  var b = Math.floor(Math.random() * 255);
  return 'rgba(' + r + ',' + g + ',' + b + ', 0.5)';
}

export default Graph;
