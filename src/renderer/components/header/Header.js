import React, { Component } from 'react'

import AppMenu from '../app-menu/AppMenu'
import UserPortrait from '../user-portrait/UserPortrait'

import styles from './Header.scss'
import logo from '../../assets/logo.png'

type Props = {};

function onBtnClick(action) {
  switch(action) {
    case "min":
    case "max":
    case "quit":
    case "exit":
      window.kenrobot.postMessage(`app:${action}`)
      break
    default:
      break
  }
}

export default class Header extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.left}>
					<div className={styles.logoWrap}>
						<img className={styles.logo} src={logo}/>
						<span>啃萝卜</span>
						<span className={styles.projectPath}></span>
					</div>
					<div className={styles.menuWrap}>
						<div className={styles.menu}>
              <AppMenu />
						</div>
						<div className={styles.placeholder}></div>
					</div>
        </div>
				<div className={styles.placeholder}></div>
				<div className={styles.right}>
          <UserPortrait />
				</div>
				<div className={styles.btns}>
					<ul>
            <li onClick={() => onBtnClick("min")}><i className="kenrobot ken-screen-min" /></li>
						<li onClick={() => onBtnClick("max")}><i className="kenrobot ken-screen-max" /></li>
						<li onClick={() => onBtnClick("exit")}><i className="kenrobot ken-close" /></li>
					</ul>
				</div>
      </div>
    )
  }
}
