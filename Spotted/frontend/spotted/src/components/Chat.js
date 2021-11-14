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
    this.state = {pubKey:"", pvtKey: "", remoteAddress: ""};

    this.generateKeys = this.generateKeys.bind(this);
  }

  generateKeys() {
    var crypto = require("crypto");
    var id = crypto.randomBytes(32).toString('hex');
    fetch('/freechains/crypto/pubpvt', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"passphrase": id})
    }).then(response => response.json())
      .then(json => {
        console.log(json);
        // this.setState({ selectedChain: "#" + chainName });
      });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className="Chat">
        <div className="text-chat">
            <Messages chain={this.props.chain} selectedMode={this.props.selectedMode}/>
        </div>
        <div className="conf-chat">
          <TextField className="pubpvt-key" id="standard-basic1" label="PublicKey"  variant="filled" InputLabelProps={{style : {color : 'white', left:0} }}/>
          <TextField className="pubpvt-key" id="standard-basic2" label="PrivateKey" variant="filled" InputLabelProps={{style : {color : 'white'} }}/>
          <IconButton
            onClick={this.generateKeys}
          >
            <GenerateIcon style={{ color: 'white' }}/>
          </IconButton>
        </div>
        <div className="conf-chat">
          <TextField className="remote-address" id="standard-basic3" label="Remote"     variant="filled" InputLabelProps={{style : {color : 'white'} }}/>
          <IconButton
            //onClick={handleClickShowPassword}
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
