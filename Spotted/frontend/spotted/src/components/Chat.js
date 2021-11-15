import '../styles/Chat.css';
import React from 'react'
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from "@material-ui/core/IconButton";
import SendIcon from '@material-ui/icons/SendRounded';
import AttIcon from '@material-ui/icons/AttachFileRounded';
import { withStyles } from "@material-ui/core/styles";
import Messages from './Messages'

import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import ChatIcon from '@material-ui/icons/ChatRounded';
import BlockedIcon from '@material-ui/icons/BlockRounded';
import GenerateIcon from '@material-ui/icons/CreateRounded';
import UpdateIcon from '@material-ui/icons/SyncRounded';

const styles = {
    input: {
      color: "white"

    }
  };

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {remoteAddress: ""};

    this.syncChain = this.syncChain.bind(this);
    this.generateKeys = this.generateKeys.bind(this);
    this.handlePvtKeyChange = this.handlePvtKeyChange.bind(this);
    this.handlePubKeyChange = this.handlePubKeyChange.bind(this);
  }

  syncChain() {
    if (this.state.remoteAddress === "")
      return;
    fetch('/freechains/peer/recv/' +  this.state.remoteAddress + '/%23' + this.props.chain)
      .then(response => response.json())
      .then(json_recv => {
        console.log(json_recv);
        fetch('/freechains/peer/send/' +  this.state.remoteAddress + '/%23' + this.props.chain)
          .then(response => response.json())
          .then(json_send => {
            console.log(json_send);
        });
    });
  }

  generateKeys() {
    console.log("keys");
    var crypto = require("crypto");
    var id = crypto.randomBytes(32).toString('hex');
    fetch('/freechains/crypto/pubpvt', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({"passphrase": id})
    }).then(response => response.json())
      .then(json => {
        var keys = json['data'].split(" ");
        console.log(keys);
        this.props.handlePubKeyChange(keys[0]);
        this.props.handlePvtKeyChange(keys[1]);
      });
  }

  handlePvtKeyChange = (event) => {
    this.props.handlePvtKeyChange(event.target.value);
  };

  handlePubKeyChange = (event) => {
    this.props.handlePubKeyChange(event.target.value);
  };

  render() {
    const { classes } = this.props;
    return (
      <div className="Chat">
        <div className="text-chat">
            <Messages chain={this.props.chain} selectedMode={this.props.selectedMode}/>
        </div>
        <div className="conf-chat">
          <TextField 
            className="pubpvt-key" 
            id="standard-basic1" 
            label="PublicKey"  
            variant="filled" 
            value={this.props.currentUser.pubKey} 
            onChange={this.handlePubKeyChange}
            InputLabelProps={{style : {color : 'white', left:0} }}
            InputProps={{
            className: classes.input
            }}
          />
          <TextField 
            className="pubpvt-key" 
            id="standard-basic2" 
            label="PrivateKey" 
            variant="filled" 
            value={this.props.currentUser.pvtKey} 
            onChange={this.handlePvtKeyChange}
            InputLabelProps={{style : {color : 'white'} }}
            InputProps={{
            className: classes.input
            }}
          />
          <IconButton
            onClick={this.generateKeys}
          >
            <GenerateIcon style={{ color: 'white' }}/>
          </IconButton>
        </div>
        <div className="conf-chat">
          <TextField 
            className="remote-address" 
            id="standard-basic3" 
            label="Remote"     
            variant="filled" 
            InputLabelProps={{style : {color : 'white'} }}/>
          <IconButton
            onClick={this.syncChain}
          >
            <UpdateIcon style={{ color: 'white' }}/>
          </IconButton>
        </div>
        <TextField
          className="send-chat"
          id="filled-multiline-flexible"
          label="Message"
          multiline
          minRows={4}
          maxRows={4}
          variant="filled"
          InputLabelProps={{style : {color : 'white'} }}
          InputProps={{
            className: classes.input,
            endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    //aria-label="toggle password visibility"
                    //onClick={handleClickShowPassword}
                    //onMouseDown={handleMouseDownPassword}
                    //edge="end"
                  >
                    <AttIcon style={{ color: 'white' }}/>
                  </IconButton>
                  <IconButton
                    //aria-label="toggle password visibility"
                    //onClick={handleClickShowPassword}
                    //onMouseDown={handleMouseDownPassword}
                    //edge="end"
                  >
                    <SendIcon style={{ color: 'white' }}/>
                  </IconButton>
                </InputAdornment>
             )
          }}
        />
        <BottomNavigation className="bottom-toolbar" showLabels
            value={this.props.selectedMode}
            onChange={(event, newValue) => {
            this.props.selectMode(newValue);
        }}>
            <BottomNavigationAction style={{ color: 'white' }}
                label="Messages"
                value="Messages"
                icon={<ChatIcon style={{ color: 'white' }}/>}
            />
            <BottomNavigationAction style={{ color: 'white' }}
                label="Blocked"
                value="Blocked"
                icon={<BlockedIcon style={{ color: 'white' }}/>}
            />
        </BottomNavigation>
      </div>
    );
  }
}

export default withStyles(styles)(Chat);
