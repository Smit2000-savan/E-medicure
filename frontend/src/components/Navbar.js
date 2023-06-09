import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({
  userData,
  updateUserData,
  updateShopList,
  shopId,
  updateShopId,
}) => {
  const navigate = useNavigate();

  const LogOut = async () => {
    let data;
    let response = await fetch(
      `${process.env.REACT_APP_API_URL}auth/refresh/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: userData.refresh }),
      }
    ).catch((e) => console.log(e));
    if (response.status === 200) {
      data = await response.json();
      console.log(data);
      updateUserData(userData.user, data.refresh, data.access);
    } else {
      alert(response.statusText);
    }
    const token = data.access;

    response = await fetch(`${process.env.REACT_APP_API_URL}auth/logout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ refresh: data.refresh }),
    }).catch((e) => console.log(e));
    if (response.status === 200) {
      data = await response.json();
      console.log(data);
      updateUserData(null, "", "");
      updateShopList(null);
      updateShopId(0);
      navigate("/");
    } else {
      alert(response.statusText);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top mask-custom shadow-0 mb-5">
      <div className="container">
        <a className="navbar-brand" href="/">
          <span style={{ color: "#5e9693" }}>EMedi</span>
          <span style={{ color: "#fff" }}>Cure</span>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto">
            {userData && userData.user ? (
              <>
                <li className="nav-item text-center">
                  <a className="nav-link" id="dashboard" href="/dashboard">
                    Dashboard
                  </a>
                </li>
                {shopId ? (
                  <>
                    <li className="nav-item text-center">
                      <a className="nav-link" href={`/inventory/${shopId}`}>
                        Inventory
                      </a>
                    </li>
                    <li className="nav-item text-center">
                      <a className="nav-link" href={`/billing/${shopId}`}>
                        Billing
                      </a>
                    </li>
                    <li className="nav-item text-center">
                      <a className="nav-link" href={`/stock/${shopId}`}>
                        New Stock
                      </a>
                    </li>
                    <li className="nav-item text-center">
                      <a className="nav-link" href={`/alerts/${shopId}`}>
                        Alerts
                      </a>
                    </li>
                    <li className="nav-item text-center">
                      <a className="nav-link" href={`/staffMember/${shopId}`}>
                        Staff Member
                      </a>
                    </li>
                    <li className="nav-item text-center">
                      <a className="nav-link" href={`/report/${shopId}`}>
                        Charts
                      </a>
                    </li>
                  </>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <></>
            )}
          </ul>

          {userData && userData.user ? (
            <ul className="navbar-nav d-flex flex-row justify-content-center">
              <div className="navigation">
                <button
                  className="btt btn btn-sm bg-transparent"
                  onClick={LogOut}
                >
                  <i className="bi bi-power"></i>

                  <div className="logout">LOGOUT</div>
                </button>
              </div>
              {/* </li>
              <li className="btn btn-danger me-3" onClick={LogOut}>
                <span className="nav-link">Log Out</span>
              </li> */}
              <li
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <a href="/profile">
                  <img
                    className="profileIcon"
                    src={
                      `${process.env.REACT_APP_API_URL}` +
                      userData.user.profile.profilePhoto
                    }
                    alt="profilePhoto"
                  />
                </a>
              </li>
            </ul>
          ) : (
            <>
              <ul className="navbar-nav d-flex flex-row">
                <li
                  className="btn btn-primary me-3"
                  style={{ backgroundColor: "#5e9693", border: "none" }}
                >
                  <a
                    className="nav-link"
                    href="/login-register"
                    style={{ color: "#fff" }}
                  >
                    <i className="bi bi-bag-plus-fill"></i> Welcome!
                  </a>
                </li>
              </ul>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
