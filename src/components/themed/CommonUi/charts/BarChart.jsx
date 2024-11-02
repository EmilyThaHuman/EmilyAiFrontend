import React, { Component } from 'react';
import Chart from 'react-apexcharts';

export class ColumnChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: props.chartData || [{ name: 'Series 1', data: [] }],
      chartOptions: props.chartOptions || {},
    };
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.chartData !== this.props.chartData ||
      prevProps.chartOptions !== this.props.chartOptions
    ) {
      this.setState({
        chartData: this.props.chartData || [{ name: 'Series 1', data: [] }],
        chartOptions: this.props.chartOptions || {},
      });
    }
  }

  render() {
    return (
      <Chart
        options={this.state.chartOptions}
        series={this.state.chartData}
        type="bar"
        width="100%"
        height="100%"
      />
    );
  }
}

export default ColumnChart;
