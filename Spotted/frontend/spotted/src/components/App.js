import '../styles/App.css';
import React from 'react'
import AppBar from './Navbar'
import AppChat from './Chat'



class App extends React.Component {
  constructor(props) {
    super(props);
    // Não chame this.setState() aqui!
    this.state = {chains:[], selectedChain: "", selectedMode: "Messages", userReps:0, pubKey: "", pvtKey: "", messages: []};

    this.addChain = this.addChain.bind(this);
    this.removeChain = this.removeChain.bind(this);
    this.selectChain = this.selectChain.bind(this);
    this.getAllChains = this.getAllChains.bind(this);
    this.selectMode = this.selectMode.bind(this);
    this.readAllMessagesFromSelectedChain = this.readAllMessagesFromSelectedChain.bind(this);
    this.readAllBlockedMessagesFromSelectedChain = this.readAllBlockedMessagesFromSelectedChain.bind(this);
    this.readMessages = this.readMessages.bind(this);
    this.getUserRepsInfo = this.getUserRepsInfo.bind(this); 
    this.handlePvtKeyChange = this.handlePvtKeyChange.bind(this);
    this.handlePubKeyChange = this.handlePubKeyChange.bind(this);
  }

  readAllMessagesFromSelectedChain(chainName, mode) {
    if(chainName.length <= 0)
        return;
    fetch('/freechains/chain/consensus/%23' + chainName.replace("#", ""))
      .then(response => response.json())
      .then(json => {
        this.setState({selectedChain: chainName, selectedMode: mode, messages: json['data'] === "" ? [] : json['data'].split(" ").reverse()});
    });
  
  }

  readAllBlockedMessagesFromSelectedChain(chainName, mode) {
    if(chainName.length <= 0)
        return;
    fetch('/freechains/chain/heads/%23' + chainName.replace("#", "") + "/blocked")
        .then(response => response.json())
        .then(json => {
          this.setState({selectedChain: chainName, selectedMode: mode, messages: json['data'] === "" ? [] : json['data'].split(" ")});
    });
  }

  addChain(chainName) {
    if (this.state.pubKey === "") return;
    fetch('/freechains/chains/join/%23' + chainName, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({shared: this.state.pubKey})
    }).then(response => response.json())
      .then(json => {
        this.setState({ selectedChain: "#" + chainName });
        this.getAllChains();
      });  
  
  }

  removeChain(chainName) {
    fetch('/freechains/chains/leave/%23' + chainName, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "GET",
    }).then(response => response.json())
      .then(json => {
        this.getAllChains();
      });  
  
  }

  selectChain(chainName) {
    this.readMessages(chainName, this.state.selectedMode);
  }

  readMessages(chainName, mode) {
    if(mode === "Messages") {
      this.readAllMessagesFromSelectedChain(chainName, mode);
    } else if (mode === "Blocked") {
        this.readAllBlockedMessagesFromSelectedChain(chainName, mode);
    }
    this.getUserRepsInfo(this.state.pubKey);
  }

  selectMode(mode) {
    this.readMessages(this.state.selectedChain, mode);
  }

  getAllChains() {
    fetch('/freechains/chains/list')
      .then(response => response.json())
      .then(json => {
        var chains = json["data"].split(' ');
        var selectedChain = chains.length > 0 ? chains[0] : "";
        this.setState({ chains: chains, selectedChain: selectedChain});
    });
  }
  
  componentDidMount() {
    this.getAllChains();
  }

  handlePvtKeyChange = (value) => {
    this.setState({
      pvtKey: value === undefined ? "" : value,
    });
  };

  handlePubKeyChange = (value) => {
    this.setState({
      pubKey: value === undefined ? "" : value,
    });
    this.getUserRepsInfo(value);
  };

  getUserRepsInfo(value) {
    if (value === "") return;
    fetch('/freechains/chain/reps/%23' + this.state.selectedChain.replace("#", "") + "/" + value, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "GET"
    }).then(response => response.json())
      .then(json => {
        console.log(json);
        this.setState({userReps: parseInt(json['data'])});
      });
  }

  render() {
    return (
      <div className="App">
        <AppBar chains={this.state.chains} addChain={this.addChain} removeChain={this.removeChain} selectChain={this.selectChain}/>
        <AppChat chain={this.state.selectedChain} selectedMode={this.state.selectedMode} selectMode={this.selectMode} messages={this.state.messages} readMessages={this.readMessages}
                 currentUser={{pubKey: this.state.pubKey, pvtKey: this.state.pvtKey, reps: this.state.userReps}} handlePvtKeyChange={this.handlePvtKeyChange} handlePubKeyChange={this.handlePubKeyChange}/>
      </div>
    );
  }
}

export default App;
