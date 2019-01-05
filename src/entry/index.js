import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import store from 'store';
import 'lib/browser';

import { Icon } from 'antd';


class A extends React.Component {
    render() {
        return <div>aadada-----{this.props.data}
            <Icon type="left" />   
        </div>
    }
}

import { createPortal } from 'lib/portal';
const Temp = createPortal(A);

render(
    (
        <Provider store={store}>
            {/* <Button type="primary">提交</Button> */}
            <Temp data="id" nodeClassName="node" containerClassName="open" />
        </Provider>
    ),
    document.getElementById('app')
);

