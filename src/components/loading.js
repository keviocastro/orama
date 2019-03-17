import React, { Component } from 'react'

export default ({ props }) => (
  renderLoading = () => {
    if (!this.props.loading) return null

    return (
      <View>
        <ActivityIndicator animating size="large" />
      </View>
    )
  }
)