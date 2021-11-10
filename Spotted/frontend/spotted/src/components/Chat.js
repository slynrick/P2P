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

const styles = {
    input: {
      color: "white"

    }
  };

class Chat extends React.Component {
//   constructor(props) {
//     super(props);
//     // Não chame this.setState() aqui!
//   }

  render() {
    const { classes } = this.props;
    return (
      <div className="Chat">
        <div className="text-chat">
            <Messages chain={this.props.chain} selectedMode={this.props.selectedMode}/>
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
