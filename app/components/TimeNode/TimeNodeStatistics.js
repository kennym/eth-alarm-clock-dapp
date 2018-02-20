import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { TIMENODE_STATUS } from '../../stores/TimeNodeStore';
import { Chart } from 'chart.js';

@inject('timeNodeStore')
@observer
class TimeNodeStatistics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeNodeDisabled: TIMENODE_STATUS.DISABLED ? true : false
    };

    this.startTimeNode = this.startTimeNode.bind(this);
    this.stopTimeNode = this.stopTimeNode.bind(this);
  }

  async componentWillMount() {
    await this.props.timeNodeStore.getBalance();
    await this.props.timeNodeStore.getDAYBalance();
    this.props.timeNodeStore.getStats();
    this.setState({
      timeNodeDisabled: this.props.timeNodeStore.nodeStatus === TIMENODE_STATUS.DISABLED ? true : false,
      fetchedClaimed: true
    });

    this.generateChart(this.props.timeNodeStore.executedCounters);
  }

  generateChart(data) {
    const ctx = this.chartRef.getContext('2d');

    if (data.length > 0) {
      const labels = Array(data.length).fill('');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor:'rgba(33, 255, 255, 0.2)',
            borderColor: 'rgba(33, 255, 255, 1)',
            borderWidth: 2
          }]
        },
        options: {
          elements: {
            line: {
              tension: 0
            }
          },
          legend: {
            display: false
          },
          scales: {
            yAxes: [{
              display: false
            }],
            xAxes: [{
              display: false
            }],
          }
        }
      });
    } else {
      ctx.font = "20px Helvetica";
      ctx.textAlign="center";
      ctx.fillText("No data yet.",150,65);
    }

  }

  getStopButton() {
    return <button className="btn btn-danger" onClick={this.stopTimeNode} disabled={this.state.timeNodeDisabled}>Stop</button>;
  }

  getStartButton() {
    return <button className="btn btn-primary" onClick={this.startTimeNode} disabled={this.state.timeNodeDisabled}>Start</button>;
  }

  startTimeNode() {
    this.props.timeNodeStore.startScanning();
  }

  stopTimeNode() {
    this.props.timeNodeStore.stopScanning();
  }

  render() {
    let timeNodeStatus = null;
    if (this.state.timeNodeDisabled) {
      timeNodeStatus = TIMENODE_STATUS.DISABLED;
    } else {
      timeNodeStatus = this.props.timeNodeStore.scanningStarted ? 'running' : 'stopped';
    }

    const dayTokenError = <div className="alert alert-danger" role="alert">
      <button className="close" data-dismiss="alert"></button>
      <strong>Error: </strong>Your DAY token balance is too low. Please make sure you have at least 333 DAY tokens.
    </div>;

    return (
      <div id="timeNodeStatistics">
        {!this.state.timeNodeDisabled ? dayTokenError : null}

        <h2 className="py-4">
          Your TimeNode is currently {timeNodeStatus}.
          <span className="ml-2">{this.props.timeNodeStore.scanningStarted ? this.getStopButton() : this.getStartButton()}</span>
        </h2>

        <div className="row">

          <div className="col-md-3">
            <div data-pages="card" className="card card-default">
              <div className="card-header">
                <div className="card-title">Bounty</div>
                <div className="card-controls">
                  <ul>
                    <li>
                      <a data-toggle="refresh" className="card-refresh" href="#"><i className="card-icon card-icon-refresh"></i></a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="card-body">
                <h1>{this.state.fetchedClaimed ? this.props.timeNodeStore.claimedEth + " ETH" : "Loading... "}</h1>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div data-pages="card" className="card card-default">
              <div className="card-header">
                <div className="card-title">Executed</div>
                <div className="card-controls">
                  <ul>
                    <li>
                      <a data-toggle="refresh" className="card-refresh" href="#"><i className="card-icon card-icon-refresh"></i></a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="card-body no-padding">
                <canvas id="myChart" ref={(el) => this.chartRef = el}></canvas>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div data-pages="card" className="card card-default">
              <div className="card-header">
                <div className="card-title">Balance</div>
                <div className="card-controls">
                  <ul>
                    <li>
                      <a data-toggle="refresh" className="card-refresh" href="#"><i className="card-icon card-icon-refresh"></i></a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">ETH</div>
                  <div className="col-md-6">{this.props.timeNodeStore.balanceETH}</div>
                </div>
                <hr className="mt-2 mb-2"/>
                <div className="row">
                  <div className="col-md-6">DAY</div>
                  <div className="col-md-6">{this.props.timeNodeStore.balanceDAY}</div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    );
  }
}

TimeNodeStatistics.propTypes = {
  timeNodeStore: PropTypes.any
};

export default TimeNodeStatistics;
