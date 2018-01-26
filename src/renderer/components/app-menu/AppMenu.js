import React, { Component } from 'react'
import { Menu } from 'antd'
import styles from './AppMenu.scss'

const { Item, SubMenu, Divider } = Menu

type Props = {};

export default class AppMenu extends Component<Props> {
  props: Props;

  render() {
    return (
      <Menu className={styles.menu} selectable={false} mode="horizontal">
        <SubMenu title="文件" className={styles.subMenu}>
          <Item key="new">
            新建
          </Item>
          <Divider />
          <Item key="open">
            打开
          </Item>
          <Item key="save">
            保存
          </Item>
          <Item key="save-as">
            另存为
          </Item>
        </SubMenu>
        <SubMenu title="编辑" className={styles.subMenu}>
          <Item key="comment">
            注释/取消注释
          </Item>
          <Divider />
          <Item key="copy-code">
            复制代码
          </Item>
          <Item key="export-code">
            导出代码
          </Item>
        </SubMenu>
        <SubMenu title="案例" className={styles.subMenu}>
          <Item key="demo-1">
            Demo 1
          </Item>
          <Divider />
          <Item key="demo-2">
            Demo 1
          </Item>
          <SubMenu title="Demo 3">
            <Item key="demo-3-1">
              Demo 3-1
            </Item>
            <Divider />
            <Item key="demo-3-2">
              Demo 3-2
            </Item>
            <Item key="demo-3-3">
              Demo 3-3
            </Item>
          </SubMenu>
        </SubMenu>
        <Item key="option">
          选项
        </Item>
        <Item key="help">
          帮助
        </Item>
      </Menu>
    )
  }
}
