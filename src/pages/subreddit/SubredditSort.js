import React from 'react'

export default (props) => {
  const isSelected = time => props.time === time

  return (
    <div className='subreddit-info'>
      top post of <a href={`https://www.reddit.com/r/${props.subreddit}`}>/r/{props.subreddit}</a> from:
      <select>
        <option value='hour' selected={isSelected('hour')}>past hour</option>
        <option value='12hour' selected={isSelected('12hour')}>past 12 hours</option>
        <option value='day' selected={isSelected('day')}>past day</option>
        <option value='week' selected={isSelected('week')}>past week</option>
        <option value='month' selected={isSelected('month')}>past month</option>
        <option value='6month' selected={isSelected('6month')}>past 6 months</option>
        <option value='year' selected={isSelected('year')}>past year</option>
        <option value='all' selected={isSelected('all')}>all time</option>
      </select>
    </div>
  )
}
