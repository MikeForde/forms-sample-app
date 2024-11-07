import {
  forwardRef, useContext, useImperativeHandle, useState,
} from 'react';
import { Table } from 'react-bootstrap';
import { FORM_RUNTIME_ELEMENT_ID } from './FormRuntime';
import AppContext from '../store/context/app-context';

function ValidationErrors(_, ref) {
  const { formClient } = useContext(AppContext);
  const [problems, setProblems] = useState([]);

  useImperativeHandle(ref, () => ({
    validateFormData: async () => {
      const formDataInfo = await formClient.getFormData({ htmlElementId: FORM_RUNTIME_ELEMENT_ID });
      setProblems(formDataInfo.problems);
    },
  }));

  return (
    <Table>
      <thead>
        <tr>
          <th>#</th>
          <th>Field</th>
          <th>Validation Error</th>
        </tr>
      </thead>
      <tbody>
        { problems.map(
          (problem, index) => (
            <tr key={`${problem.propertyPath}-${problem.message}`}>
              <td>{index + 1}</td>
              <td>{problem.propertyPath.slice(1)}</td>
              <td>{`${problem.messagePrefix} ${problem.message}`}</td>
            </tr>
          ),
        )}
      </tbody>
    </Table>
  );
}

export default forwardRef(ValidationErrors);
