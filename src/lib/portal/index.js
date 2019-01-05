import React from 'react';
import { unstable_renderSubtreeIntoContainer, unmountComponentAtNode } from 'react-dom';

export const createPortal = (Component, container) => {
    return class Portal extends React.Component {
        render() {
            return null;
        }
        getContainer() {
            return container || document.body;
        }

        componentDidMount() {
            this.node = document.createElement("div");
            if(this.props.nodeClassName) {
                this.node.className = this.props.nodeClassName;
            }
            if(this.props.containerClassName) {
                this.getContainer().className = this.props.containerClassName;
            }
            this.getContainer().appendChild(this.node);
            this.renderPortal(this.props);
        }
        
        componentWillReceiveProps(nextProps) {
            if(nextProps.nodeClassName) {
                this.node.className = nextProps.nodeClassName;
            }
            if(nextProps.containerClassName) {
                this.getContainer().className = nextProps.containerClassName;
            }
        }

        componentDidUpdate() {
            this.renderPortal(this.props);
        }

        componentWillUnmount() {
            unmountComponentAtNode(this.props);
            this.getContainer().removeChild(this.node);
        }

        renderPortal() {
            unstable_renderSubtreeIntoContainer(
                this,
                <Component {...this.props} />,
                this.node
            );
        }
    }
}