import { Form } from 'react-bootstrap';

const Email = ({ label, placeholder, name, value, onChange }) => {
    return (
        <Form.Group className="mb-3">
            <Form.Label>{label}</Form.Label>
            <Form.Control
                type="email"
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required
                className="custom_Form"
            />
        </Form.Group>
    );
};

export default Email;
