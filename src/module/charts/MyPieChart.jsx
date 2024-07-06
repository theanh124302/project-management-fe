// src/components/charts/MyPieChart.jsx
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer  } from 'recharts';
import axiosInstance from '../AxiosInstance';
import { Card } from 'react-bootstrap';

const COLOR_MAP = {
  CANCELLED: '#dc3545',
  NOT_STARTED: '#6c757d',
  IN_PROGRESS: '#17a2b8',
  COMPLETED: '#28a745',
  BLOCKED: '#343a40',
  ON_HOLD: '#ffc107',
  PENDING: '#007bff',
};

const MyPieChart = ({ projectId }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/task/countByProjectIdGroupByStatus`, {
          params: { projectId }
        });
        setData(response.data.data);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchData();
  }, [projectId]);

  return (
    <Card>
      <Card.Body>
        <ResponsiveContainer width="100%" height={266}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={true}
                innerRadius="50%"
                outerRadius="70%"
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLOR_MAP[entry.name]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}`} />
            </PieChart>
          </ResponsiveContainer>

      </Card.Body>
    </Card>
  );
}

export default MyPieChart;
