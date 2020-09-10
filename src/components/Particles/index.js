import React, {Component} from 'react';
import 'particles.js';
import config from './config';

export default class Particles extends Component {

  static CID = 0;

  constructor() {
    super(...arguments);
    this.id = `particles-${Particles.CID++}`;
  }

  componentDidMount() {
    if (window.particlesJS) {
      window.particlesJS(this.id, config);
    }
  }

  render() {
    return (
      <div id={this.id} style={{width:'100%', height:'100%', position:'absolute', top:0, left:0, right:0, bottom:0}}/>
    )
  }
}
