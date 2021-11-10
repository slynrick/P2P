import '../styles/App.css';
import React from 'react'
import AppBar from './Navbar'
import AppChat from './Chat'



class App extends React.Component {
  constructor(props) {
    super(props);
    // Não chame this.setState() aqui!
    this.state = {chains:[], selectedChain: "", selectedMode: "Messages"};

    this.addChain = this.addChain.bind(this);
    this.selectChain = this.selectChain.bind(this);
    this.getAllChains = this.getAllChains.bind(this);
    this.selectMode = this.selectMode.bind(this);
  }

  addChain(chainName, pubKey) {
    fetch('/freechains/chains/join/%23' + chainName, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "GET",
      body: JSON.stringify({shared: pubKey})
    }).then(response => response.json())
      .then(json => {
        this.setState({ selectedChain: "#" + chainName });
      });

      this.getAllChains();
  }

  selectChain(chainName) {
    this.setState({ selectedChain: chainName });
  }

  selectMode(mode) {
    console.log(mode)
    this.setState({ selectedMode: mode });
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

  render() {
    return (
      <div className="App">
        <AppBar chains={this.state.chains} addChain={this.addChain} selectChain={this.selectChain}/>
        <AppChat chain={this.state.selectedChain} selectedMode={this.state.selectedMode} selectMode={this.selectMode}/>
      </div>
    );
  }
}

export default App;
