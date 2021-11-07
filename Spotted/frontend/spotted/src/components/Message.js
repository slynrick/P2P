import '../styles/Message.css';
import React from 'react'
import Badge from '@mui/material/Badge';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@material-ui/icons/Person';
import IconButton from "@material-ui/core/IconButton";
import Like from '@material-ui/icons/ThumbUpAltRounded';
import Dislike from '@material-ui/icons/ThumbDownAltRounded';
import Typography from '@mui/material/Typography';

class Message extends React.Component {
  constructor(props) {
    super(props);

    this.state = {image: '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'}
  }

  render() {
    return (
      <div className="Message">
        <ListItem alignItems="flex-start">
            <ListItemAvatar>
                <Avatar style={{ color: 'white' }}/>
            </ListItemAvatar>
            <ListItemText className="MessageText"
                primary="Brunch this weekend?"
                secondary={
                    <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="white"
                    >
                        Ali Connors
                    <img src={`data:image/jpeg;base64,${this.state.image}`}  alt="img"></img>
                    </Typography>
                }
            />
            
            <IconButton
                //aria-label="toggle password visibility"
                //onClick={handleClickShowPassword}
                //onMouseDown={handleMouseDownPassword}
                //edge="end"
                >
                <Badge badgeContent={1200} color="primary" max={9999} 
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}>
                    <Like style={{ color: 'white' }}/>
                </Badge>
            </IconButton>
            <IconButton
                //aria-label="toggle password visibility"
                //onClick={handleClickShowPassword}
                //onMouseDown={handleMouseDownPassword}
                //edge="end"
                >
                <Badge badgeContent={1200} color="primary" max={9999}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}>
                    <Dislike style={{ color: 'white' }}/>
                </Badge>
            </IconButton>
        </ListItem>
      </div>
    );
  }
}

export default Message;
