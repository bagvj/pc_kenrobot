import React, { Component } from 'react'
import { Menu } from 'antd'
import styles from './AppMenu.scss'

const { SubMenu, Divider } = Menu

type Props = {};

export default class AppMenu extends Component<Props> {
  props: Props;

  render() {
    return (
      <Menu className={styles.menu} selectable={false} mode="horizontal">
        <SubMenu title="文件" className={styles.subMenu}>
          <Menu.Item key="new">
            新建
          </Menu.Item>
          <Divider />
          <Menu.Item key="open">
            打开
          </Menu.Item>
          <Menu.Item key="save">
            保存
          </Menu.Item>
          <Menu.Item key="save-as">
            另存为
          </Menu.Item>
        </SubMenu>
        <SubMenu title="编辑" className={styles.subMenu}>
          <Menu.Item key="comment">
            注释/取消注释
          </Menu.Item>
          <Divider />
          <Menu.Item key="copy-code">
            复制代码
          </Menu.Item>
          <Menu.Item key="export-code">
            导出代码
          </Menu.Item>
        </SubMenu>
        <SubMenu title="案例" className={styles.subMenu}>
          <Menu.Item key="demo-1">
            Demo 1
          </Menu.Item>
          <Divider />
          <Menu.Item key="demo-2">
            Demo 1
          </Menu.Item>
          <SubMenu title="Demo 3">
            <Menu.Item key="demo-3-1">
              Demo 3-1
            </Menu.Item>
            <Divider />
            <Menu.Item key="demo-3-2">
              Demo 3-2
            </Menu.Item>
            <Menu.Item key="demo-3-3">
              Demo 3-3
            </Menu.Item>
          </SubMenu>
        </SubMenu>
        <Menu.Item key="option">
          选项
        </Menu.Item>
        <Menu.Item key="help">
          帮助
        </Menu.Item>
      </Menu>
    )
  }
}
