import React from 'react';
import ReactDOM, { render } from 'react-dom';
import { Provider } from 'react-redux';

import store from 'store';
import 'lib/browser';

import { Icon } from 'antd';

class A extends React.Component {
    render() {
        return ReactDOM.createPortal(<Icon type="left" />, document.body);
    }
}

render(
    (
        <Provider store={store}>
            {/* <Button type="primary">提交</Button> */}
            <A />
        </Provider>
    ),
    document.getElementById('app')
);
