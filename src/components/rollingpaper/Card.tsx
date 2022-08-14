import CardType from '@/utils/rollingPaper/Card.type'
import React from 'react'
import colors from '@/styles/colors.scss'
import styles from './rollingpaper.module.scss'
import fonts from '@/styles/core/_typography.scss'
import classNames from 'classnames'
interface CardProps {
  card: CardType
  rotateDeg: string
  handleClick: () => void
}

const Card = ({ rotateDeg, card, handleClick }: CardProps) => {
  console.log(styles)
  return (
    <div
      className={classNames(styles.card, styles[card.background], styles[card.font])}
      style={{ transform: rotateDeg }}
      onClick={handleClick}
    >
      <div>{card.content}</div>
    </div>
  )
}

export default Card
