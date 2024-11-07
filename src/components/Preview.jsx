import './Preview.css';

import { useContext, useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import SplitPane, { Pane } from 'split-pane-react';
import AppContext from '../store/context/app-context';

const PREVIEW_ELEMENT_ID = 'preview';

function Preview() {
  const {
    activeForm,
    formClient,
  } = useContext(AppContext);
  const [sizes, setSizes] = useState(['260px', 'auto', '260px']);

  useEffect(() => {
    formClient.renderForm(
      {
        localReference: activeForm,
        htmlElementId: PREVIEW_ELEMENT_ID,
        useFormLocale: true,
      },
    );
  }, [activeForm, formClient]);

  return (
    <Container fluid>
      <Row>
        <Col className="preview-peripheral-area preview-top-margin" />
      </Row>
      <Row>
        <Col className="split-pane-container p-0">
          <SplitPane
            split="vertical"
            sizes={sizes}
            onChange={setSizes}
          >
            <Pane minSize={50} maxSize="50%">
              <div className="preview-peripheral-area preview-left-pane" />
            </Pane>
            <div id={PREVIEW_ELEMENT_ID} className="preview" />
            <Pane minSize={50} maxSize="50%">
              <div className="preview-peripheral-area preview-right-pane" />
            </Pane>
          </SplitPane>
        </Col>
      </Row>
    </Container>
  );
}

export default Preview;
