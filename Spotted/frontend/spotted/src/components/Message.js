import '../styles/Message.css';
import React from 'react'
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Badge from '@mui/material/Badge';
import Avatar from '@material-ui/icons/Person';
import IconButton from "@material-ui/core/IconButton";
import Like from '@material-ui/icons/ThumbUpAltRounded';
import Dislike from '@material-ui/icons/ThumbDownAltRounded';
import Typography from '@mui/material/Typography';
import RepsIcon from '@material-ui/icons/FavoriteRounded';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';


class Message extends React.Component {
  constructor(props) {
    super(props);

    this.state = {first: true, message: "", image: "", userReps: 0, reps: 0, like: false, backs: "", time: -1, signed: ""}

    this.likeMessage = this.likeMessage.bind(this);
    this.dislikeMessage = this.dislikeMessage.bind(this);
    this.getBlockInfo = this.getBlockInfo.bind(this);
    this.getPayloadInfo = this.getPayloadInfo.bind(this);
    this.getRepsInfo = this.getRepsInfo.bind(this);
    this.getUserRepsInfo = this.getUserRepsInfo.bind(this);
  }

  likeMessage() {
    fetch('/freechains/chain/like/%23' + this.props.chain.replace("#", "") + "/" + this.props.blockHash, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({sign: this.props.currentUser.pvtKey})
    }).then(response => response.json())
      .then(json => {
        this.props.readMessages(this.props.chain, this.props.selectedMode);
      });
  }

  dislikeMessage() {
    fetch('/freechains/chain/dislike/%23' + this.props.chain.replace("#", "") + "/" + this.props.blockHash, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({sign: this.props.currentUser.pvtKey})
    }).then(response => response.json())
      .then(json => {
        this.props.readMessages(this.props.chain, this.props.selectedMode);
      });
  }

  getBlockInfo() {
    fetch('/freechains/chain/get/%23' + this.props.chain.replace("#", "") + "/block/" + this.props.blockHash, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({decript: ""})
    }).then(response => response.json())
      .then(json => {
        var pub = json['data']['sign'] == null ? "Anon" : json['data']['sign']['pub'];
        var secs = json['data']['time'] === 0 ? "Origin" : json['data']['time'] / 1000
        var d = new Date(0);
        d.setUTCSeconds(secs);
        this.setState({like: json['data']['like'] == null ? "" : json['data']['like']['hash'] , backs: json['data']['backs'].join(" "), time: secs === "Origin" ? secs : d, signed: pub});
        this.getUserRepsInfo();
    });
  }

  getPayloadInfo() {
    fetch('/freechains/chain/get/%23' + this.props.chain.replace("#", "") + "/payload/" + this.props.blockHash, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({decript: ""})
    }).then(response => response.json())
      .then(json => {
        if (json['data'] !== "") {
          this.setState({message: json['data']['message'], image: json['data']['image']});
        } else {
          this.setState({message: "", image: ""});
        }
    });
  }

  getRepsInfo() {
    fetch('/freechains/chain/reps/%23' + this.props.chain.replace("#", "") + "/" + this.props.blockHash, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "GET"
    }).then(response => response.json())
      .then(json => {
        this.setState({reps: parseInt(json['data'])});
      });
  }

  getUserRepsInfo() {
    if (this.state.signed === "Anon" || this.state.signed === "") return;
    fetch('/freechains/chain/reps/%23' + this.props.chain.replace("#", "") + "/" + this.state.signed, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "GET"
    }).then(response => response.json())
      .then(json => {
        this.setState({userReps: parseInt(json['data'])});
      });
  }

  componentDidMount() {
    this.getBlockInfo();
    this.getPayloadInfo();
    this.getRepsInfo();
  }

  componentDidUpdate(prevProps) {
    if(this.state.first || this.props.chain !== prevProps.chain || this.props.blockHash !== prevProps.blockHash)
    {
      this.getBlockInfo();
      this.getPayloadInfo();
      this.getRepsInfo();
      this.setState({first: false});
    }
    
  }

  render() {
    return (
      <div className="Message">
        <ListItem key={this.props.blockHash} alignItems="flex-start">
            <ListItemAvatar>
              <Tooltip title={this.state.signed + '   [' + this.state.userReps + ' reps]'}>
              <Avatar style={{ color: 'white' }}/>
              </Tooltip>
            </ListItemAvatar>
            <ListItemText className="MessageText"
                primary={this.state.time + ' '  + this.props.blockHash}
                secondary={
                    <Typography
                        sx={{display: 'inline' }}
                        component="span"
                        variant="body"
                        color="white"
                    >
                      {this.state.message === "" ? <div></div> : <div><Divider ><Chip label="Message" style={{ color: 'white' }}/></Divider></div> }
                      {this.state.like === "" ? this.state.message : 'Liked ' + this.state.like}
                      {this.state.image === "" ? <div></div> : <div><Divider ><Chip label="Image" style={{ color: 'white' }}/></Divider><img src={this.state.image}  alt="img"></img></div>}
                    </Typography>
                }
            />
            <IconButton>
              <Badge color="secondary" badgeContent={this.state.reps} max={999}>
                <RepsIcon style={{ color: 'white' }}/>
              </Badge>
            </IconButton>
            <IconButton onClick={this.likeMessage}>
              <Like style={{ color: 'white' }}/>
            </IconButton>
            <IconButton onClick={this.dislikeMessage} >
              <Dislike style={{ color: 'white' }}/>
            </IconButton>
        </ListItem>
      </div>
    );
  }
}

export default Message;
