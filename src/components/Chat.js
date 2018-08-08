import React, { Component } from 'react';
import io from 'socket.io-client';
import SetUsername from './SetUsername';
import UserList from './UserList';
import MessageBox from './MessageBox';
import Tabs from './Tabs';
import Composer from './Composer';


class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
        userInput: '',
        userName: '',
        socketId: '',
        messages: [],
        users: [],
    };
  }

  componentDidMount(){
        this.socket = io('http://localhost:3010'); // Remove when not running two servers

        this.socket.on('message', (message) => {
            this.setState({messages: [message, ...this.state.messages]})
        })

        this.socket.on('users', users => {
            users = users.map( user => {
                user.selected = false;
                return user;
            })
            this.setState({
                users: users
            })
        })

        this.socket.on('id', socketId => {
            console.log('id: ' + socketId)
            this.setState({ socketId })
        })
    }

    componentWillUnmount(){
        this.socket.disconnect();
    }

    handleInput = ({target:{value, name}}) => {
        this.setState({
            [name]: value
        })
    }

    userSubmit = (e) => {
        e.preventDefault();
        this.setState({
            userName: this.state.userInput
        })
    }

    handleNewMessage = (sentMessage) => {
        const {messages} = this.state
        this.setState({
            messages: [sentMessage, ...messages],
        })
    }

    setUser = (e) => {
        e.preventDefault();
        const {userInput} = this.state
        this.setState({
            userInput: '',
            userName: userInput
        })
        this.socket.emit('username', userInput) 
    }

    // toggleSelected = (id) => {
    //     const newUsers = this.state.users.map( user => {
    //         if(user.id === id) user.selected = !user.selected;
    //         return user;
    //     })
    //     this.setState({users: newUsers})
    // }

    // updateRoom = (bool) => {
    //     this.setState({tabSecret: bool})
    // }

    // joinRoom = () => {
    //     const {joinedSecret} = this.state
    //     if(!joinedSecret){
    //         this.socket.emit('join', 'secret')
    //     } else {
    //         this.socket.emit('leave', 'secret')
    //     }
    //     this.setState({
    //         joinedSecret: !joinedSecret
    //     })
    // }

    render() {
        return (
            <div>
                { !this.state.userName && 
                <SetUsername 
                    updateUser={this.handleUserInput}
                    handleInput={this.handleInput}
                    userName={this.state.userInput}
                    setUser={this.setUser}
                /> 
                }
                
                <div className="chat-upper">
                    <div className="chat-sidebar">
                        <UserList 
                            user={this.state.userName}
                            users={this.state.users}
                            socketId={this.state.socketId}
                            selectItem={this.toggleSelected}
                        />
                    </div>
                    <MessageBox 
                        messages={this.state.messages}
                    />
                    <Composer 
                        userName={this.state.userName}
                        updateMessages={this.handleNewMessage}
                        socket={this.socket}
                    />
                </div>
            </div>
    )
  }
}

export default Chat;
