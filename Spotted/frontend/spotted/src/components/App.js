import '../styles/App.css';
import React from 'react'
import ButtonAppBar from './navbar'



class App extends React.Component {
  constructor(props) {
    super(props);
    // Não chame this.setState() aqui!
    this.state = {chains:['teste']};
  }
  
  componentDidMount() {
    fetch('http://localhost:5000/freechains/chains/list')
      .then(response => response.json())
      .then(json => {
        console.log(json)
        //this.setState({ chains: json["data"] });
      });
  }
  render() {
    return (
      <div className="App">
        <ButtonAppBar chains={this.state.chains}/>
      </div>
    );
  }
}

export default App;
