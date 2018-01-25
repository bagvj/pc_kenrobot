// @flow
import React, { Node, Component } from 'react'

import AppComponent from '../components/App'

type Props = {
  children: Node
};

export default class App extends Component<Props> {
  props: Props;

  render() {
    return (
      <AppComponent children={this.props.children} />
    )
  }
}
