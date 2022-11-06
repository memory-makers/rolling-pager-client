import { useCallback, useRef, useState } from 'react'
import cx from 'classnames'

import { updateCard_API } from '@/api/rollingpaper'
import { ArrowDownIconWhite } from '@/assets'

import { useEditor, useOutsideClick } from './hooks'
import { colorObject, fontObject } from './constants'
import { CompleteButton, Paper, RadioGroup, Select } from './components'
import CheckSendingCard from '../WriterRoll/CheckSendingCard'

import styles from './editor.module.scss'

const Editor = () => {
  const {
    paperId,
    cardWriter,
    handleChangeCardWriter,
    cardText,
    handleChangeCardText,
    cardColor,
    handleChangeCardColor,
    fontColor,
    handleChangeFontColor,
    fontStyle,
    handleChangeFontStyle,
    removeAllEditorValue,

    cardColorList,
    fontColorList,
    fontStyleList
  } = useEditor()

  const [editorSelectOptionVisible, setEditorSelectOptionVisible] = useState(true)
  const [isCheckSendingModalOpen, setIsCheckSendingModalOpen] = useState(false)
  const editorSelectOptionRef = useRef(null)

  const handleToggleEditorSelectOption = useCallback(() => {
    setEditorSelectOptionVisible((prev) => !prev)
  }, [])

  const handleCloseEditorSelectOption = useCallback(() => {
    setEditorSelectOptionVisible(false)
  }, [])
  useOutsideClick(editorSelectOptionRef, handleCloseEditorSelectOption)

  const handleClickCompleteButton = () => {
    setIsCheckSendingModalOpen(true)
  }

  const handleSendCard = async () => {
    const card = {
      cardColor,
      cardId: 0,
      cardText,
      cardWriter: cardWriter || '익명',
      fontColor,
      fontStyle,
      paperId
    }
    const res = await updateCard_API(card)
    if (!res) return false
    removeAllEditorValue()
    return true
  }

  return (
    <div className={styles.editor}>
      <div className={styles['editor-header']}>
        <CompleteButton onClick={handleClickCompleteButton} />
      </div>
      <div className={styles['editor-body']}>
        <div className={styles['editor-nickname']}>
          <label>
            {`From. `}
            <input placeholder="" value={cardWriter} onChange={handleChangeCardWriter} />
          </label>
          <p>익명으로 보내고 싶으시면 비워주세요 😃</p>
        </div>
        <Paper
          value={cardText}
          onChange={handleChangeCardText}
          backgroundColor={colorObject[cardColor]}
          fontFamily={fontObject[fontStyle]}
          color={colorObject[fontColor]}
        />
      </div>

      <div
        ref={editorSelectOptionRef}
        className={cx(styles['editor-select-container'], {
          [styles.visible]: editorSelectOptionVisible
        })}
      >
        <div
          className={styles['editor-select-toggle-container']}
          onClick={handleToggleEditorSelectOption}
        >
          <div className={styles['editor-select-toggle']}>
            <ArrowDownIconWhite />
          </div>
        </div>
        <div className={styles['editor-select']}>
          <div className={styles['editor-select-body']}>
            <div className={styles['editor-select-type']}>
              <div className={styles['editor-select-type-title']}>배경</div>
              <RadioGroup
                options={cardColorList}
                value={cardColor}
                onChange={handleChangeCardColor}
              />
            </div>
            <div className={styles['editor-select-type']}>
              <div className={styles['editor-select-type-title']}>폰트</div>
              <Select options={fontStyleList} value={fontStyle} onChange={handleChangeFontStyle} />
            </div>
            <div className={styles['editor-select-type']}>
              <div className={styles['editor-select-type-title']}>글자 색</div>
              <RadioGroup
                options={fontColorList}
                value={fontColor}
                onChange={handleChangeFontColor}
              />
            </div>
          </div>
        </div>
      </div>

      {isCheckSendingModalOpen && (
        <CheckSendingCard setIsModalOpen={setIsCheckSendingModalOpen} callback={handleSendCard} />
      )}
    </div>
  )
}

export default Editor
