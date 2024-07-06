import React, { useEffect, useState } from 'react';
import axiosInstance from '../AxiosInstance';
import { ResponsiveContainer } from 'recharts';
import { Card } from 'react-bootstrap';

const CountChart = ({ projectId }) => {
  const [counts, setCounts] = useState({
    apis: 0,
    tasks: 0,
    issues: 0,
    databaseTables: 0,
    environments: 0,
    files: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [apisResponse, tasksResponse, issuesResponse, databaseTablesResponse, environmentsResponse, filesResponse] = await Promise.all([
          axiosInstance.get(`/api/v1/api/countByProjectId`, { params: { projectId } }),
          axiosInstance.get(`/api/v1/task/countByProjectId`, { params: { projectId } }),
          axiosInstance.get(`/api/v1/issue/countByProjectId`, { params: { projectId } }),
          axiosInstance.get(`/api/v1/database-table/countByProjectId`, { params: { projectId } }),
          axiosInstance.get(`/api/v1/environment/countByProjectId`, { params: { projectId } }),
          axiosInstance.get(`/api/v1/project-file/countByProjectId`, { params: { projectId } }),
        ]);

        setCounts({
          apis: apisResponse.data.data,
          tasks: tasksResponse.data.data,
          issues: issuesResponse.data.data,
          databaseTables: databaseTablesResponse.data.data,
          environments: environmentsResponse.data.data,
          files: filesResponse.data.data,
        });
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };

    fetchCounts();
  }, [projectId]);

  return (
    <Card>
      <Card.Body>
        <ResponsiveContainer width="100%" height={266}>
            <h5>Project Counts</h5>
            <ul>
            <li>APIs: {counts.apis}</li>
            <li>Tasks: {counts.tasks}</li>
            <li>Issues: {counts.issues}</li>
            <li>Database Tables: {counts.databaseTables}</li>
            <li>Environments: {counts.environments}</li>
            <li>Files: {counts.files}</li>
            </ul>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
}

export default CountChart;
