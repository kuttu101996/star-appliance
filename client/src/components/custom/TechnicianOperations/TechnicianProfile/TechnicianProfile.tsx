import { ServiceRecord, ServiceRequest } from "@/types/schemaTypes";
import Unauthorize from "@/Unauthorize";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const TechnicianProfile = () => {
  const { id } = useParams();
  const [tokenPresent, setTokenPresent] = useState<boolean>(false);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([]);
  // const [stock, setStock] = useState<TechnicianInventory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getRequests = async (token: string) => {
    try {
      const response = await axios.get(
        `http://localhost:1300/technician/pending-request/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setServiceRequests(response.data.result);
      }
    } catch (error: any) {
      console.error("Error fetching service requests:", error);
    }
  };

  const getRecords = async (token: string) => {
    try {
      const response = await axios.get(
        `http://localhost:1300/technician/service-records/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setServiceRecords(response.data.result);
      }
    } catch (error: any) {
      console.error("Error fetching service records:", error);
    }
  };

  const getStock = async (token: string) => {
    try {
      const response = await axios.get(
        `http://localhost:1300/technician/stock/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        // setStock(response.data.result);
      }
    } catch (error: any) {
      console.error("Error fetching service records:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const getToken = sessionStorage.getItem("token");
      if (getToken) {
        setTokenPresent(true);
        try {
          await Promise.all([
            getRequests(getToken),
            getRecords(getToken),
            getStock(getToken),
          ]);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      } else {
        setTokenPresent(false);
      }
      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (!tokenPresent) return <Unauthorize />;
  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Technician Profile</h1>
      <h2>Pending Service Requests</h2>
      <ul>
        {/* {serviceRequests.map((request) => (
          <li key={request.id}>{request.description}</li>
        ))} */}
      </ul>

      <h2>Service Records</h2>
      <ul>
        {/* {serviceRecords.map((record) => (
          <li key={record.id}>{record.serviceDescription}</li>
        ))} */}
      </ul>

      <h2>Technician Stock</h2>
      <ul>
        {/* {stock.map((item) => (
          <li key={item.id}>{item.inventory.itemName}</li>
        ))} */}
      </ul>
    </div>
  );
};

export default TechnicianProfile;
