import React, { useState } from "react";
// import ReactApexCharts from "react-apexcharts";
import dynamic from "next/dynamic";
const ReactApexCharts = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const ApexChart = () => {
  const [chartData, setChartData] = useState({
    series: [
      {
        name: "Total",
        data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
      },
      {
        name: "Referrals",
        data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
      }
    ],
    options: {
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      title: {
        text: 'Earnings',
        align: 'left'
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      }
    },
  });


  return (
    <div>
      <div id="chart">
        {/* {typeof window !== "undefined" && ( */}
        <ReactApexCharts
          className="px-2 py-6 bg-gradient-to-l from-purple-900 to-black border-borderprimary rounded-xl"
          options={chartData.options}
          series={chartData.series}
          type="line"
          height={"350"}
          width={"100%"}
        />
        {/* )} */}
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default ApexChart;
