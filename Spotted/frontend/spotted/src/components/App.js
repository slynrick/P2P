import '../styles/App.css';
import React from 'react'
import AppBar from './Navbar'
import AppChat from './Chat'



class App extends React.Component {
  constructor(props) {
    super(props);
    // Não chame this.setState() aqui!
    this.state = {chains:[], selectedChain: "", selectedMode: "Messages", pubKey: "", pvtKey: "", messages: []};

    this.addChain = this.addChain.bind(this);
    this.selectChain = this.selectChain.bind(this);
    this.getAllChains = this.getAllChains.bind(this);
    this.selectMode = this.selectMode.bind(this);
    this.readAllMessagesFromSelectedChain = this.readAllMessagesFromSelectedChain.bind(this);
    this.readAllBlockedMessagesFromSelectedChain = this.readAllBlockedMessagesFromSelectedChain.bind(this);
    this.readMessages = this.readMessages.bind(this);
  }

  readAllMessagesFromSelectedChain(chainName) {
    if(chainName.length <= 0)
        return;
    fetch('/freechains/chain/consensus/%23' + chainName.replace("#", ""))
      .then(response => response.json())
      .then(json => {
        this.setState({selectedChain: chainName, messages: json['data'] === "" ? [] : json['data'].split(" ").reverse()});
    });
  
  }

  readAllBlockedMessagesFromSelectedChain(chainName) {
    if(chainName.length <= 0)
        return;
    fetch('/freechains/chain/heads/%23' + chainName.replace("#", "") + "/blocked")
        .then(response => response.json())
        .then(json => {
          this.setState({selectedChain: chainName, messages: json['data'] === "" ? [] : json['data'].split(" ")});
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

  selectChain(chainName) {
    this.readMessages(chainName);
  }

  readMessages(chainName) {
    if(this.state.selectedMode === "Messages") {
      this.readAllMessagesFromSelectedChain(chainName);
    } else if (this.state.selectedMode === "Blocked") {
        this.readAllBlockedMessagesFromSelectedChain(chainName);
    }
  }

  selectMode(mode) {
    this.setState({ selectedMode: mode });
    this.readMessages(this.state.selectedChain);
  }

  getAllChains() {
    fetch('/freechains/chains/list')
      .then(response => response.json())
      .then(json => {
        var chains = json["data"].split(' ');
        this.setState({ chains: chains });
    });
  }
  
  componentDidMount() {
    this.getAllChains();
  }

  handlePvtKeyChange = (value) => {
    this.setState({
      pvtKey: value,
    });
  };

  handlePubKeyChange = (value) => {
    this.setState({
      pubKey: value,
    });
  };

  render() {
    return (
      <div className="App">
        <AppBar chains={this.state.chains} addChain={this.addChain} selectChain={this.selectChain}/>
        <AppChat chain={this.state.selectedChain} selectedMode={this.state.selectedMode} selectMode={this.selectMode} messages={this.state.messages} readMessages={this.readMessages}
                 currentUser={{pubKey: this.state.pubKey, pvtKey: this.state.pvtKey}} handlePvtKeyChange={this.handlePvtKeyChange} handlePubKeyChange={this.handlePubKeyChange}/>
      </div>
    );
  }
}

export default App;
