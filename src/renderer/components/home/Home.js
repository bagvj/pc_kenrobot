// @flow
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import styles from './Home.scss'

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.contentWrap}>
          <div className={styles.left}>Explorer</div>
          <div className={styles.rightWrap}>
            <div className={styles.topWrap}>
              <div className={styles.content}>
                <Link to="/counter">Counter</Link>
              </div>
              <div className={styles.right}>Property</div>
            </div>
            <div className={styles.bottom}>Output</div>
          </div>
        </div>
        <div className={styles.statusBar}>status bar</div>
      </div>
    )
  }
}
