import './RuntimeFormInfo.css';

import { forwardRef, useEffect } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import PropTypes from 'prop-types';
import FormData from './FormData';
import ValidationErrors from './ValidationErrors';
import MissingFields from './MissingFields';

export const runtimeFormInfoTabs = {
  formData: 'formData',
  validationErrors: 'validationErrors',
  missingFields: 'missingFields',
};

const RuntimeFormInfo = forwardRef(({ activeTab, onTabSelect }, ref) => {
  useEffect(() => {
    onTabSelect(activeTab);
  }, [activeTab, onTabSelect]);

  return (
    <Tabs activeKey={activeTab} onSelect={(key) => onTabSelect(key)}>
      <Tab
        eventKey={runtimeFormInfoTabs.formData}
        title="Form Data"
        className="runtime-form-info-tab"
      >
        <FormData />
      </Tab>
      <Tab
        eventKey={runtimeFormInfoTabs.validationErrors}
        title="Validation Errors"
        className="runtime-form-info-tab"
      >
        <ValidationErrors ref={ref} />
      </Tab>
      <Tab
        eventKey={runtimeFormInfoTabs.missingFields}
        title="Missing Fields"
        className="runtime-form-info-tab"
      >
        <MissingFields />
      </Tab>
    </Tabs>
  );
});

RuntimeFormInfo.displayName = 'RuntimeFormInfo';

RuntimeFormInfo.propTypes = {
  activeTab: PropTypes.oneOf(Object.values(runtimeFormInfoTabs)).isRequired,
  onTabSelect: PropTypes.func.isRequired,
};

export default RuntimeFormInfo;
