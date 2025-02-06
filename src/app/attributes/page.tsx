/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Heading from "@/components/common/Heading";
import Paragraph from "@/components/common/Paragraph";
import DashboardLayout from "@/components/DashboardLayout";
import useAuth from "@/hooks/useAuth";
import React, { useEffect, useState } from "react";
import { Dropdown, DropdownButton, Modal, Table } from "react-bootstrap";
import { AiFillDelete } from "react-icons/ai";
import { FaEllipsisV } from "react-icons/fa";
import { FaKey, FaPlus } from "react-icons/fa6";
import { MdModeEditOutline, MdOutlineCancel, MdPeople } from "react-icons/md";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { deleteWithAuth, postWithAuth } from "@/utils/apiClient";
import { IoCheckmark, IoClose, IoSaveOutline } from "react-icons/io5";
import Link from "next/link";
import { AttributeUploadItem } from "@/types/types";
import { fetchAndMapAttributeTableData } from "@/utils/dataFetchFunctions";
import { usePermissions } from "@/context/userPermissions";
import { hasPermission } from "@/utils/permission";
import ToastMessage from "@/components/common/Toast";

export default function AllDocTable() {
  const isAuthenticated = useAuth();
  const permissions = usePermissions();

  const [tableData, setTableData] = useState<AttributeUploadItem[]>([]);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string>();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [modalStates, setModalStates] = useState({
    deleteModel: false,
  });


  const handleOpenModal = (modalName: keyof typeof modalStates) => {
    setModalStates((prev) => ({ ...prev, [modalName]: true }));
  };

  const handleCloseModal = (modalName: keyof typeof modalStates) => {
    setModalStates((prev) => ({ ...prev, [modalName]: false }));
  };

  useEffect(() => {
    fetchAndMapAttributeTableData(setTableData);
  }, []);

  if (!isAuthenticated) {
    return <LoadingSpinner />;
  }


  const handleDeleteAttribute = async () => {
    try {
      const response = await deleteWithAuth(`delete-attribute/${selectedItemId}`);
      if (response.status === "success") {
        handleCloseModal("deleteModel");
        setToastType("success");
        setToastMessage("Attribute deleted successfully!");
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 5000);
        fetchAndMapAttributeTableData(setTableData);
      } else {
        handleCloseModal("deleteModel");
        setToastType("error");
        setToastMessage("Attribute delete failed!");
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 5000);
      }

    } catch (error) {
      console.error("Error deleting attribute:", error);
    }
  };

  return (
    <>
      <DashboardLayout>
        <div className="d-flex justify-content-between align-items-center pt-2">
          <Heading text="Attributes" color="#444" />
          {hasPermission(permissions, "Attributes", "Add Attributes") && (
            <Link
              href="/attributes/add"
              className="addButton bg-white text-dark border border-success rounded px-3 py-1"
            >
              <FaPlus /> Add Attribute
            </Link>
          )}

        </div>

        <div className="d-flex flex-column bg-white p-2 p-lg-3 rounded mt-3">
          <div>
            <div
              style={{
                maxHeight: "380px",
                overflowY: "auto",
              }}
              className="custom-scroll"
            >
              <Table hover responsive >
                <thead className="sticky-header">
                  <tr>
                    <th>Actions</th>
                    <th className="text-start">Category</th>
                    <th className="text-start">Attributes</th>
                  </tr>
                </thead>
                <tbody >
                  {tableData.length > 0 ? (
                    tableData.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <DropdownButton
                            id="dropdown-basic-button"
                            drop="end"
                            title={<FaEllipsisV />}
                            className="no-caret position-static"
                          >
                            {hasPermission(permissions, "Attributes", "Edit Attributes") && (
                              <Dropdown.Item
                                href={`/attributes/${item.id}`}
                                className="py-2"
                              >
                                <MdModeEditOutline className="me-2" />
                                Edit
                              </Dropdown.Item>
                            )}
                            {hasPermission(permissions, "Attributes", "Delete Attributes") && (
                              <Dropdown.Item
                                href="#"
                                className="py-2"
                                onClick={() => {
                                  handleOpenModal("deleteModel");
                                  setSelectedItemId(item.id);
                                  setSelectedCategoryId(item.category.category_name)
                                }}
                              >
                                <AiFillDelete className="me-2" />
                                Delete
                              </Dropdown.Item>
                            )}
                          </DropdownButton>
                        </td>
                        <td>{item.category.category_name}</td>
                        <td>{item.attributes}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3}>
                        <div className="text-start w-100 py-3">
                          <Paragraph text="No data available" color="#333" />
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>


            { }
          </div>
        </div>
      </DashboardLayout>

      {/* delete */}
      <Modal
        centered
        show={modalStates.deleteModel}
        onHide={() => handleCloseModal("deleteModel")}
      >
        <Modal.Body>
          <div className="d-flex flex-column">
            <div className="d-flex w-100 justify-content-end">
              <div className="col-11 d-flex flex-row py-3">
                <p
                  className="mb-0 text-danger"
                  style={{ fontSize: "18px", color: "#333" }}
                >
                  Are you sure you want to delete?
                </p>
              </div>
              <div className="col-1 d-flex justify-content-end">
                <IoClose
                  fontSize={20}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleCloseModal("deleteModel")}
                />
              </div>
            </div>
            <div className="d-flex flex-row">
              <button
                onClick={handleDeleteAttribute}
                className="custom-icon-button button-success px-3 py-1 rounded me-2"
              >
                <IoCheckmark fontSize={16} className="me-1" /> Yes
              </button>
              <button
                onClick={() => {
                  handleCloseModal("deleteModel");
                }}
                className="custom-icon-button button-danger text-white bg-danger px-3 py-1 rounded"
              >
                <MdOutlineCancel fontSize={16} className="me-1" /> No
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <ToastMessage
        message={toastMessage}
        show={showToast}
        onClose={() => setShowToast(false)}
        type={toastType}
      />
    </>
  );
}
