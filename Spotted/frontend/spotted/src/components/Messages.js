import '../styles/Messages.css';
import React from 'react'
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';

import Message from './Message'

class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {messages: [1,2,3,2,1,2,3,1,1,2,1,3,12,1,3,1,2]}

    this.readAllMessagesFromSelectedChain = this.readAllMessagesFromSelectedChain.bind(this);
    this.readAllBlockedMessagesFromSelectedChain = this.readAllBlockedMessagesFromSelectedChain.bind(this);
  }

  readAllMessagesFromSelectedChain() {
    // if(this.props.chain.length <= 0)
    //     return;
    // fetch('/freechains/chain/consensus/%23' + this.props.chain.replace("#", ""))
    //     .then(response => response.json())
    //     .then(json => {
    //       console.log(json);
    //     });
  
  }

  readAllBlockedMessagesFromSelectedChain() {
    // if(this.props.chain.length <= 0)
    //     return;
    // fetch('/freechains/chain/heads/%23' + this.props.chain.replace("#", "") + "/blocked")
    //     .then(response => response.json())
    //     .then(json => {
    //       console.log(json);
    //     });
  }

  // componentDidUpdate() {
  //   if(this.props.selectedMode === "Messages") {
  //       this.readAllMessagesFromSelectedChain();
  //   } else if (this.props.selectedMode === "Blocked") {
  //       this.readAllBlockedMessagesFromSelectedChain();
  //   }
  // }


  render() {
    return (
    <List className="Messages">
        {this.state.messages.map((text, index) => (
            <div>
                <Message key={index} chain={this.props.chain} />
                <Divider/>
            </div> 
        ))}
    </List>
    
    );
  }
}

export default Messages;
