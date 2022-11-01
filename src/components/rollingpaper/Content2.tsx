import { LOAD_URL_NAME, useUrlName } from '@/store/urlNickname'
import CardType from '@/utils/rollingPaper/Card.type'
import cardDummy from '@/utils/rollingPaper/cardDummy'
import { convertUrlToHostData } from '@/utils/rollingPaper/paper'
import React, { Children, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import Card from './Card'
import Card2 from './Card2'
import styles from './rollingpaper.module.scss'
interface ContentProps {
  title: string
  handleClickCard: (index: number) => void
  cards: CardType[]
  isModifyMode: boolean
  children: React.ReactNode
}

const Content2 = ({ isModifyMode, title, cards, handleClickCard, children }: ContentProps) => {
  const { rollingPaperId } = useParams()
  const { state: urlNameState, dispatch: urlNameDispatch } = useUrlName()

  const getPaperIdNickname = async () => {
    if (!rollingPaperId) return
    const hostData = await convertUrlToHostData(rollingPaperId)
    if (!hostData) return
    return urlNameDispatch({
      type: LOAD_URL_NAME,
      payload: hostData
    })
  }
  useEffect(() => {
    getPaperIdNickname()
  }, [])
  const half = Math.ceil(Math.sqrt(cards.length))
  // const firstDummy = cards.slice(0, half + 1)
  // const secondDummy = cards.slice(half + 1)
  const modifyModeDisable = isModifyMode
    ? {
        panning: {
          disabled: true
        },
        pinch: {
          disabled: true
        },
        doubleClick: {
          disabled: true
        },
        zoomAnimation: {
          disabled: true
        }
      }
    : {}
  return (
    <div className="card-wrapper">
      <TransformWrapper
        {...modifyModeDisable}
        initialScale={1}
        centerOnInit={true}
        minScale={0.5}
        wheel={{ step: 0.2 }}
      >
        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
          <TransformComponent
            wrapperClass="card-content-wrapper"
            contentClass="card-content-component"
          >
            <div className="paper-title">
              <span>{urlNameState.hostName}의</span>
              <span className="title">{title}</span>
            </div>
            <div
              className="card-content"
              style={{ gridTemplateColumns: `repeat(${half}, minmax(200px, 300px))` }}
            >
              {cards.map((card, index) => {
                const rotateDeg = index % 2 ? 'rotate(-10deg)' : 'rotate(10deg)'
                return (
                  <Card2
                    key={index}
                    rotateDeg={rotateDeg}
                    card={card}
                    handleClick={() => handleClickCard(index)}
                  />
                )
              })}
            </div>
            {children}
          </TransformComponent>
        )}
      </TransformWrapper>
    </div>
  )
}

export default Content2
