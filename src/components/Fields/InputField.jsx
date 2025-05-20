import { Form } from "react-bootstrap";

const InputField = ({
  label,
  type,
  name,
  value,
  onChange,
  required = true,
}) => (
  <Form.Group className="mb-1">
    <Form.Label>{label}</Form.Label>
    <Form.Control
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
    />
  </Form.Group>
);

export default InputField;
