// @flow
import React, { Component } from 'react'
import { Layout } from 'antd'
import { Link } from 'react-router-dom'
// import styles from './Home.scss'

const { Footer, Sider, Content } = Layout

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <Layout>
        <Sider>Explorer</Sider>
        <Layout>
          <Layout>
            <Content>
              <Link to="/counter">Counter</Link>
            </Content>
            <Sider>Property</Sider>
          </Layout>
          <Footer>Output</Footer>
        </Layout>
      </Layout>
    )
  }
}
