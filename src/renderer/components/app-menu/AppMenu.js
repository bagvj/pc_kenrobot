import React, { Component } from 'react'
import { Menu } from 'antd'
import styles from './AppMenu.scss'

const { Item, SubMenu, Divider } = Menu

const menuConfig = [{
  id: "file",
  placeholder: "文件",
  menu: [{
    text: "新建项目",
    action: "new-project",
    shortcut: {
      key: ["ctrl+n", "command+n"],
      text: "Ctrl+N",
    }
  }, "_", {
    text: "打开项目",
    action: "open-project",
    shortcut: {
      key: ["ctrl+o", "command+o"],
      text: "Ctrl+O",
    }
  }, {
    text: "保存项目",
    action: "save-project",
    shortcut: {
      key: ["ctrl+s", "command+s"],
      text: "Ctrl+S",
    }
  }, {
    text: "另存为",
    action: "save-as-project",
    shortcut: {
      key: ["ctrl+shift+s", "command+shift+s"],
      text: "Ctrl+Shift+S",
    }
  }]
}, {
  id: "edit",
  placeholder: "编辑",
  menu: [{
    text: "注释/取消注释",
    action: "toggle-comment",
    shortcut: {
      key: ["ctrl+/", "command+/"],
      text: "Ctrl+/",
    }
  }, "_", {
    text: "复制代码",
    action: "copy",
    shortcut: {
      key: ["ctrl+c", "command+c"],
      text: "Ctrl+C",
    }
  }, {
    text: "导出代码",
    action: "export"
  }]
}, {
  id: "example",
  placeholder: "案例",
  menu: [{
    id: "example-built-in",
    placeholder: "内置示例",
    arrow: true,
    menuCls: "example-built-in",
  }, "_", {
    id: "example-third-party",
    placeholder: "第三方示例",
    arrow: true,
    menuCls: "example-third-party"
  }]
}, {
  id: "options",
  placeholder: "选项",
  menu: [{
    text: "开发板管理",
    action: "show-board-dialog",
  }, {
    text: "库管理",
    action: "show-library-dialog",
  }, "_", {
    id: "fullscreen",
    text: "全屏",
    action: "fullscreen",
  }, {
    text: "语言",
    action: "language",
  }, {
    text: "主题",
    action: "theme",
  }, "_", {
    text: "设置",
    action: "setting",
  }]
}, {
  id: "help",
  placeholder: "帮助",
  menu: [{
    text: "Arduino驱动下载",
    action: "download-arduino-driver",
  }, "_", {
    text: "检查更新",
    action: "check-update",
  }, {
    text: "啃萝卜官网",
    action: "visit-kenrobot",
  }, {
    text: "Arduino论坛",
    action: "visit-arduino",
  }, "_", {
    text: "建议反馈",
    action: "suggestion",
  }, {
    text: "关于啃萝卜",
    action: "about-kenrobot",
  }]
}];

type Props = {};

const genMenu = config => config.map(menuItem => {
  if(menuItem === "_") {
    return <Divider />
  }

  if(menuItem.text) {
    return (
    <Item key={menuItem.option}>
      {<span className={styles.menuText}>{menuItem.text}</span>}
      { if (menuItem.shortcut) {
        return <span>{menuItem.shortcut}</span>
      }}
    </Item>)
  }

  if(menuItem.placeholder) {
    return <Divider />
  }

  return ""
})

export default class AppMenu extends Component<Props> {
  props: Props;

  render() {
    let menu = genMenu([])
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
