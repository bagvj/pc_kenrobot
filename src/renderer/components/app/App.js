// @flow
import React, { Component, Node } from 'react'
import Header from '../header/Header'

import './App.global.css'
import '../../assets/vendor/kenrobot/kenrobot.global.css'

import styles from './App.scss'

type Props = {
  children: Node
};

export default class App extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={styles.app}>
        <Header />
        <div className={styles.body}>
          {this.props.children}
        </div>
      </div>
    )
  }
}
