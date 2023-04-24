import React, { useState, useEffect } from "react";
import "./Profile.css";
import { useNavigate } from "react-router-dom";

const Profile = ({ userData, updateUserData }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [mobile, setMobile] = useState("");
  const [initialMobile, setInitialMobile] = useState("");

  const LoadData = () => {
    setEmail(userData.user.email);
    setFirstname(userData.user.first_name);
    setLastname(userData.user.last_name);
    setMobile(userData.user.profile.mobileNo);
    setInitialMobile(userData.user.profile.mobileNo);
  };

  const IsChanged = () => {
    document.getElementById("saveButton").disabled = false;
    if (firstname !== userData.user.first_name) return;
    if (lastname !== userData.user.last_name) return;
    if (email !== userData.user.email) return;
    if (mobile !== userData.user.profile.mobileNo) return;
    document.getElementById("saveButton").disabled = false;
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    const response1 = await fetch(
      `http://127.0.0.1:8000/auth/user/${userData.user.id}`,
      {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.access}`,
        },
        body: JSON.stringify({
          email: email,
          first_name: firstname,
          last_name: lastname,
          profile: {
            id: userData.user.profile.id,
          },
        }),
      }
    ).catch((e) => console.log(e));
    let data = await response1.json();
    //console.log(data);
    if (response1.status === 200) {
      updateUserData(
        {
          ...userData.user,
          first_name: firstname,
          last_name: lastname,
          email: email,
        },
        userData.refresh,
        userData.access
      );
    }
    if (data.email && response1.status !== 200) {
      document.getElementById("emailError").innerHTML = "*" + data.email[0];
      console.log("email error");
    } else {
      document.getElementById("emailError").innerHTML = "";
    }
    if (initialMobile !== mobile) {
      const response2 = await fetch(
        `http://127.0.0.1:8000/auth/user/${userData.user.id}`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.access}`,
          },
          body: JSON.stringify({
            profile: {
              id: userData.user.profile.id,
              mobileNo: mobile,
            },
          }),
        }
      ).catch((e) => console.log(e));
      let data = await response2.json();
      //console.log(data);
      if (response2.status === 200) {
        updateUserData(
          {
            ...userData.user,
            profile: {
              mobileNo: mobile,
            },
          },
          userData.refresh,
          userData.access
        );
      }
      if (data.profile && response2.status !== 200) {
        document.getElementById("mobileError").innerHTML =
          "*" + data.profile.mobileNo[0];
        console.log("mobile error");
      } else {
        document.getElementById("mobileError").innerHTML = "";
      }
      if (response1.status === 200 && response2.status === 200) {
        document.getElementById("Profileupdated").innerHTML =
          "Profile updated successfully";
      } else {
        document.getElementById("Profileupdated").innerHTML = "";
      }
    } else {
      document.getElementById("mobileError").innerHTML = "";
      if (response1.status === 200) {
        document.getElementById("Profileupdated").innerHTML =
          "Profile updated successfully";
      } else {
        document.getElementById("Profileupdated").innerHTML = "";
      }
    }
  };

  useEffect(() => {
    if (userData === null || userData.user === null) {
      console.log("navigating");
      navigate("/login");
      return;
    }
  }, []);

  return (
    <div className="container rounded bg-white mt-5 mb-5" onLoad={LoadData}>
      {userData && userData.user ? (
        <div className="row">
          <div className="col-md-3 border-right">
            <div className="d-flex flex-column align-items-center text-center p-3 py-5">
              <img
                className="rounded-circle mt-5"
                width="150px"
                src={
                  "http://127.0.0.1:8000" + userData.user.profile.profilePhoto
                }
                alt="profilePhoto"
              />
              <span className="font-weight-bold">{userData.user.username}</span>
              <span className="text-black-50">{userData.user.email}</span>
              <span> </span>
            </div>
          </div>
          <div className="col-md-5 border-right">
            <div className="p-3 py-5">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="text-right">Profile Settings</h4>
              </div>
              <form onSubmit={updateProfile}>
                <div className="row mt-2">
                  <div className="col-md-6">
                    <label className="labels" htmlFor="first_name">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="first_name"
                      value={firstname}
                      onChange={(e) => {
                        setFirstname(e.target.value);
                        IsChanged();
                      }}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="labels">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="last_name"
                      value={lastname}
                      onChange={(e) => {
                        setLastname(e.target.value);
                        IsChanged();
                      }}
                    />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-md-12">
                    <label className="labels">Mobile Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="mobileNo"
                      value={mobile}
                      onChange={(e) => {
                        setMobile(e.target.value);
                        IsChanged();
                      }}
                    />
                    <span id="mobileError" style={{ color: "red" }}></span>
                  </div>
                  <div className="col-md-12">
                    <label className="labels">Email ID</label>
                    <input
                      type="text"
                      className="form-control"
                      name="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        IsChanged();
                      }}
                    />
                    <span id="emailError" style={{ color: "red" }}></span>
                  </div>
                </div>
                <div className="mt-5 text-center">
                  <button
                    className="btn btn-primary profile-button"
                    type="submit"
                    id="saveButton"
                    disabled={true}
                  >
                    Save Profile
                  </button>
                  <span
                    id="Profileupdated"
                    style={{ color: "green", display: "block" }}
                  ></span>
                </div>
              </form>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-3 py-5">
              <div className="d-flex justify-content-between align-items-center experience">
                <span>Role</span>
                <span className="border px-3 p-1 add-experience">
                  <i className="fa fa-plus"></i>&nbsp;
                  {userData.user.profile.role}
                </span>
              </div>
              <br />
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Profile;