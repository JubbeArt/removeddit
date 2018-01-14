import React from 'react'

export default (props) => {
	let pageination = <></>

	for(var i = start; i <= end; i++) {	
		if(currentPage === i) {
			pageination += <span>{i}</span>
		} else {
			pageination += <a href={`${props.url+i}`}>{i}</a>
		}
	}
	return (
		<div id="pagination">
			Page: 
			{start > 1 &&	
			<><a href={`${props.url+1}`}>1</a>
			<span> ...</span></>}
			{pageination}
		</div>
	)
}