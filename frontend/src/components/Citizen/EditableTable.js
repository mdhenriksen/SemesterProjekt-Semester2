import { Table, Input, InputNumber, Popconfirm, Form, Tag, Select, Divider, Spin } from 'antd'
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { toJS } from 'mobx'

import concat from '../../utils/concat'

const Option = Select.Option

class EditableCell extends React.Component {
    getInput = () => {
        if (this.props.inputType === 'number') {
            return <InputNumber />
        }
        if (this.props.inputType === 'option') {
            return (<Select
                mode='multiple'
                style={{ width: '100%' }}
            >
                <Option value="alkoholmisbrug">Alkoholmisbrug</Option>
                <Option value="stofmisbrug">Stofmisbrug</Option>
                <Option value="handicappet">Handicappet</Option>
                <Option value="angst">Angst</Option>
            </Select>)
        }
        return <Input />
    }

    render() {
        const {
            editing,
            dataIndex,
            title,
            inputType,
            record,
            index,
            ...restProps
        } = this.props
        return (
            <EditableContext.Consumer>
                {(form) => {
                    const { getFieldDecorator } = form
                    return (
                        <td {...restProps}>
                            {editing ? (
                                <FormItem style={{ margin: 0 }}>
                                    {getFieldDecorator(dataIndex, {
                                        rules: [{
                                            required: true,
                                            message: `Please Input ${title}!`,
                                        }],
                                        initialValue: record[dataIndex],
                                    })(this.getInput())}
                                </FormItem>
                            ) : restProps.children}
                        </td>
                    )
                }}
            </EditableContext.Consumer>
        )
    }
}

const FormItem = Form.Item
const EditableContext = React.createContext()

@inject('citizensStore')
@observer
class EditableTable extends React.Component {
    constructor(props) {
        super(props)
        this.getCitizens = () => this.props.citizensStore.fetchCitizens()
        this.deleteCitizen = (id) => this.props.citizensStore.deleteCitizen(id)
        this.updateCitizen = (citizen) => this.props.citizensStore.updateCitizen(citizen)
        this.state = { editingKey: '' }

        this.columns = [
            {
                title: 'Navn',
                dataIndex: 'name',
                width: '20%',
                editable: true,
            },
            {
                title: 'Adresse',
                dataIndex: 'address',
                width: '15%',
                editable: true,
            },
            {
                title: 'By',
                dataIndex: 'city',
                width: '10%',
                editable: true,
            },
            {
                title: 'Postnummer',
                dataIndex: 'zip',
                width: '10%',
                editable: true,
            },
            {
                title: 'Telefon',
                dataIndex: 'phoneNumber',
                width: '15%',
                editable: true,
            },
            {
                title: 'Diagnoser',
                key: 'diagnoses',
                dataIndex: 'diagnoses',
                editable: true,
                render: tags => (
                    <span>
                        {tags.map(tag => {
                            let color = tag.length > 2 ? 'geekblue' : 'green'
                            if (tag === 'Psykotisk') {
                                color = 'volcano'
                            }
                            return (
                                <Tag color={color} key={tag}>
                                    {tag.toUpperCase()}
                                </Tag>
                            )
                        })}
                    </span>
                )
            },
            {
                title: 'Handling',
                dataIndex: 'operation',
                render: (text, record) => {
                    const { editingKey } = this.state
                    const editable = this.isEditing(record)
                    return (
                        <div>
                            {editable ? (
                                <span>
                                    <EditableContext.Consumer>
                                        {form => (
                                            <a
                                                href='javascript:'
                                                onClick={() => this.save(form, record.id)}
                                                style={{ marginRight: 15 }}
                                            >
                                                Gem
                                            </a>
                                        )}
                                    </EditableContext.Consumer>
                                    <Popconfirm
                                        title='Sure to cancel?'
                                        onConfirm={() => this.cancel(record.id)}
                                    >
                                        <a>Annullér</a>
                                    </Popconfirm>
                                </span>
                            ) : (
                                    <a disabled={editingKey !== ''} onClick={() => this.edit(record.id)}>Redigér</a>
                                )}
                            <Divider type='vertical' />
                            {!editable ? (<Popconfirm title='Sure to delete?' onConfirm={() => this.handleDelete(record.id)}>
                                <a href='javascript:'>Slet</a>
                            </Popconfirm>
                            ) : null}
                        </div>
                    )
                },
            },
        ]
    }

    componentWillMount() {
        this.getCitizens()
    }

    handleDelete = (id) => {
        this.deleteCitizen(id)
    }

    isEditing = record => record.id === this.state.editingKey

    cancel = () => {
        this.setState({ editingKey: '' })
    }

    save(form, key) {
        const { primaryCitizens, otherCitizens } = this.props.citizensStore
        form.validateFields((error, row) => {
            if (error) {
                return
            }
            const newData = [...concat(primaryCitizens, otherCitizens)]
            const index = newData.findIndex(item => key === item.id)
            if (index > -1) {
                const item = toJS(newData[index])
                const updatedCitizen = {
                    ...item,
                    ...row
                }
                this.updateCitizen(updatedCitizen)
                this.setState({ editingKey: '' })
            } else {
                newData.push(row)
                this.setState({ editingKey: '' })
            }
        })
    }

    edit(key) {
        this.setState({ editingKey: key })
    }

    render() {
        const { citizensStore } = this.props
        const { primaryCitizens, otherCitizens, isFetching } = citizensStore

        const components = {
            body: {
                cell: EditableCell,
            },
        }

        const columns = this.columns.map((col) => {
            if (!col.editable) {
                return col
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    inputType: col.dataIndex === 'diagnoses' ? 'option' : 'text',
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record),
                }),
            }
        })

        return (
            <div>
                {isFetching && <Spin size='large' />}
                {!isFetching &&
                    <EditableContext.Provider value={this.props.form}>
                        <Table
                            components={components}
                            bordered
                            dataSource={concat(primaryCitizens, otherCitizens)}
                            columns={columns}
                            rowClassName='editable-row'
                            pagination={{
                                onChange: this.cancel,
                            }}
                        />
                    </EditableContext.Provider>
                }
            </div>
        )
    }
}

const EditableFormTable = Form.create()(EditableTable)
export default EditableFormTable
