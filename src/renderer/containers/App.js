// @flow
import React, { Node, Component } from 'react'

import AppComponent from '../components/app/App'

type Props = {
  children: Node
};

export default class App extends Component<Props> {
  props: Props;

  render() {
    return (
      <AppComponent>{this.props.children}</AppComponent>
    )
  }
}
