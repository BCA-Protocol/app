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
          // {
          //   name: "Referrals",
          //   data: userActivity.referrals,
          //   color: "#ffcc00",
          // },
        ],
        options: {
          chart: {
            height: 350,
            type: "bar",
            zoom: {
              enabled: false,
            },
          },
          plotOptions: {
            bar: {
              borderRadius: 8,
              dataLabels: {
                position: 'top', // top, center, bottom
              },
              columnWidth: '30%'
            }
          },  
          dataLabels: {
            enabled: true,
            offsetY: -30,
            style: {
              fontSize: '12px',
            }
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
          fill: {
            type: 'gradient',
            gradient: {
              shade: "#dd09c4",
              type: "vertical",
              // shadeIntensity: -1.8,
              colorFrom: '#DD09C4',
              colorTo: '#621CBA',
              inverseColors: false,
              colorStops: [
              {
                offset: 0,
                color: "#DD09C4",
              },
              {
                offset: 50,
                color: "#621CBA",
              }
            ],
              stops: [0, 100,100,100,100]
            }
          },
          yaxis: {
            labels: {
              // style: {
              //   colors: "#E0ABF3",
              // },
              show: false
            },
            axisBorder: {
              // color: "#E0ABF3",
              show: false
            },
            axisTicks: {
              // color: "#E0ABF3",
              show: false
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
              // color: "#E0ABF3",
              show: false
            },
            axisTicks: {
              // color: "#E0ABF3",
              show: false
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
          type="bar"
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
