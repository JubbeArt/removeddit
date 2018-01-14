import React from 'react'

export default (props) => {
  const { children } = props
  return (
    <div>
      <h1>{props.root}</h1>
      <h1>{children}</h1>
    </div>
  )
}
