import React , { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import axios from 'axios';
import Child from './EditForm';

class Dashboard extends Component {
  constructor(props)
  {
        super(props);
        this.state = { item: {}, isHidden: true};
        this.onDeleteClick.bind(this);

        this.onEditClick.bind(this);
        this.toggleHidden.bind(this);

  }
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
    
  };
  toggleHidden () {
    this.setState({
      isHidden: !this.state.isHidden
    })
  }

  onEditClick = e => {
    this.toggleHidden ();
    
  };
  onDeleteClick = e => {
    axios.delete("/api/users").then(res=>{
      console.log(res.data);
      this.props.logoutUser();
    });
    
  };


  componentDidUpdate(){
    axios.defaults.headers.common['Authorization'] = localStorage.getItem("jwtToken");
    axios.get("/api/users").then(res=>{
        console.log(res.data);
        
        this.setState({ item: res.data})
      });

  }

  componentDidMount(){
    axios.defaults.headers.common['Authorization'] = localStorage.getItem("jwtToken");
    axios.get("/api/users").then(res=>{
        console.log(res.data);
        
        this.setState({ item: res.data})
      });

  }
  

  render() {
    // console.log(this.props.auth);
    // console.log(localStorage.getItem("jwtToken"));
    const { user } = this.props.auth;

    return (
      <div className="App">
      <h1>Hello {user.name}</h1>
      <button onClick={this.onLogoutClick} class="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                >
                   Log out
                </button>
        <table id="t1">
          <tr>
            <th>Attribute</th>
            <th>Value</th>
          </tr>
          <tr>
            <td>Username</td>
            <td>{this.state.item.name}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>{this.state.item.email}</td>
          </tr>
          <tr>
            <td>Address</td>
            <td>{this.state.item.address}</td>
          </tr>
          <tr>
            <td>
              <button onClick={this.onEditClick}
                style={{
                  backgroundColor: "lightblue",
                  height: "30px",
                  width: "70px",
                  borderRadius: "15px"
                }}
              >
                Edit
              </button>
            </td>
            <td>
              <button onClick={this.onDeleteClick}
                style={{
                  backgroundColor: "red",
                  height: "30px",
                  width: "70px",
                  borderRadius: "15px",
                  margin: "10px",
                  color: "white"
                }}
              >
                delete
              </button>
            </td>
          </tr>
        </table>
        {!this.state.isHidden && <Child user={this.state.item} />}
        
        

        <br></br>
        <br></br>
        
        
      
    </div>
    );
  }
}

Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Dashboard);
