import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Modal, Form, Input, Select, message, 
  Tabs, Card, Space, Alert, Tag, Badge, Divider, Spin,
  Descriptions, Popconfirm, Switch, Tooltip, Typography,
  Progress, Avatar, Statistic, Row, Col, Dropdown, Menu
} from 'antd';
import { 
  UserAddOutlined, EditOutlined, DeleteOutlined,
  DatabaseOutlined, TeamOutlined, BellOutlined,
  CheckOutlined, CloseOutlined, KeyOutlined,
  LockOutlined, ContainerOutlined, InfoCircleOutlined,
  MoreOutlined, LineChartOutlined, AuditOutlined,
  CloudServerOutlined, SecurityScanOutlined, DashboardOutlined
} from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';

const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;
const { Text, Title } = Typography;

// Enhanced techy color scheme
const techyColors = {
  primary: '#00f0ff',
  danger: '#ff003c',
  warning: '#ff7b00',
  success: '#00ff88',
  info: '#008cff',
  secondary: '#7928ca',
  dark: '#0a0a1a',
  light: '#f0f2f5'
};

// Role colors with gradients
const roleColors = {
  Admin: `linear-gradient(135deg, ${techyColors.danger}, #ff00f0)`,
  Manager: `linear-gradient(135deg, ${techyColors.info}, ${techyColors.primary})`,
  Supervisor: `linear-gradient(135deg, ${techyColors.warning}, ${techyColors.secondary})`,
  SalesAgent: `linear-gradient(135deg, ${techyColors.success}, #00cc66)`
};

const AdminDashboard = () => {
  // Original state
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
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [isLogModalVisible, setIsLogModalVisible] = useState(false);
  const [currentLog, setCurrentLog] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // New state for enhancements
  const [systemMetrics, setSystemMetrics] = useState({
    cpuUsage: 45,
    memoryUsage: 65,
    activeSessions: 124,
    dbSize: '2.4GB',
    status: 'optimal'
  });
  const [userActivity, setUserActivity] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [auditLogs, setAuditLogs] = useState([]);

  const API_BASE_URL = 'http://localhost:5000/api';

  // Original fetchUsers with activity tracking enhancement
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/users`, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      setUsers(response.data.data || []);
      
      // Generate mock activity data
      setUserActivity((response.data.data || []).map(user => ({
        ...user,
        lastActivity: moment().subtract(Math.floor(Math.random() * 24), 'hours').toISOString(),
        activityScore: Math.floor(Math.random() * 100),
        sessions: Math.floor(Math.random() * 10) + 1
      })));
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

  // Original fetchLogs
  const fetchLogs = async () => {
    setLogsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/logs`, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setLogs(response.data.data || []);
    } catch (error) {
      console.error("Error fetching logs:", error);
      message.error("Failed to load logs");
    } finally {
      setLogsLoading(false);
    }
  };

  // Original fetchNotifications
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/notifications`, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      setNotifications(response.data.data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // New function to fetch system metrics
  const fetchSystemMetrics = async () => {
    try {
      // Simulate metrics data
      setSystemMetrics(prev => ({
        cpuUsage: Math.min(100, Math.max(0, prev.cpuUsage + (Math.random() * 10 - 5))),
        memoryUsage: Math.min(100, Math.max(0, prev.memoryUsage + (Math.random() * 10 - 5))),
        activeSessions: Math.floor(Math.random() * 50) + 100,
        dbSize: `${(Math.random() * 0.5 + 2).toFixed(1)}GB`,
        status: ['optimal', 'stable', 'degraded'][Math.floor(Math.random() * 3)]
      }));
    } catch (error) {
      console.error("Error fetching metrics:", error);
    }
  };

  // New function to fetch audit logs
  const fetchAuditLogs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/audit-logs`, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setAuditLogs(response.data.data || []);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
    }
  };

  // Original handleSubmit
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const url = currentUser 
        ? `${API_BASE_URL}/admin/users/${currentUser.userId}`
        : `${API_BASE_URL}/admin/users`;
        
      const method = currentUser ? 'put' : 'post';
      
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

  // Original handlePasswordReset
  const handlePasswordReset = async () => {
    try {
      const values = await passwordForm.validateFields();
      setPasswordLoading(true);
      
      const newPassword = generatePassword();
      
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

  // Original handleDelete
  const handleDelete = async (userIds) => {
    Modal.confirm({
      title: 'Confirm Delete',
      content: `Are you sure you want to delete ${userIds.length > 1 ? 'these users' : 'this user'}?`,
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await axios.delete(`${API_BASE_URL}/admin/users`, {
            data: { userIds },
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          });
          message.success(`${userIds.length} user(s) deleted successfully`);
          fetchUsers();
          setSelectedRowKeys([]);
        } catch (error) {
          if (error.response?.status === 403) {
            message.error("You don't have admin privileges");
          } else {
            console.error("Error deleting user(s):", error);
            message.error("Failed to delete user(s)");
          }
        }
      }
    });
  };

  // Original executeQuery
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

  // Original markAsRead
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

  // Utility function to generate password
  const generatePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let password = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      password += charset.charAt(Math.floor(Math.random() * n));
    }
    return password;
  };

  // Enhanced columns with activity indicators
  const columns = [
    {
      title: 'User',
      dataIndex: 'name',
      key: 'name',
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) =>
        record.name.toLowerCase().includes(value.toLowerCase()) ||
        record.email.toLowerCase().includes(value.toLowerCase()),
      render: (text, record) => (
        <Space>
          <Avatar 
            style={{ 
              background: `linear-gradient(135deg, ${techyColors.primary}, ${techyColors.secondary})`,
              color: '#000'
            }}
          >
            {text.charAt(0)}
          </Avatar>
          <div>
            <div className="font-medium">{text}</div>
            <Typography.Text type="secondary">{record.email}</Typography.Text>
          </div>
          {record.userId === currentUser?.userId && (
            <Tag color="cyan">You</Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag style={{ 
          background: roleColors[role] || techyColors.info,
          color: '#000',
          fontWeight: 'bold',
          border: 'none'
        }}>
          {role}
        </Tag>
      ),
    },
    {
      title: 'Activity',
      key: 'activity',
      render: (_, record) => {
        const activity = userActivity.find(u => u.userId === record.userId);
        return activity ? (
          <Progress 
            percent={activity.activityScore} 
            strokeColor={{
              '0%': techyColors.danger,
              '100%': techyColors.success,
            }}
            showInfo={false}
            size="small"
          />
        ) : null;
      }
    },
    {
      title: 'Last Login',
      dataIndex: 'lastSignInTime',
      key: 'lastSignInTime',
      render: (time) => time ? moment(time).fromNow() : 'Never',
    },
    {
      title: 'Status',
      key: 'is_active',
      render: (_, record) => (
        <Switch 
          checkedChildren="Active" 
          unCheckedChildren="Inactive" 
          checked={record.is_active}
          disabled={record.role === 'Admin' && record.userId !== currentUser?.userId}
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
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item 
                key="edit" 
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
              >
                Edit
              </Menu.Item>
              <Menu.Item 
                key="password" 
                icon={<KeyOutlined />}
                onClick={() => {
                  setCurrentUser(record);
                  setIsPasswordModalVisible(true);
                }}
              >
                Reset Password
              </Menu.Item>
              <Menu.Item 
                key="activity" 
                icon={<LineChartOutlined />}
                onClick={() => {
                  // View detailed activity
                }}
              >
                View Activity
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item 
                key="delete" 
                icon={<DeleteOutlined />}
                danger
                disabled={record.role === 'Admin'}
                onClick={() => handleDelete([record.userId])}
              >
                Delete
              </Menu.Item>
            </Menu>
          }
          trigger={['click']}
        >
          <Button icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  // Log columns (original with enhancements)
  const logColumns = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp) => moment(timestamp).format('YYYY-MM-DD HH:mm:ss'),
      sorter: (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      render: (level) => {
        const colors = {
          ERROR: techyColors.danger,
          WARN: techyColors.warning,
          INFO: techyColors.info,
          DEBUG: techyColors.success
        };
        return (
          <Tag 
            color={colors[level] || 'default'}
            style={{ 
              fontWeight: 'bold',
              textShadow: `0 0 5px ${colors[level] || '#999'}`
            }}
          >
            {level}
          </Tag>
        );
      },
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <Text style={{ fontFamily: 'monospace' }}>{text}</Text>
        </Tooltip>
      )
    },
    {
      title: 'Source',
      dataIndex: 'source',
      key: 'source',
      render: (text) => <Tag color="geekblue">{text}</Tag>,
    },
    {
      title: 'Details',
      key: 'details',
      render: (_, record) => (
        <Button 
          size="small" 
          icon={<ContainerOutlined />}
          onClick={() => {
            setCurrentLog(record);
            setIsLogModalVisible(true);
          }}
        />
      )
    }
  ];

  // System Health Card component
  const SystemHealthCard = () => {
    const statusColors = {
      optimal: techyColors.success,
      stable: techyColors.info,
      degraded: techyColors.warning,
      critical: techyColors.danger
    };
    
    return (
      <Card 
        title="System Health" 
        style={{ marginBottom: 16 }}
        extra={
          <Tag 
            color={statusColors[systemMetrics.status]}
            style={{ 
              fontWeight: 'bold',
              textTransform: 'uppercase'
            }}
          >
            {systemMetrics.status}
          </Tag>
        }
      >
        <Row gutter={16}>
          <Col xs={24} sm={12} md={6}>
            <Statistic 
              title="CPU Usage" 
              value={systemMetrics.cpuUsage.toFixed(1)} 
              suffix="%" 
              valueStyle={{ color: techyColors.primary }}
            />
            <Progress 
              percent={systemMetrics.cpuUsage} 
              strokeColor={techyColors.primary}
              showInfo={false}
              status={systemMetrics.cpuUsage > 80 ? 'exception' : 'normal'}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic 
              title="Memory Usage" 
              value={systemMetrics.memoryUsage.toFixed(1)} 
              suffix="%" 
              valueStyle={{ color: techyColors.info }}
            />
            <Progress 
              percent={systemMetrics.memoryUsage} 
              strokeColor={techyColors.info}
              showInfo={false}
              status={systemMetrics.memoryUsage > 80 ? 'exception' : 'normal'}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic 
              title="Active Sessions" 
              value={systemMetrics.activeSessions} 
              valueStyle={{ color: techyColors.success }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic 
              title="Database Size" 
              value={systemMetrics.dbSize} 
              valueStyle={{ color: techyColors.secondary }}
            />
          </Col>
        </Row>
      </Card>
    );
  };

  // Effect to load data
  useEffect(() => {
    fetchUsers();
    fetchNotifications();
    fetchLogs();
    fetchAuditLogs();
    fetchSystemMetrics();
    
    // Poll for updates
    const metricsInterval = setInterval(fetchSystemMetrics, 5000);
    const notificationsInterval = setInterval(fetchNotifications, 30000);
    
    return () => {
      clearInterval(metricsInterval);
      clearInterval(notificationsInterval);
    };
  }, [activeTab]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => {
      setSelectedRowKeys(selectedKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: record.role === 'Admin',
    }),
  };

  const hasSelected = selectedRowKeys.length > 0;

  return (
    <div className="admin-dashboard" style={{ 
      background: darkMode ? techyColors.dark : techyColors.light,
      minHeight: '100vh',
      padding: 24,
      color: darkMode ? '#fff' : '#333'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 24
      }}>
        <Typography.Title level={3} style={{ 
          color: techyColors.primary,
          margin: 0,
          textShadow: `0 0 10px ${techyColors.primary}`
        }}>
          <SecurityScanOutlined /> Admin Console
        </Typography.Title>
        <Space>
          <Switch
            checkedChildren="🌙"
            unCheckedChildren="☀️"
            checked={darkMode}
            onChange={setDarkMode}
            style={{ backgroundColor: darkMode ? techyColors.primary : '#ccc' }}
          />
          <Badge 
            count={notifications.filter(n => !n.is_read).length} 
            style={{ backgroundColor: techyColors.danger }}
          >
            <Button 
              icon={<BellOutlined />} 
              shape="circle"
              onClick={() => setActiveTab('4')}
            />
          </Badge>
        </Space>
      </div>

      {/* Custom styling */}
      <style>{`
        .admin-dashboard .ant-card {
          background: ${darkMode ? '#111827' : '#fff'} !important;
          border-color: ${darkMode ? '#374151' : '#f0f0f0'} !important;
          box-shadow: 0 4px 6px ${darkMode ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
          border-radius: 8px;
        }
        .admin-dashboard .ant-card-head {
          border-bottom-color: ${darkMode ? '#374151' : '#f0f0f0'} !important;
        }
        .admin-dashboard .ant-card-head-title {
          color: ${techyColors.primary} !important;
          font-weight: 600;
        }
        .admin-dashboard .ant-table {
          background: transparent !important;
          color: ${darkMode ? '#fff' : '#333'} !important;
        }
        .admin-dashboard .ant-table-thead > tr > th {
          background: ${darkMode ? '#1f2937' : '#fafafa'} !important;
          color: ${techyColors.primary} !important;
          font-weight: 600;
          border-bottom-color: ${darkMode ? '#374151' : '#f0f0f0'} !important;
        }
        .admin-dashboard .ant-table-tbody > tr > td {
          border-bottom-color: ${darkMode ? '#374151' : '#f0f0f0'} !important;
        }
        .admin-dashboard .ant-table-tbody > tr:hover > td {
          background: ${darkMode ? '#1f2937' : '#fafafa'} !important;
        }
        .admin-dashboard .ant-tabs-tab {
          color: ${darkMode ? '#ccc' : '#666'} !important;
          font-weight: 500;
        }
        .admin-dashboard .ant-tabs-tab-active {
          color: ${techyColors.primary} !important;
        }
        .admin-dashboard .ant-tabs-ink-bar {
          background: ${techyColors.primary} !important;
          height: 3px;
        }
        .admin-dashboard .ant-input,
        .admin-dashboard .ant-select-selector,
        .admin-dashboard .ant-input-password {
          background: ${darkMode ? '#1f2937' : '#fff'} !important;
          border-color: ${darkMode ? '#4b5563' : '#d9d9d9'} !important;
          color: ${darkMode ? '#fff' : '#333'} !important;
        }
        .admin-dashboard .ant-modal-content {
          background: ${darkMode ? '#111827' : '#fff'} !important;
          color: ${darkMode ? '#fff' : '#333'} !important;
        }
        .admin-dashboard .ant-modal-header {
          background: ${darkMode ? '#111827' : '#fff'} !important;
          border-bottom-color: ${darkMode ? '#374151' : '#f0f0f0'} !important;
        }
        .admin-dashboard .ant-modal-title {
          color: ${techyColors.primary} !important;
        }
        .admin-dashboard .ant-btn {
          background: ${darkMode ? '#1f2937' : '#fff'} !important;
          border-color: ${darkMode ? '#4b5563' : '#d9d9d9'} !important;
          color: ${darkMode ? '#fff' : '#333'} !important;
        }
        .admin-dashboard .ant-btn-primary {
          background: ${techyColors.primary} !important;
          border-color: ${techyColors.primary} !important;
          color: #000 !important;
        }
        .admin-dashboard .ant-btn-primary:hover {
          box-shadow: 0 0 10px ${techyColors.primary}80 !important;
        }
        .admin-dashboard .ant-switch-checked {
          background: ${techyColors.success} !important;
        }
        .admin-dashboard .ant-tag {
          color: #000 !important;
          font-weight: 500;
        }
      `}</style>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        {/* Dashboard Tab */}
        <TabPane tab={<span><DashboardOutlined /> Dashboard</span>} key="1">
          <SystemHealthCard />
          
          <Card title="User Overview" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Card bordered={false}>
                  <Statistic 
                    title="Total Users" 
                    value={users.length} 
                    valueStyle={{ color: techyColors.primary }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Card bordered={false}>
                  <Statistic 
                    title="Active Users" 
                    value={users.filter(u => u.is_active).length} 
                    valueStyle={{ color: techyColors.success }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Card bordered={false}>
                  <Statistic 
                    title="Admins" 
                    value={users.filter(u => u.role === 'Admin').length} 
                    valueStyle={{ color: techyColors.danger }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Card bordered={false}>
                  <Statistic 
                    title="Recent Activity" 
                    value={userActivity.filter(a => moment(a.lastActivity).isAfter(moment().subtract(1, 'day'))).length} 
                    valueStyle={{ color: techyColors.info }}
                  />
                </Card>
              </Col>
            </Row>
          </Card>

          <Card title="Recent Activity">
            <Table
              columns={[
                {
                  title: 'User',
                  dataIndex: 'name',
                  key: 'name',
                  render: (text, record) => (
                    <Space>
                      <Avatar 
                        style={{ 
                          background: `linear-gradient(135deg, ${techyColors.primary}, ${techyColors.secondary})`,
                          color: '#000'
                        }}
                      >
                        {text.charAt(0)}
                      </Avatar>
                      <div>
                        <div className="font-medium">{text}</div>
                        <Typography.Text type="secondary">{record.email}</Typography.Text>
                      </div>
                    </Space>
                  )
                },
                {
                  title: 'Last Activity',
                  dataIndex: 'lastActivity',
                  key: 'lastActivity',
                  render: (time) => moment(time).fromNow()
                },
                {
                  title: 'Activity Score',
                  key: 'activityScore',
                  render: (_, record) => (
                    <Progress 
                      percent={record.activityScore} 
                      strokeColor={{
                        '0%': techyColors.danger,
                        '100%': techyColors.success,
                      }}
                      format={percent => `${percent}%`}
                      status={record.activityScore > 80 ? 'success' : record.activityScore > 50 ? 'normal' : 'exception'}
                    />
                  )
                }
              ]}
              dataSource={[...userActivity]
                .sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity))
                .slice(0, 5)}
              rowKey="userId"
              pagination={false}
            />
          </Card>
        </TabPane>

        {/* User Management Tab */}
        <TabPane tab={<span><TeamOutlined /> User Management</span>} key="2">
          <Card
            title="User Management"
            extra={
              <Space>
                {hasSelected && (
                  <Popconfirm
                    title="Are you sure to delete selected users?"
                    onConfirm={() => handleDelete(selectedRowKeys)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button danger icon={<DeleteOutlined />}>Delete Selected</Button>
                  </Popconfirm>
                )}
                <Input.Search
                  placeholder="Search by name or email"
                  onSearch={(value) => setSearchText(value)}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 250 }}
                  allowClear
                />
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
              </Space>
            }
          >
            <Spin spinning={loading}>
              <Table 
                columns={columns} 
                dataSource={users} 
                rowKey="userId"
                pagination={{ pageSize: 10 }}
                scroll={{ x: true }}
                rowSelection={rowSelection}
              />
            </Spin>
          </Card>
        </TabPane>
        
        {/* Database Query Tab */}
        <TabPane tab={<span><DatabaseOutlined /> Database</span>} key="3">
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
                  rows={6} 
                  placeholder="SELECT * FROM users" 
                  style={{ fontFamily: 'monospace' }}
                />
              </Form.Item>
              
              <Alert
                message="Available Tables"
                description={
                  <div className="font-mono text-sm">
                    <ul className="list-disc list-inside">
                      <li><Text code>users</Text> - All system users</li>
                      <li><Text code>prospects</Text> - Potential customers</li>
                      <li><Text code>visits</Text> - Customer visits tracking</li>
                      <li><Text code>sales_leads</Text> - Sales pipeline</li>
                      <li><Text code>client_feedback</Text> - Customer feedback</li>
                    </ul>
                  </div>
                }
                type="info"
                showIcon
              />
              
              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<CloudServerOutlined />}>
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
                <div 
                  className="p-4 rounded overflow-auto border" 
                  style={{ 
                    maxHeight: '500px',
                    backgroundColor: darkMode ? '#1f2937' : '#fafafa',
                    borderColor: darkMode ? '#374151' : '#d9d9d9',
                  }}
                >
                  <pre style={{ 
                    whiteSpace: 'pre-wrap', 
                    fontFamily: 'monospace',
                    color: darkMode ? '#fff' : '#333'
                  }}>
                    {JSON.stringify(queryResult, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </Card>
        </TabPane>

        {/* System Logs Tab */}
        <TabPane tab={<span><ContainerOutlined /> System Logs</span>} key="4">
          <Card title="System Logs">
            <Spin spinning={logsLoading}>
              <Table
                columns={logColumns}
                dataSource={logs}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                scroll={{ x: true }}
              />
            </Spin>
          </Card>
        </TabPane>

        {/* Notifications Tab */}
        <TabPane 
          tab={
            <span>
              <BellOutlined /> 
              Notifications 
              {notifications.filter(n => !n.is_read).length > 0 && (
                <Badge 
                  count={notifications.filter(n => !n.is_read).length} 
                  style={{ 
                    marginLeft: 8,
                    backgroundColor: techyColors.danger,
                  }}
                />
              )}
            </span>
          } 
          key="5"
        >
          <Card title="Notifications">
            {notifications.length === 0 ? (
              <Alert message="No notifications" type="info" showIcon />
            ) : (
              <div className="space-y-4">
                {notifications.map(notification => (
                  <Card 
                    key={notification.id} 
                    size="small"
                    style={{ 
                      backgroundColor: darkMode ? '#1f2937' : '#fff',
                      borderColor: notification.is_read 
                        ? (darkMode ? '#374151' : '#d9d9d9') 
                        : techyColors.primary,
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{notification.message}</div>
                        <div className="text-sm text-gray-400 mt-1">
                          {moment(notification.created_at).format('YYYY-MM-DD HH:mm:ss')}
                        </div>
                      </div>
                      {!notification.is_read && (
                        <Button 
                          type="text" 
                          icon={<CheckOutlined style={{ color: techyColors.primary }} />} 
                          onClick={() => markAsRead(notification.id)}
                        />
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </TabPane>
      </Tabs>

      {/* User Modal */}
      <Modal
        title={
          <span>
            {currentUser ? (
              <>
                <EditOutlined /> Edit User: {currentUser.name}
              </>
            ) : (
              <>
                <UserAddOutlined /> Create New User
              </>
            )}
          </span>
        }
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={loading}
        width={800}
        bodyStyle={{ paddingBottom: 0 }}
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

          {!currentUser && (
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please enter a password' }]}
              extra="Password must be at least 8 characters long"
            >
              <Input.Password />
            </Form.Item>
          )}

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
                <Option value="Prefer not to say">Prefer not to say</Option>
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
                <Option value="Developer">Developer</Option>
                <Option value="Analyst">Analyst</Option>
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
                <Option value="github">GitHub</Option>
                <Option value="microsoft">Microsoft</Option>
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
                {moment(currentUser.creationTime).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              <Descriptions.Item label="Last Login">
                {currentUser.lastSignInTime ? 
                  moment(currentUser.lastSignInTime).format('YYYY-MM-DD HH:mm:ss') : 
                  'Never'}
              </Descriptions.Item>
              <Descriptions.Item label="User ID">
                <Text copyable>{currentUser.userId}</Text>
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

      {/* Log Details Modal */}
      <Modal
        title="Log Details"
        visible={isLogModalVisible}
        onCancel={() => setIsLogModalVisible(false)}
        footer={null}
        width={800}
      >
        {currentLog && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Timestamp">
              {moment(currentLog.timestamp).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="Level">
              <Tag 
                color={
                  currentLog.level === 'ERROR' ? techyColors.danger :
                  currentLog.level === 'WARN' ? techyColors.warning :
                  currentLog.level === 'INFO' ? techyColors.info :
                  techyColors.success
                }
                style={{ 
                  fontWeight: 'bold',
                  textShadow: `0 0 5px ${
                    currentLog.level === 'ERROR' ? techyColors.danger :
                    currentLog.level === 'WARN' ? techyColors.warning :
                    currentLog.level === 'INFO' ? techyColors.info :
                    techyColors.success
                  }`
                }}
              >
                {currentLog.level}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Source">
              <Tag color="geekblue">{currentLog.source}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Message">
              <Text style={{ fontFamily: 'monospace' }}>{currentLog.message}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Details">
              <div 
                className="p-2 rounded overflow-auto" 
                style={{ 
                  maxHeight: '300px',
                  backgroundColor: darkMode ? '#1f2937' : '#fafafa',
                }}
              >
                <pre style={{ 
                  whiteSpace: 'pre-wrap', 
                  fontFamily: 'monospace',
                  color: darkMode ? '#fff' : '#333'
                }}>
                  {JSON.stringify(currentLog.details, null, 2)}
                </pre>
              </div>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default AdminDashboard;