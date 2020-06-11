import React from 'react';
import { Table, Button , Input  } from 'antd';
// import Highlighter from 'react-highlight-words';
// import axios from 'axios';
// import './style.css';

class MyTable extends React.Component {
  state = {
        filteredInfo: null,
        sortedInfo: null,
        searchText: '',
        data: [
            {
                "key": 1,
                "num": 1,
                "name": "John1",
                "age": 32,
                "phone": 11111111111,
                "idnumber":330381111111111111
          },
          {
                "key": 2,
                "num": 2,
                "name": "John",
                "age": 322,
                "phone": 22222,
                "idnumber":12121312312
          },
        ]
  };
  handleChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  };
//还原筛选
  clearFilters = () => {
    this.setState({ filteredInfo: null });
  };
//还原排序
  clearSorted = () => {
    this.setState({ sortedInfo: null });
  };
//还原搜索
  clearSearch = clearFilters => {
    clearFilters();
    this.setState({ searchText: null });
  }; 
//一键还原
clearAll = () => {
    this.setState({
      filteredInfo: null,
      sortedInfo: null,
      searchText: null
    });
  };

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
<Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
        //   icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    // filterIcon: filtered => (
    // //   <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    // ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
 
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => this.searchInput.select());
            }
          },
          render: text => (
            <div>{text}</div>
          ),
        });
      
        handleSearch = (selectedKeys, confirm) => {
          confirm();
          this.setState({ searchText: selectedKeys[0]});
        };
      
      
        handleReset = clearFilters => {
            clearFilters();
            this.setState({ searchText: '' });
          }; 
        
          render() {
            let { sortedInfo, filteredInfo , data } = this.state;
            sortedInfo = sortedInfo || {};
            filteredInfo = filteredInfo || {};
            const columns = [
            {
              width: '10%',
              title: 'NO.',
              dataIndex: 'num',
              flex: 'left',
              sorter: (a, b) => a.num - b.num,
              sortOrder: sortedInfo.columnKey === 'num' && sortedInfo.order,
            },
            {
                width: '20%',
                title: 'Name',
                dataIndex: 'name',
                ...this.getColumnSearchProps('name'),
                sorter: (a, b) => {
                        var stringA = a.name.toUpperCase(); // ignore upper and lowercase
                        var stringB = b.name.toUpperCase(); // ignore upper and lowercase
                        if (stringA < stringB) {
                            return -1;
                        }
                        if (stringA > stringB) {
                            return 1;
                        }
                        // names must be equal
                        return 0;
                },
                sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
              },
              {
                width: '15%',
                title: 'Age',
                dataIndex: 'age',
                ...this.getColumnSearchProps('age'),
                onFilter: (value, record) => record.age.includes(value) ,
                sorter: (a, b) => a.age - b.age,
                sortOrder: sortedInfo.columnKey === 'age' && sortedInfo.order,
              },
              {
                width: '25%',
                title: 'phone',
                dataIndex: 'phone',
                ...this.getColumnSearchProps('phone')
              },
              {
                width: '30%',
                title: 'idnumber',
                dataIndex: 'idnumber',
                ...this.getColumnSearchProps('idnumber')
              }
            ];
            var datas=[
                {
                      "key": 1,
                      "num": 1,
                      "name": "John1",
                      "age": 32,
                      "phone": 11111111111,
                      "idnumber":330381111111111111
                },
                {
                      "key": 2,
                      "num": 2,
                      "name": "John",
                      "age": 322,
                      "phone": 22222,
                      "idnumber":12121312312
                },
            ]
            return (
                <div>
                  <div className="table-operations">
                    <Button onClick={this.clearSorted}>Clear Sorted</Button>
                    <Button onClick={() => this.handleReset(this.clearFilters)}>Clear Search</Button>
                    <Button onClick={this.clearFilters}>Clear Filters</Button>
                    <Button onClick={this.clearAll}>Clear All</Button>
                  </div>
                  <Table columns={columns} dataSource={data} onChange={this.handleChange} pagination={false}  scroll={{ x: 500, y: 300 }} bordered />
                </div>
              );
            }
            componentDidMount() {
                // axios.get('/api/people.json')
                //   .then(res => {
                //       const data = res.data.data.map(obj => obj.data);
                //       this.setState({data});
                //   }).catch(() => {alert('error')});
            }
        }
        export default MyTable;
        
          