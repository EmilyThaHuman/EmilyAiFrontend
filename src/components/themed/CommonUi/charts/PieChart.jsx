import React from 'react';
import ReactApexChart from 'react-apexcharts';

export class PieChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chartData: props.chartData || [],
      chartOptions: props.chartOptions || {},
    };
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.chartData !== this.props.chartData ||
      prevProps.chartOptions !== this.props.chartOptions
    ) {
      this.setState({
        chartData: this.props.chartData || [],
        chartOptions: this.props.chartOptions || {},
      });
    }
  }

  render() {
    return (
      <ReactApexChart
        options={this.state.chartOptions}
        series={this.state.chartData}
        type="pie"
        width="100%"
        height="55%"
      />
    );
  }
}

export default PieChart;
