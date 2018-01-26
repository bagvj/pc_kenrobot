import React, { Component } from 'react'
import styles from './UserPortrait.scss'
import defaultUser from '../../assets/default-user.png'

type Props = {};

export default class UserPortrait extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={styles.container}>
        <img className={styles.photo} src={defaultUser} />
        <span className={styles.name}>未登录</span>
      </div>
    )
  }
}
