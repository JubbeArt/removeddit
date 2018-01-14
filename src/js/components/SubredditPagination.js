import React from 'react'

export default (props) => {
  let pageination = <></>

  for (let i = props.start; i <= props.end; i++) {
    if (props.currentPage === i) {
      pageination += <span>{i}</span>
    } else {
      pageination += <a href={`${props.url + i}`}>{i}</a>
    }
  }
  return (
    <div id="pagination">
      Page:
      {props.start > 1 &&
      <>
        <a href={`${props.url + 1}`}>1</a>
        <span> ...</span>
      </>}
      {pageination}
    </div>
  )
}
