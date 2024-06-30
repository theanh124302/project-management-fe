// src/components/charts/MyPieChart.jsx
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import axiosInstance from '../AxiosInstance';
import { Card } from 'react-bootstrap';

const COLOR_MAP = {
  CANCELLED: '#dc3545', // 'danger'
  NOT_STARTED: '#6c757d', // 'secondary'
  IN_PROGRESS: '#17a2b8', // 'info'
  COMPLETED: '#28a745', // 'success'
  BLOCKED: '#343a40', // 'dark'
  ON_HOLD: '#ffc107', // 'warning'
  PENDING: '#007bff', // 'primary'
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
        <Card.Title>Task Status Distribution</Card.Title>
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            cx={200}
            cy={200}
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLOR_MAP[entry.name]} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name, props) => `${name}: ${value}`} />
          <Legend />
        </PieChart>
      </Card.Body>
    </Card>
  );
}

export default MyPieChart;
