import React, { Component } from "react";
import { inject, observer } from "mobx-react"
import { PageHeader, Input, Row, Col, Button, Alert, Table, InputNumber, Popconfirm, Form } from "antd";
import moment from "moment";
import "moment/locale/da";


@inject("citizensStore")
@observer
export default class EditCitizen extends Component {
    constructor(props) {
        super(props);
        this.getCitizen = (id) => this.props.citizensStore.fetchCitizen(id);
    }

    state = {
        name: "",
        address: "",
        city: "",
        zip: "",
        phoneNumber: "",
        diagnoses: [],
        saved: false,
        deleted: false
    };

    onChangeHandler = (param) => (e) => {
        this.setState({ [param]: e.target.value })
    }

    handleDiagnoses = (param) => (e) => {
        const diagnoseArray = (e.target.value).replace(/\s/g, '').split(',')
        this.setState({ [param]: diagnoseArray })
    }

    handleDelete = () => {
        const { citizen } = this.props.citizensStore;
        this.props.citizensStore.deleteCitizen(citizen.id)
        this.setState({ deleted: true })
    }

    handleSubmit = () => {
        const { citizen } = this.props.citizensStore;
        const updatedCitizen = {
            id: citizen.id,
            name: (this.state.name != "") ? this.state.name : citizen.name,
            address: (this.state.address != "") ? this.state.address : citizen.address,
            city: (this.state.city != "") ? this.state.city : citizen.city,
            zip: (this.state.zip != "") ? this.state.zip : citizen.zip,
            phoneNumber: (this.state.phoneNumber != "") ? this.state.phoneNumber : citizen.phoneNumber,
            diagnoses: (this.state.diagnoses != "") ? this.state.diagnoses : citizen.diagnoses,
        }
        this.props.citizensStore.updateCitizen(updatedCitizen)
        this.setState({ saved: true })
    }

    componentWillMount() {
        const {
            match: { params }, citizensStore
        } = this.props;
        this.getCitizen(params.id)
    }

    render() {
        const { citizensStore } = this.props
        const { citizen, isFetching } = citizensStore
        const { saved, deleted } = this.state
        return (<div>
            {saved &&
                <div>
                    <PageHeader
                        onBack={() => history.back()}
                        title="Redigér borger"
                        subTitle="- Udfyld ændringer og gem" />
                    <Alert message="Ændringerne er nu blevet gemt!" type="success" />
                </div>
            }
            {deleted &&
                <div>
                    <PageHeader
                        onBack={() => history.back()}
                        title="Redigér borger"
                        subTitle="- Udfyld ændringer og gem" />
                    <Alert message="Borgeren er nu arkiveret" type="error" />
                </div>
            }
            {!isFetching && !saved && !deleted &&
                <div>
                    <PageHeader
                        onBack={() => history.back()}
                        title="Redigér borger"
                        subTitle="- Udfyld ændringer og gem" />

                    <Row gutter={16}>
                        <Col span={8}><Input defaultValue={citizen.name} onChange={this.onChangeHandler('name')} /></Col>
                        <Col span={8}><Input key="address" defaultValue={citizen.address} onChange={this.onChangeHandler('address')} /></Col>
                        <Col span={8}><Input key="city" defaultValue={citizen.city} onChange={this.onChangeHandler('city')} /></Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={8}><Input key="zip" defaultValue={citizen.zip} onChange={this.onChangeHandler('zip')} /></Col>
                        <Col span={8}><Input key="phoneNumber" defaultValue={citizen.phoneNumber} onChange={this.onChangeHandler('phoneNumber')} /></Col>
                        <Col span={8}><Input key="diagnoses" defaultValue={citizen.diagnoses} onChange={this.handleDiagnoses('diagnoses')} /></Col>
                    </Row>
                    <Button type="primary" onClick={this.handleSubmit}>Gem ændringer</Button>
                    <Button type="danger" onClick={this.handleDelete}>Arkivér borger</Button>
                </div>
            }
        </div>)
    }
}