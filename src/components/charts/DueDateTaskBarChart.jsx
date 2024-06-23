// src/components/charts/DueDateTaskBarChart.jsx
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import axios from 'axios';
import axiosInstance from '../AxiosInstance';
import { useParams } from 'react-router-dom';
import { Card, ButtonGroup, Button } from 'react-bootstrap';

const DueDateTaskBarChart = () => {
  const { projectId } = useParams();
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('day'); // Default filter is by day

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint = filter === 'day' ? 'countDueDateByDay' : 'countDueDateByMonth';
        const response = await axiosInstance.get(`/api/v1/task/${endpoint}`, {
          params: { projectId }
        });
        setData(response.data.data);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchData();
  }, [filter, projectId]);

  const handleFilterChange = (filterType) => {
    setFilter(filterType);
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Due Date Task Distribution</Card.Title>
        <ButtonGroup className="mb-3">
          <Button
            variant={filter === 'day' ? 'success' : 'secondary'}
            onClick={() => handleFilterChange('day')}
          >
            By Day
          </Button>
          <Button
            variant={filter === 'month' ? 'success' : 'secondary'}
            onClick={() => handleFilterChange('month')}
          >
            By Month
          </Button>
        </ButtonGroup>
        <BarChart width={1100} height={500} data={data}>
          <XAxis dataKey="number" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </Card.Body>
    </Card>
  );
};

export default DueDateTaskBarChart;
