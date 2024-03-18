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
        name: "Network Earnings",
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
      },
      {
        name: "Referrals",
        data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
      },
      {
        name: "Rank Achievements",
        data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
      },
      {
        name: "Referral Bonus",
        data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: [
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
        ],
      },
      yaxis: {
        title: {
          text: "$ (thousands)",
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "$ " + val + " thousands";
          },
        },
      },
    },
  });

  return (
    <div>
      <div id="chart">
        {/* {typeof window !== "undefined" && ( */}
        <ReactApexCharts
          className="bg-bgprim"
          options={chartData.options}
          series={chartData.series}
          type="bar"
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
