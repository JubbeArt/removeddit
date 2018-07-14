import React from 'react'

export default (props) => {
  let pageination = <React.Fragment />

  for (let i = props.start; i <= props.end; i++) {
    if (props.currentPage === i) {
      pageination += <span>{i}</span>
    } else {
      pageination += <a href={`${props.url + i}`}>{i}</a>
    }
  }
  return (
    <div id='pagination'>
      Page:
      {props.start > 1 &&
      <React.Fragment>
        <a href={`${props.url + 1}`}>1</a>
        <span> ...</span>
      </React.Fragment>
      }
      {pageination}
    </div>
  )
}
