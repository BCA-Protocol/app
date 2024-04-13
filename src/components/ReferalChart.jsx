import React, { useEffect, useState } from "react";
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
              color: "#ffffff",
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
                colors: "#E0ABF3",
              },
            },
            axisBorder: {
              color: "#E0ABF3",
            },
            axisTicks: {
              color: "#E0ABF3",
            },
          },
          xaxis: {
            categories: userActivity.days,
            labels: {
              style: {
                colors: "#E0ABF3",
              },
            },
            axisBorder: {
              color: "#E0ABF3",
            },
            axisTicks: {
              color: "#E0ABF3",
            },
          },
        },
      });
    }
  }, [userActivity]); // Rerun this effect if userActivity changes

  return (
    <div className="bg-[#250C3D] border-purple-950 border rounded-xl">
      {chartData.series.length > 0 ? (
        <ReactApexCharts
          className="py-6 bg-[#250C3D] rounded-xl"
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
