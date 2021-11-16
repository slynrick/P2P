import '../styles/Messages.css';
import React from 'react'
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';

import Message from './Message'

class Messages extends React.Component {
  // constructor(props) {
  //   super(props);
    
  // }

  render() {
    return (
    <List className="Messages">
        {this.props.messages.map((hash, index) => (
            <div key={index}>
                <Message blockHash={hash} chain={this.props.chain} currentUser={this.props.currentUser} readMessages={this.props.readMessages}/>
                <Divider/>
            </div> 
        ))}
    </List>
    
    );
  }
}

export default Messages;
