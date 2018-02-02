import React, { Component } from 'react';

class ScheduleWizard extends Component {
  state = {}

  componentDidMount() {
    const { jQuery } = window;

    jQuery('#scheduleWizard').bootstrapWizard({
      onTabShow: function (tab, navigation, index) {
        var $total = navigation.find('li').length;
        var $current = index + 1;

        // If it's the last tab then hide the last button and show the finish instead
        if ($current >= $total) {
          jQuery('#scheduleWizard').find('.pager .next').hide();
          jQuery('#scheduleWizard').find('.pager .finish').show();
          jQuery('#scheduleWizard').find('.pager .finish').removeClass('disabled');
        } else {
          jQuery('#scheduleWizard').find('.pager .next').show();
          jQuery('#scheduleWizard').find('.pager .finish').hide();
        }
      }
    });
}

render() {
  return (
    <div id="scheduleWizard">
      <ul className="nav nav-tabs nav-tabs-linetriangle nav-tabs-separator">
        <li>
          <a data-toggle="tab" href="#tab1"><i className="far fa-clock tab-icon fa-2x"></i> <span>Date & Time</span></a>
        </li>
        <li>
          <a data-toggle="tab" href="#tab2"><i className="fas fa-info fa-2x tab-icon"></i> <span>Information</span></a>
        </li>
        <li>
          <a data-toggle="tab" href="#tab3"><i className="fab fa-ethereum fa-2x tab-icon"></i> <span>Bounty</span></a>
        </li>
        <li>
          <a data-toggle="tab" href="#tab4"><i className="fas fa-cloud-upload-alt fa-2x tab-icon"></i> <span>Confirm</span></a>
        </li>
      </ul>

      <div className="tab-content">
        <div className="tab-pane active slide" id="tab1">
          Day and time component here
        </div>
        <div className="tab-pane slide" id="tab2">
          Information component here
        </div>
        <div className="tab-pane slide" id="tab3">
          Bounty component here
        </div>
        <div className="tab-pane slide" id="tab4">
          Confirmation component here
        </div>

        <ul className="pager wizard no-style">
          <li className="next">
            <button className="btn btn-primary btn-cons pull-right" type="button">
              <span>Next</span>
            </button>
          </li>
          <li className="next finish" style={{display: 'none'}}>
            <button className="btn btn-primary btn-cons pull-right" type="button">
              <span>Schedule</span>
            </button>
          </li>
          <li className="previous first" style={{display: 'none'}}>
                <button className="btn btn-white btn-cons pull-right" type="button">
                    <span>First</span>
                </button>
            </li>
          <li className="previous">
            <button className="btn btn-white btn-cons pull-right" type="button">
              <span>Previous</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
}

export default ScheduleWizard;