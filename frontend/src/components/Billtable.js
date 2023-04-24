import React from "react";
import { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Paginations from "./Paginations";
import Table from "react-bootstrap/Table";
import BillModal from "./BillModal";

let pagination_size = 5;

const Billtable = ({ currentBill }) => {
  const [show, setShow] = useState({ show: false, data: [] });
  const handleClose = () => setShow({ show: false, data: [] });
  const handleShow = (show, data) => setShow({ show: show, data: data });

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(pagination_size);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = currentBill.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const nPages = Math.ceil(currentBill.length / recordsPerPage);

  const HandleDelete = async (event, id) => {
    let res = window.confirm("Are You sure want to delete this Bill : " + id);
    if (res === true) {
      const response = await fetch(`http://127.0.0.1:8000/api/bill/` + id, {
        method: "DELETE",
      }).catch((e) => console.log(e));

      alert("Bill Id : " + id + " Deleted Successfully.");
      window.location.reload();
    }
  };

  const [Clicked, setClicked] = useState(false);

  return (
    <Container>
      <BillModal show={show} setshow={setShow} handleClose={handleClose} />
      <Row className="justify-content-center">
        <Col className="dynamic-form-headings">
          <h3>All Bill Details</h3>
          <Button
            onClick={() => {
              setClicked(!Clicked);
            }}
          >
            {Clicked ? <>Hide </> : <>Show </>}
            Data
          </Button>
        </Col>

        {Clicked ? (
          <>
            <Table borderless striped>
              <thead>
                <tr>
                  <th scope="col">Bill Id</th>
                  <th scope="col">Customer Name </th>
                  <th scope="col">Bill Date </th>
                  <th scope="col">Total Payable Amount</th>
                  <th scope="col">View</th>
                  <th scope="col">Delete</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((bill) => {
                  console.log(bill.BillItems);
                  return (
                    <tr key={bill.pk}>
                      <td>{bill.pk}</td>
                      <td> {bill.custName}</td>
                      <td> {bill.generatedDate}</td>
                      <td>{bill.totalAmount}</td>
                      <td>
                        <Button
                          variant="primary"
                          onClick={() => handleShow(true, bill)}
                        >
                          view
                        </Button>
                      </td>
                      <td>
                        <Button
                          variant="danger"
                          onClick={(e) => {
                            HandleDelete(e, bill.pk);
                          }}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>

            <Paginations
              nPages={nPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </>
        ) : (
          <></>
        )}
      </Row>
    </Container>
  );
};

export default Billtable;