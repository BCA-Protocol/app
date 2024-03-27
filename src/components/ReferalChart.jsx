import React, { useEffect, useState } from "react";
// import ReactApexCharts from "react-apexcharts";
import dynamic from "next/dynamic";
const ReactApexCharts = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const EarningsChart = ({ userActivity }) => {

  const [chartData, setChartData] = useState({
    series: [],
    options: {},
  });

  useEffect(() => {
    if (userActivity && userActivity.days && userActivity.days.length > 0) {
      setChartData({
        series: [
          {
            name: "Total",
            data: userActivity.totals,
            color: "#a21caf",
          },
          {
            name: "Referrals",
            data: userActivity.referrals,
            color: "#ffcc00",
          },
        ],
        options: {
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
            },
          },
          grid: {
            show: false,
          },
          legend: {
            labels: {
              colors: ["#a21caf", "#ffcc00"],
            },
          },
          yaxis: {
            labels: {
              style: {
                colors: "#a21caf",
              },
            },
            axisBorder: {
              color: "#a21caf",
            },
            axisTicks: {
              color: "#a21caf",
            },
          },
          xaxis: {
            categories: userActivity.days,
            labels: {
              style: {
                colors: "#a21caf",
              },
            },
            axisBorder: {
              color: "#a21caf",
            },
            axisTicks: {
              color: "#a21caf",
            },
          },
        },
      });
    }
  }, [userActivity]); // Rerun this effect if userActivity changes

  return (
    <div>
      {chartData.series.length > 0 ? (
        <ReactApexCharts
          className="py-6 bg-black rounded-xl"
          options={chartData.options}
          series={chartData.series}
          type="line"
          height={"350"}
          width={"100%"}
        />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default EarningsChart;