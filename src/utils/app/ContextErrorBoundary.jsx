import React, { Component } from 'react';

import ErrorPage from 'views/error/NotFound';

export class ContextErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error('Context Error Boundary caught an error:', error, errorInfo);
    this.setState({ hasError: true, error });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <ErrorPage error={this.state.error} errorInfo={this.state.error} />
      );
    }

    return this.props.children || null;
  }
}

export default ContextErrorBoundary;
