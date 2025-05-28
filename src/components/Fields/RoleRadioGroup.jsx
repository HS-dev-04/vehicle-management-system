import { Form } from "react-bootstrap";

const RoleRadioGroup = ({ value, onChange }) => (
  <Form.Group className="mb-4">
    <Form.Label>Account Type</Form.Label>
    <div>
      <Form.Check
        inline
        label="Buyer"
        name="role"
        type="radio"
        id="buyer-role"
        value="buyer"
        checked={value === "buyer"}
        onChange={onChange}
        required
      />
      <Form.Check
        inline
        label="Renter"
        name="role"
        type="radio"
        id="renter-role"
        value="renter"
        checked={value === "renter"}
        onChange={onChange}
        required
      />
    </div>
  </Form.Group>
);

export default RoleRadioGroup;
