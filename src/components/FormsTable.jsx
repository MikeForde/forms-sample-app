import { useEffect, useState } from 'react';
import {
  Col, Container, Form, InputGroup, Row,
} from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { FaSearch } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { checkStringOrStringArrayConstainsSubstring } from '../utils/string-util';

const columns = [
  {
    id: 'namespace',
    name: 'Namespace',
    sortable: true,
    selector: (form) => form.namespace,
  },
  {
    id: 'name',
    name: 'Name',
    sortable: true,
    selector: (form) => form.name,
  },
  {
    id: 'displayName',
    name: 'Display name',
    sortable: true,
    selector: (form) => form.version.displayName,
  },
  {
    id: 'description',
    name: 'Description',
    sortable: true,
    selector: (form) => form.version.description,
  },
  {
    id: 'status',
    name: 'Status',
    sortable: true,
    selector: (form) => form.version.status,
  },
  {
    id: 'versionLabels',
    name: 'Version labels',
    sortable: true,
    format: (form) => form.version.versionLabels.join(', '),
    selector: (form) => form.version.versionLabels,
  },
  {
    id: 'created',
    name: 'Created',
    sortable: true,
    selector: (form) => (form.version.createTime ? (new Date(form.version.createTime)).toLocaleString() : ''),
  },
  {
    id: 'updated',
    name: 'Updated',
    sortable: true,
    selector: (form) => (form.version.createTime ? (new Date(form.version.updateTime)).toLocaleString() : ''),
  },
];

const customStyles = {
  headCells: {
    style: {
      fontSize: '16px',
    },
  },
  cells: {
    style: {
      fontSize: '16px',
    },
  },
};

function FormsTable({
  clearSelectedRow, forms, keyField, onFormSelect,
}) {
  const [data, setData] = useState([]);

  const checkRowMatchesFilter = (objectToCheck, substring) => columns.some(({ selector }) => {
    const check = checkStringOrStringArrayConstainsSubstring(selector(objectToCheck), substring);
    return check;
  });

  const onSearchInputChangeHandler = ({ target }) => {
    const filter = target.value;

    if (filter) {
      setData(
        forms.filter((form) => checkRowMatchesFilter(form, filter)),
      );
    } else {
      setData(forms);
    }
  };

  useEffect(() => {
    setData(forms);
  }, [forms]);

  return (
    <Container fluid>
      <Row>
        <Col md={3} className="pt-2">
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search"
              type="search"
              onChange={onSearchInputChangeHandler}
            />
          </InputGroup>
        </Col>
      </Row>
      <Row>
        <Col className="pt-2">
          <DataTable
            clearSelectedRows={clearSelectedRow}
            columns={columns}
            customStyles={customStyles}
            data={data}
            defaultSortFieldId="name"
            fixedHeader
            highlightOnHover
            keyField={keyField}
            noContextMenu
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[10, 20, 50, 100]}
            responsive
            selectableRows
            selectableRowsHighlight
            selectableRowsSingle
            striped
            onSelectedRowsChange={onFormSelect}
          />
        </Col>
      </Row>
    </Container>
  );
}

FormsTable.propTypes = {
  clearSelectedRow: PropTypes.bool,
  forms: PropTypes.arrayOf(PropTypes.shape({
    namespace: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    displayName: PropTypes.string,
    description: PropTypes.string,
    versionLabels: PropTypes.string,
  })).isRequired,
  keyField: PropTypes.string.isRequired,
  onFormSelect: PropTypes.func.isRequired,
};

export default FormsTable;
