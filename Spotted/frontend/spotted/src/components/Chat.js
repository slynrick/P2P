import '../styles/Chat.css';
import React from 'react'
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from "@material-ui/core/IconButton";
import SendIcon from '@material-ui/icons/SendRounded';
// import AttIcon from '@material-ui/icons/AttachFileRounded';
import { withStyles } from "@material-ui/core/styles";
import Messages from './Messages'
// import Input from '@mui/material/Input';
import { styled } from '@mui/material/styles';

import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import ChatIcon from '@material-ui/icons/ChatRounded';
import BlockedIcon from '@material-ui/icons/BlockRounded';
import GenerateIcon from '@material-ui/icons/CreateRounded';
import UpdateIcon from '@material-ui/icons/SyncRounded';
import PhotoCamera from '@material-ui/icons/PhotoCamera';

const styles = {
    input: {
      color: "white"

    }
};

const Input = styled('input')({
  display: 'none',
});

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {remoteAddress: "", message: "", imageFile: "", image: ""};

    this.syncChain = this.syncChain.bind(this);
    this.generateKeys = this.generateKeys.bind(this);
    this.handlePvtKeyChange = this.handlePvtKeyChange.bind(this);
    this.handlePubKeyChange = this.handlePubKeyChange.bind(this);
    this.convertBase64 = this.convertBase64.bind(this);
    this.handleFileRead = this.handleFileRead.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleRemoteAddressChange = this.handleRemoteAddressChange.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  syncChain() {
    if (this.state.remoteAddress === "")
      return;
    fetch('/freechains/peer/recv/' +  this.state.remoteAddress + '/%23' + this.props.chain.replace("#", ""))
      .then(response => response.json())
      .then(json_recv => {
        console.log(json_recv);
        fetch('/freechains/peer/send/' +  this.state.remoteAddress + '/%23' + this.props.chain.replace("#", ""))
          .then(response => response.json())
          .then(json_send => {
            console.log(json_send);
            this.props.readMessages(this.props.chain, this.props.selectedMode);
        });
    });
  }

  generateKeys() {
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

  convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        resolve(fileReader.result);
      }
      fileReader.onerror = (error) => {
        reject(error);
      }
    })
  }

  handleFileRead = async (event) => {
    const file = event.target.files[0];
    const base64 = await this.convertBase64(file);
    this.setState({imageFile: file.name, image: base64});
  }

  handleMessageChange = async (event) => {
    this.setState({message: event.target.value});
  }

  handleRemoteAddressChange = async (event) => {
    this.setState({remoteAddress: event.target.value});
  }

  sendMessage = () => {
    if (this.state.image.length + this.state.message.length > 127000) {
      alert("Mensagem não pode exceder 127Kb");
      return;
    }
    var message = JSON.stringify({"message": this.state.message, "image": this.state.image});
    fetch('/freechains/chain/post/%23' + this.props.chain.replace("#", ""), {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({"payload": message, "sign": this.props.currentUser.pvtKey})
    }).then(response => response.json())
      .then(json => {
        this.props.readMessages(this.props.chain, this.props.selectedMode);
    });
    
    
  }

  render() {
    const { classes } = this.props;
    return (
      <div className="Chat">
        <div className="text-chat">
            <Messages chain={this.props.chain} selectedMode={this.props.selectedMode} messages={this.props.messages} currentUser={this.props.currentUser} readMessages={this.props.readMessages}/>
        </div>
        <div className="conf-chat">
          <TextField 
            className="pubpvt-key" 
            id="standard-basic1" 
            label={"PublicKey [" + this.props.currentUser.reps + "]"}
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
            value={this.state.remoteAddress} 
            onChange={this.handleRemoteAddressChange}
            InputLabelProps={{style : {color : 'white'} }}
            InputProps={{
            className: classes.input
            }}/>
          <IconButton
            onClick={this.syncChain}
          >
            <UpdateIcon style={{ color: 'white' }}/>
          </IconButton>
        </div>
        <TextField
          className="send-chat"
          id="filled-multiline-flexible"
          label={this.state.imageFile !== "" ? "Message [img: " + this.state.imageFile + "]" : "Message"}
          onChange={this.handleMessageChange}
          multiline
          minRows={4}
          maxRows={4}
          variant="filled"
          InputLabelProps={{style : {color : 'white'} }}
          InputProps={{
            className: classes.input,
            endAdornment: (
                <InputAdornment position="end">
                  <label htmlFor="icon-button-file">
                    <Input accept="image/*" id="icon-button-file" type="file" onChange={e => this.handleFileRead(e)}/>
                    <IconButton color="primary" aria-label="upload picture" component="span">
                      <PhotoCamera style={{ color: 'white' }}/>
                    </IconButton>
                  </label>
                  <IconButton
                    onClick={this.sendMessage}
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
