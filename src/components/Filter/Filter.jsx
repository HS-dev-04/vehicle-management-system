import { FaSearch, FaFilter, FaCalendarAlt } from "react-icons/fa";

const Filters = ({
  filters,
  roleFilter,
  setFilters,
  setRoleFilter,
  userRole,
}) => {
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="card mb-5 border-0 shadow-lg">
      <div className="card-header bg-success text-white py-3">
        <h5 className="mb-0 d-flex align-items-center">
          <FaFilter className="me-2" />
          Filter Options
        </h5>
      </div>
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label fw-bold d-flex align-items-center">
              <FaSearch className="me-2 d-flex" />
              Search by Name
            </label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="e.g. Toyota"
              value={filters.name}
              onChange={handleFilterChange}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-bold d-flex align-items-center">
              <FaCalendarAlt className="me-2" />
              Search by Model
            </label>
            <input
              type="text"
              name="model"
              className="form-control"
              placeholder="e.g. 2020"
              value={filters.model}
              onChange={handleFilterChange}
            />
          </div>
          {userRole !== "renter" && (
            <div className="col-md-4">
              <label className="form-label fw-bold">Filter by Role</label>
              <div className="d-flex gap-3 flex-wrap">
                {["", "buyer", "renter"].map((role) => (
                  <div className="form-check" key={role || "all"}>
                    <input
                      type="radio"
                      id={role || "all"}
                      name="roleFilter"
                      className="form-check-input"
                      value={role}
                      checked={roleFilter === role}
                      onChange={(e) => setRoleFilter(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor={role || "all"}>
                      {role === ""
                        ? "All"
                        : role.charAt(0).toUpperCase() + role.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filters;
