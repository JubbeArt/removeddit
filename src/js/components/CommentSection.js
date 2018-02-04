import React from 'react'

const arrayToLookup = commentList => {

}


export default (props) => {
  const { children } = props
  console.log('COMMENT SECTION RENDERED')

  return (
    <div>
      <h1>{props.root}</h1>
      <h1>{children}</h1>
    </div>
  )
}
