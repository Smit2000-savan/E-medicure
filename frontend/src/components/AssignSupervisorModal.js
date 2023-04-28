import React from "react";
import { useState, useEffect } from "react";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

const AssignSupervisorModal = ({userData, show, handleClose, inputData, setinputData}) => {

  const [postData, setpostData] = useState({
    id: "",
    profile: {
      id: "",
      role: "",
    },
  });

   useEffect(() => {
      if (postData.id !== "") {
        assignsupervisor_Update_User_MedicalShop();
        handleClose();
      }
    }, [postData]);

   const assignsupervisor_Update_User_MedicalShop = async () => {
      const response = await fetch(
        `http://127.0.0.1:8000/auth/user/${postData.id}`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.access}`,
          },
          body: JSON.stringify(postData),
        }
      ).catch((e) => console.log(e));
  
      let data = await response.json();
  
      if (response.status >= 200 && response.status < 300) {
        const response2 = await fetch(
          `http://127.0.0.1:8000/api/medical/${inputData.medshopid}`,
          {
            method: "PATCH",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${userData.access}`,
            },
            body: JSON.stringify({ shopSupervisor: postData.id }),
          }
        ).catch((e) => console.log(e));
        let data2 = await response2.json();
  
        if (response2.status >= 200 && response2.status < 300) {
          alert(
            `Supervisor with email : ${data.email} is assigned to Medical Shop : ${data2.shopName}`
          );
        } else {
          console.log(data2);
          if (data2.shopSupervisor) {
            alert("This User is already a supervisor of a shop");
          } else {
            alert(response2.statusText);
          }
        }
      } else {
        console.log(data);
        alert(response.statusText);
      }
    };
  
    const assignsupervisor_getUserId = async () => {
      const response = await fetch(
        `http://127.0.0.1:8000/auth/user?email=${inputData.email}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.access}`,
          },
        }
      ).catch((e) => {
        console.log(e);
      });
  
      const data = await response.json();
  
      if (response.status >= 200 && response.status < 300 && data !== []) {
        setpostData((postData) => ({
          ...postData,
          id: data[0].id,
          profile: {
            ...postData.profile,
            id: data[0].profile.id,
            role: "Supervisor",
          },
        }));
      } else {
        console.log(data);
        alert(
          "User with email address is not registered. Please register the user first then assign him as Supervisor."
        );
      }
    };
   
  const handleSubmit = (e) => {
   e.preventDefault();
   assignsupervisor_getUserId();
 };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title> Supervisor Detail </Modal.Title>
        </Modal.Header>
        <Form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <Modal.Body>
            <Form.Text muted>
              Enter the email address of registered user whom you want to assign
              Supervisor
            </Form.Text>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                required
                name="superemail"
                type="email"
                placeholder="name@example.com"
                onChange={(e) => {
                  setinputData((prevData) => ({
                    ...prevData,
                    email: e.target.value,
                  }));
                }}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default AssignSupervisorModal;