/* eslint-disable */
import React from 'react';
import { Table, Input, Popconfirm, InputNumber, Form, Select } from 'antd';
import Utils from '@/utils/tool';


/* 表单编辑表格 */
export class FormEdit extends React.Component {

    // 点击表格行时添加或切换选择项
    onRowClick = (record, index) => {
        this.props.changeSelectedItem && this.props.changeSelectedItem(record);
    }

    // 点击表格选中框时添加或切换选择项
    onSelectChange = (selectedRowKeys, selectedRows) => {
        let rowSelection = this.props.type;
        if (rowSelection === 'checkbox') {
            let selectedRowKeys = [];
            let selectedItem = [];
            let selectedIds = [];
            if (selectedRows !== []) {
                selectedRows.forEach(item => {
                    selectedIds.push(item.id);
                    selectedRowKeys.push(item.id);
                    selectedItem.push(item);
                });
            } else {
                selectedIds = [];
                selectedRowKeys = [];
                selectedItem = [];
            }
            this.props.updateSelectedItem(selectedRowKeys, selectedItem, selectedIds);
        } else {
            let selectedRowKeys = [selectedRows[0].id];
            let selectedItem = selectedRows;
            this.props.updateSelectedItem(selectedRowKeys, selectedItem);
        }
    }

    // 输出table表格
    tableInit = () => {
        let row_selection = this.props.type;
        let selectedRowKeys = this.props.selectedRowKeys;
        let onChange = this.onSelectChange;
        const rowSelection = {
            type: 'radio',
            selectedRowKeys,
            onChange
        }
        if (row_selection === false || row_selection === null) {
            row_selection = false;
        } else if (row_selection === 'checkbox') {
            rowSelection.type = 'checkbox';
        } else {
            row_selection = 'radio';
        }
        return <Table
            {...this.props}
            rowSelection={row_selection ? rowSelection : null}
            onRow={(record, index) => {
                return {
                    onClick: () => {
                        if (!row_selection) {
                            return;
                        }
                        this.onRowClick(record, index);
                    }
                };
            }}
        />
    }

    render() {
        return (<div>
            {this.tableInit()}
        </div>);
    }
}

/* 行内编辑表格 */
const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

// 单元格选项
class EditableCell extends React.Component {
    // 判断input框是否为number
    getInput = () => {
        if (this.props.inputType === 'number') {
            return <InputNumber />;
        }
        return <Input />;
    };

    // 渲染td
    render() {
        // console.log(this.props)
        const {
            editing, // 是否可编辑
            dataIndex, // 数据的index
            title, // 数据title
            inputType, // 数据input类型
            record, // 数据
            index,
            isSelect, // 选择项列表
            selectItems, // 选择项列表项
            ...restProps
        } = this.props;
        // console.log(record)
        // console.log(dataIndex)
        return (
            <EditableContext.Consumer>
                {(form) => {
                    const { getFieldDecorator } = form;
                    let selectList = '';
                    if(isSelect) {
                        if(isSelect.length > 0){
                            isSelect.forEach((item) => {
                                if(item === dataIndex) {
                                    let formItem = <FormItem style={{ margin: 0 }}>
                                        {getFieldDecorator(dataIndex, {
                                            initialValue: record[dataIndex],
                                        })(
                                            <Select>
                                                {Utils.getOptionList(selectItems[item],'name',true)}
                                            </Select>
                                        )}
                                    </FormItem>
                                    selectList = formItem;
                                }
                            })
                        }
                    }
                    // console.log(selectList)
                    return (
                        <td {...restProps}>
                            {!editing ? restProps.children :
                                selectList ? selectList : 
                                (
                                    <FormItem style={{ margin: 0 }}>
                                        {getFieldDecorator(dataIndex, {
                                            initialValue: record[dataIndex],
                                        })(this.getInput())}
                                    </FormItem>
                                )
                            }
                        </td>
                    );
                }}
            </EditableContext.Consumer>
        );
    }
}

export class RowEdit extends React.Component {
    render() {
        const dataSource = this.props.dataSource; // 数据
        const operationList = this.props.operationList || []; // 数据
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };
        if (!(this.props.columns[this.props.columns.length - 1].title === '操作')) {
            this.props.columns.push({
                title: '操作',
                dataIndex: 'operation',
                align: 'center',
                width: 200,
                render: (text, record) => {
                    const editable = this.props.isEditing(record);
                    return (
                        editable ?
                            (
                                <span>
                                    <EditableContext.Consumer>
                                        {form => (
                                            <a
                                                href="javascript:;" // eslint-disable-line
                                                onClick={() => this.props.save(form, record.key)}
                                                style={{ marginRight: 8 }}
                                            >
                                                保存
                                            </a>
                                        )}
                                    </EditableContext.Consumer>
                                    <Popconfirm
                                        title="确定取消吗?"
                                        onConfirm={() => this.props.cancel(record.key)}
                                    >
                                        <a>取消</a>
                                    </Popconfirm>
                                </span>
                            )
                            :
                            (
                                <React.Fragment>
                                    {
                                        operationList.map((item) => {
                                            if(item.needConfirm === true) {
                                                return (
                                                    <Popconfirm key={item.key} title={item.confirmTitle} onConfirm={() => this.props[item.operation](record.key)} style={{ marginRight: 8 }}>
                                                        <a>{item.operationName}</a>
                                                    </Popconfirm>
                                                )
                                            } else {
                                                return <a key={item.key} onClick={() => this.props[item.operation](record.key)} style={{ marginRight: 8 }}>{item.operationName}</a>
                                            }
                                        })
                                    }
                                </React.Fragment>
                            )
                    );
                },
            })
        }
        const columns = this.props.columns.map((col) => {
            // console.log(col)
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: (record) => {
                    return ({
                        record,
                        inputType: col.inputType === 'number' ? 'number' : 'text',
                        dataIndex: col.dataIndex,
                        title: col.title,
                        editing: this.props.isEditing(record),
                        isSelect: this.props.isSelect,
                        selectItems: this.props.selectItems
                    })
                },
            };
        });
        return (
            <div>
                <Table
                    id='printTable'
                    style={{ backgroundColor: '#fff' }}
                    components={components} // 覆盖默认表格样式
                    rowClassName={() => 'editable-row'}
                    dataSource={dataSource}
                    columns={columns}
                    bordered={this.props.bordered}
                    pagination={this.props.pagination}
                    scroll={this.props.scroll}
                />
            </div>
        );
    }
}