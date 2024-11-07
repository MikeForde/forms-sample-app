import { Button, ButtonGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';

function ToolbarButtonGroup({ buttons }) {
  return (
    <ButtonGroup>
      {
        buttons
          .filter((button) => button.visible !== false)
          .map((button) => (
            <Button
              key={button.label}
              disabled={button.disabled}
              onClick={button.onClick}
            >
              {button.label}
            </Button>
          ))
      }
    </ButtonGroup>
  );
}

ToolbarButtonGroup.propTypes = {
  buttons: PropTypes.arrayOf(PropTypes.shape({
    disabled: PropTypes.bool,
    label: PropTypes.string.isRequired,
    visible: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
  })).isRequired,
};

export default ToolbarButtonGroup;
