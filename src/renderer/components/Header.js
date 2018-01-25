import React, { Component } from 'react'
import styles from './Header.scss'

type Props = {};

export default class Header extends Component<Props> {
  props: Props;

  onBtnClick(action) {
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

  render() {
    return (
      <div className={styles.header}>
        <div className={styles.left}>
					<div className={styles.logoWrap}>
						<div className={styles.logo} />
						<span>啃萝卜</span>
						<span className={styles.projectPath}></span>
					</div>
					<div className={styles.menuWrap}>
						<div className={styles.menu}>
              <ul></ul>
						</div>
						<div className={styles.placeholder}></div>
					</div>
				</div>
				<div className={styles.placeholder}></div>
				<div className={styles.right}>
				</div>
				<div className={styles.btns}>
					<ul>
						<li onClick={() => this.onBtnClick("min")}><i className="kenrobot ken-screen-min" /></li>
						<li onClick={() => this.onBtnClick("max")}><i className="kenrobot ken-screen-max" /></li>
						<li onClick={() => this.onBtnClick("exit")}><i className="kenrobot ken-close" /></li>
					</ul>
				</div>
      </div>
    )
  }
}
