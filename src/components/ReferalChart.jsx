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
        color: "#a21caf"
      },
      {
        name: "Referrals",
        data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
        color: "#ffcc00"
      },
    ],
    options: {
      background: "#000",
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "Earnings",
        align: "left",
        style: {
          color: "#a21caf",
        }
      },
      grid: {
        show: false
      },
      legend: {
        labels: {
          colors: ['#a21caf', '#ffcc00']
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#a21caf'
          }
        },
        axisBorder: {
          color: '#a21caf'
        },
        axisTicks: {
          color: '#a21caf'
        },
      },
      xaxis: {
        labels: {
          style: {
            colors: '#a21caf'
          }
        },
        axisBorder: {
          color: '#a21caf'
        },
        axisTicks: {
          color: '#a21caf'
        },
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
        ],
      },
    },
  });

  return (
    <div>
      <div id="chart">
        {/* {typeof window !== "undefined" && ( */}
        <ReactApexCharts
          className="py-6 bg-black rounded-xl"
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
