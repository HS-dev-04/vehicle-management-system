const CarForm = ({ carData, onChange, onSubmit, loading = false, showRoleSelector = false }) => {
  return (
    <form onSubmit={onSubmit}>
      {[
        { label: "Car Name", name: "name" },
        { label: "Type", name: "type" },
        { label: "Model", name: "model" },
        { label: "Mile", name: "mile" },
        { label: "Fuel Type", name: "fuelType", placeholder: "e.g. Gasoline" },
        { label: "Transmission", name: "transmission", placeholder: "e.g. Automatic" },
        { label: "Doors", name: "doors" },
        { label: "Price per Hour", name: "oneHourPrice", type: "number" },
        { label: "Price per 24 Hours", name: "twentyFourHourPrice", type: "number" },
      ].map(({ label, name, type = "text", placeholder }) => (
        <div className="mb-3" key={name}>
          <label className="form-label">{label}</label>
          <input
            type={type}
            className="form-control"
            name={name}
            placeholder={placeholder || `Enter ${label.toLowerCase()}`}
            value={carData[name]}
            onChange={onChange}
            required
          />
        </div>
      ))}

      {showRoleSelector && (
        <div className="mb-4">
          <label className="form-label">Type of Car</label>
          <div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="role"
                id="buyer-role"
                value="buyer"
                checked={carData.role === "buyer"}
                onChange={onChange}
                required
              />
              <label className="form-check-label" htmlFor="buyer-role">
                Buyer
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="role"
                id="renter-role"
                value="renter"
                checked={carData.role === "renter"}
                onChange={onChange}
                required
              />
              <label className="form-check-label" htmlFor="renter-role">
                Renter
              </label>
            </div>
          </div>
        </div>
      )}

      <button type="submit" className="btn btn-primary w-100" disabled={loading}>
        {loading ? "Posting..." : "Post Car"}
      </button>
    </form>
  );
};

export default CarForm;
