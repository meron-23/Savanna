import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Modal, Form, Input, Select, message, 
  Tabs, Card, Space, Alert, Tag, Badge, Divider, Spin,
  Descriptions, Popconfirm, Switch, Tooltip
} from 'antd';
import axios from 'axios';
import { 
  UserAddOutlined, 
  EditOutlined, 
  DeleteOutlined,
  DatabaseOutlined,
  TeamOutlined,
  BellOutlined,
  CheckOutlined,
  CloseOutlined,
  KeyOutlined,
  LockOutlined
} from '@ant-design/icons';


const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [queryResult, setQueryResult] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('1');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const API_BASE_URL = 'http://localhost:5000/api';

  // Role colors for tags
  const roleColors = {
    Admin: 'red',
    Manager: 'blue',
    Supervisor: 'orange',
    SalesAgent: 'green'
  };

  // Generate random password
  const generatePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/users`, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      setUsers(response.data.data);
    } catch (error) {
      if (error.response?.status === 403) {
        message.error("You don't have admin privileges");
      } else {
        console.error("Error fetching users:", error);
        message.error("Failed to load users");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/notifications`, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      setNotifications(response.data.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const url = currentUser 
        ? `${API_BASE_URL}/admin/users/${currentUser.userId}`
        : `${API_BASE_URL}/admin/users`;
        
      const method = currentUser ? 'put' : 'post';
      
      // Add login method if not specified
      if (!values.login_method) {
        values.login_method = 'email';
      }
      await axios[method](url, values, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      message.success(`User ${currentUser ? 'updated' : 'created'} successfully`);
      setIsModalVisible(false);
      fetchUsers();
    } catch (error) {
      if (error.response?.status === 403) {
        message.error("You don't have admin privileges");
      } else {
        console.error("Error submitting form:", error);
        message.error(error.response?.data?.message || "Operation failed");
      }
    }
  };

  // Handle password reset
  const handlePasswordReset = async () => {
    try {
      const values = await passwordForm.validateFields();
      setPasswordLoading(true);
      
      // Generate a new random password
      const newPassword = generatePassword();
      
      // Send request to backend to hash and update password
      await axios.patch(`${API_BASE_URL}/admin/users/${currentUser.userId}/password`, {
        newPassword
      }, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      message.success("Password reset successfully");
      setIsPasswordModalVisible(false);
      passwordForm.resetFields();
    } catch (error) {
      console.error("Error resetting password:", error);
      message.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setPasswordLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (userId) => {
    Modal.confirm({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this user?',
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await axios.delete(`${API_BASE_URL}/admin/users/${userId}`, {
            headers: { 
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          });
          message.success("User deleted successfully");
          fetchUsers();
        } catch (error) {
          if (error.response?.status === 403) {
            message.error("You don't have admin privileges");
          } else {
            console.error("Error deleting user:", error);
            message.error("Failed to delete user");
          }
        }
      }
    });
  };

  // Execute SQL query
  const executeQuery = async (query) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/query`, { query }, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      setQueryResult(response.data.data);
      message.success("Query executed successfully");
    } catch (error) {
      if (error.response?.status === 403) {
        message.error("You don't have admin privileges");
      } else {
        console.error("Error executing query:", error);
        message.error(error.response?.data?.message || "Query execution failed");
      }
      setQueryResult(null);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(`${API_BASE_URL}/notifications/${notificationId}/read`, {}, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, is_read: true } : n
      ));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Columns for users table
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center">
          <span className="font-medium">{text}</span>
          {record.userId === currentUser?.userId && (
            <Tag color="cyan" className="ml-2">You</Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => <Tag color={roleColors[role]}>{role}</Tag>,
    },
    {
      title: 'Status',
      key: 'is_active',
      render: (_, record) => (
        <Switch 
          checkedChildren="Active" 
          unCheckedChildren="Inactive" 
          checked={record.is_active}
          disabled={record.userId === currentUser?.userId}
          onChange={async (checked) => {
            try {
              await axios.patch(`${API_BASE_URL}/admin/users/${record.userId}/status`, {
                is_active: checked
              }, {
                headers: { 
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                  'Content-Type': 'application/json'
                }
              });
              message.success(`User ${checked ? 'activated' : 'deactivated'} successfully`);
              fetchUsers();
            } catch (error) {
              console.error("Error updating user status:", error);
              message.error("Failed to update user status");
            }
          }}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button 
              icon={<EditOutlined />} 
              onClick={() => {
                setCurrentUser(record);
                form.setFieldsValue({
                  ...record,
                  supervisor: record.supervisor || undefined
                });
                setIsModalVisible(true);
              }}
              disabled={record.role === 'Admin' && record.userId !== currentUser?.userId}
            />
          </Tooltip>
          
          <Tooltip title="Reset Password">
            <Button 
              icon={<KeyOutlined />} 
              onClick={() => {
                setCurrentUser(record);
                setIsPasswordModalVisible(true);
              }}
            />
          </Tooltip>
          
          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure to delete this user?"
              onConfirm={() => handleDelete(record.userId)}
              okText="Yes"
              cancelText="No"
              disabled={record.role === 'Admin'}
            >
              <Button 
                danger 
                icon={<DeleteOutlined />} 
                disabled={record.role === 'Admin'}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Effect to load data on mount and tab change
  useEffect(() => {
    fetchUsers();
    fetchNotifications();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [activeTab]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <Badge count={notifications.filter(n => !n.is_read).length}>
            <Button 
              icon={<BellOutlined />} 
              shape="circle"
              onClick={() => setActiveTab('3')}
            />
          </Badge>
        </div>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        {/* User Management Tab */}
        <TabPane tab={<span><TeamOutlined /> User Management</span>} key="1">
          <Card
            title="User Management"
            extra={
              <Button
                type="primary"
                icon={<UserAddOutlined />}
                onClick={() => {
                  setCurrentUser(null);
                  form.resetFields();
                  setIsModalVisible(true);
                }}
              >
                Add User
              </Button>
            }
          >
            <Spin spinning={loading}>
              <Table 
                columns={columns} 
                dataSource={users} 
                rowKey="userId"
                pagination={{ pageSize: 10 }}
                scroll={{ x: true }}
              />
            </Spin>
          </Card>
        </TabPane>
        
        {/* Database Query Tab */}
        <TabPane tab={<span><DatabaseOutlined /> Database Query</span>} key="2">
          <Card title="Database Query Tool">
            <Form
              layout="vertical"
              onFinish={({ query }) => executeQuery(query)}
            >
              <Form.Item
                name="query"
                label="SQL Query"
                rules={[{ required: true, message: 'Please enter a query' }]}
              >
                <TextArea 
                  rows={4} 
                  placeholder="SELECT * FROM users" 
                  style={{ fontFamily: 'monospace' }}
                />
              </Form.Item>
              
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Execute
                </Button>
              </Form.Item>
            </Form>
            
            {queryResult && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-lg font-medium">Query Results:</h4>
                  <Button 
                    size="small" 
                    icon={<CloseOutlined />} 
                    onClick={() => setQueryResult(null)}
                  />
                </div>
                <div className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
                  <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                    {JSON.stringify(queryResult, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </Card>
        </TabPane>

        {/* Notifications Tab */}
        <TabPane tab={<span><BellOutlined /> Notifications</span>} key="3">
          <Card title="Notifications">
            {notifications.length === 0 ? (
              <Alert message="No notifications" type="info" showIcon />
            ) : (
              <div className="space-y-4">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`p-4 rounded-lg border ${!notification.is_read ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{notification.message}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                      {!notification.is_read && (
                        <Button 
                          type="text" 
                          icon={<CheckOutlined />} 
                          onClick={() => markAsRead(notification.id)}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabPane>
      </Tabs>

      {/* User Modal */}
      <Modal
        title={currentUser ? "Edit User" : "Create User"}
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={loading}
        width={800}
      >
        <Form form={form} layout="vertical">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="name"
              label="Full Name"
              rules={[{ required: true, message: 'Please enter name' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please enter a valid password' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please enter email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="phoneNumber"
              label="Phone Number"
              rules={[{ required: true, message: 'Please enter phone number' }]}
            >
              <Input />
            </Form.Item>
            
            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true, message: 'Please select gender' }]}
            >
              <Select>
                <Option value="Male">Male</Option>
                <Option value="Female">Female</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>
          </div>

          <Divider />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: 'Please select role' }]}
            >
              <Select onChange={() => form.setFieldsValue({ supervisor: null })}>
                <Option value="Admin">Admin</Option>
                <Option value="Manager">Manager</Option>
                <Option value="Supervisor">Supervisor</Option>
                <Option value="SalesAgent">Sales Agent</Option>
              </Select>
            </Form.Item>
            
            <Form.Item
              name="login_method"
              label="Login Method"
              initialValue="email"
            >
              <Select>
                <Option value="email">Email/Password</Option>
                <Option value="google">Google</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.role !== currentValues.role}
          >
            {({ getFieldValue }) => 
              getFieldValue('role') === 'SalesAgent' ? (
                <Form.Item
                  name="supervisor"
                  label="Supervisor"
                  rules={[{ required: true, message: 'Please select supervisor' }]}
                >
                  <Select>
                    {users
                      .filter(user => user.role === 'Supervisor')
                      .map(supervisor => (
                        <Option key={supervisor.userId} value={supervisor.userId}>
                          {supervisor.name}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              ) : null
            }
          </Form.Item>

          {currentUser && (
            <Descriptions bordered size="small" column={1}>
              <Descriptions.Item label="Created At">
                {new Date(currentUser.creationTime).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Last Login">
                {currentUser.lastSignInTime ? 
                  new Date(currentUser.lastSignInTime).toLocaleString() : 
                  'Never'}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Form>
      </Modal>

      {/* Password Reset Modal */}
      <Modal
        title={<span><LockOutlined /> Reset Password</span>}
        visible={isPasswordModalVisible}
        onOk={handlePasswordReset}
        onCancel={() => {
          setIsPasswordModalVisible(false);
          passwordForm.resetFields();
        }}
        confirmLoading={passwordLoading}
      >
        <Form form={passwordForm} layout="vertical">
          <Alert
            message="Warning"
            description="This will reset the user's password to a new random password. The user will need to change it on their next login."
            type="warning"
            showIcon
            className="mb-4"
          />
          
          <Form.Item
            name="confirm"
            label={`Confirm password reset for ${currentUser?.name || 'this user'}`}
            rules={[
              { 
                required: true,
                message: 'Please type "RESET" to confirm'
              },
              {
                validator: (_, value) =>
                  value === 'RESET' ? Promise.resolve() : Promise.reject('Please type "RESET" exactly to confirm')
              }
            ]}
          >
            <Input placeholder='Type "RESET" to confirm' />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;