import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const AddProject = () => {
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    leaderId: '', // Đảm bảo rằng leaderId được gán giá trị phù hợp
    // Các trường dữ liệu khác của project
  });

  const history = useHistory();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData({
      ...projectData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/v1/projects/create', projectData);
      console.log('Project created successfully:', response.data);
      // Chuyển hướng đến trang danh sách dự án sau khi tạo dự án thành công
      history.push('/projects');
    } catch (error) {
      console.error('Failed to create project:', error);
      // Xử lý lỗi nếu cần
    }
  };

  return (
    <div>
      <h2>Thêm dự án mới</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Tên dự án:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={projectData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="description">Mô tả:</label>
          <textarea
            id="description"
            name="description"
            value={projectData.description}
            onChange={handleChange}
          />
        </div>
        {/* Thêm các trường dữ liệu khác của dự án tại đây */}
        <button type="submit">Tạo dự án</button>
      </form>
    </div>
  );
};

export default AddProject;
