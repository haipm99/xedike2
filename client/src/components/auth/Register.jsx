import React, { Component } from 'react';
import axios from 'axios';
import { Button, Form, FormGroup, Label, Input} from 'reactstrap';
import {connect} from 'react-redux';
import {register} from '../../action/auth';
class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            password2: '',
            fullname: '',
            phone: '',
            DOB: '',
        }
    }
    onChange = (e) =>{
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    onSubmit = (e) =>{
        e.preventDefault();
        this.props.register(this.state);
    }
    render() {
        return (
            <Form style={{width:"500px",margin:"auto"}} onSubmit ={this.onSubmit}>
            <h2>Register</h2>
        <FormGroup>
          <Label for="exampleEmail">Email</Label>
          <Input type="text" name="email" id="email" placeholder="with a placeholder" onChange = {this.onChange} />
        </FormGroup>
        <FormGroup>
          <Label for="examplePassword">Password</Label>
          <Input type="password" name="password" id="password" placeholder="password placeholder" />
        </FormGroup>
        <FormGroup>
          <Label for="exampleEmail">Fullname</Label>
          <Input type="text" name="fullname" id="fullname" placeholder="with a placeholder" onChange = {this.onChange} />
        </FormGroup>
        <FormGroup>
          <Label for="exampleEmail">Phone</Label>
          <Input type="text" name="phone" id="phone" placeholder="with a placeholder" onChange = {this.onChange} />
        </FormGroup>
        <FormGroup>
          <Label for="exampleEmail">DOB:</Label>
          <Input type="text" name="DOB" id="dob" placeholder="with a placeholder" onChange = {this.onChange} />
        </FormGroup>
        <FormGroup>
          <Label for="exampleEmail">User Type:</Label>
          <Input type="text" name="userType" id="userType" placeholder="with a placeholder" onChange = {this.onChange} />
        </FormGroup>
        <Button>Submit</Button>
      </Form>
        );
    }
}
export default connect(null,{register})(Register);