import { ReactNode, useState } from 'react'
import styles from './shareRollItem.module.scss'
import { ModalButton, ModalInput, ModalText } from '@/components/Modal/ModalItem'

import { CLIENT_PAPER_URL } from '@/config/commonLink'
import { ClipboardIcon, DownloadIcon, ShareIcon2 } from '@/assets'
import { checkBrowser } from '@/utils/common/checkBrowser'
import Popup from '@/components/Modal/Popup'
import { toPng, toSvg } from 'html-to-image'
import _ from 'lodash'
import { useTheme } from '@/store/theme'
import colors from '@/styles/colors.scss'

interface Props {
  paperUrl: string | undefined
  children: ReactNode
}

function filter(node: HTMLElement) {
  return node.tagName !== 'i'
}
const ShareRollItem = ({ paperUrl, children }: Props) => {
  const [isPopupActive, setIsPopupActive] = useState(false)
  const [popupContent, setPopupContent] = useState('')
  const { state, dispatch } = useTheme()
  const fullPaperUrl = paperUrl ? `${CLIENT_PAPER_URL}${paperUrl}` : '유효하지 않은 URL입니다.'
  let popupDelay: NodeJS.Timer

  const shareData = {
    title: '추억의 롤링페이퍼',
    text: '친구, 동료들과 함께 추억을 만들고 간직하세요!',
    url: fullPaperUrl
  }

  const handleClipboardCopyClick = () => {
    navigator.clipboard.writeText(fullPaperUrl)

    setIsPopupActive(true)
    setPopupContent('링크 복사 완료!')
    if (popupDelay) clearTimeout(popupDelay)
    popupDelay = setTimeout(() => {
      setIsPopupActive(false)
    }, 1000)
  }

  const handleShareClick = () => {
    navigator.clipboard.writeText(fullPaperUrl)
    navigator.share(shareData)
  }

  const handleImageDownloadClick = () => {
    const rollingpaper = document.getElementById('virtual-rollingpaper') as HTMLDivElement
    const loading = document.getElementById('vr-loading') as HTMLDivElement
    if (checkBrowser()) {
      setPopupContent('(IE, Safari X)\n다른 브라우저로 시도해주세요.')
      setIsPopupActive(true)
      if (popupDelay) clearTimeout(popupDelay)
      popupDelay = setTimeout(() => {
        setIsPopupActive(false)
      }, 1000)
    } else {
      if (rollingpaper) {
        const scale = 2
        toPng(rollingpaper, {
          width: rollingpaper.offsetWidth * scale,
          height: rollingpaper.offsetHeight * scale,
          style: {
            transform: `scale(${scale}) translate(${rollingpaper.offsetWidth / 2 / scale}px, ${
              rollingpaper.offsetHeight / 2 / scale
            }px)`
          }
        }).then((image) => {
          const link = window.document.createElement('a')
          link.setAttribute('style', 'display:none; width: 100%;')
          link.setAttribute('crossorigin', 'anonymous')
          link.download = `rollingpaper_${paperUrl}` + '.png'
          link.href = image
          link.click()
        })
      }
    }
  }

  return (
    <>
      <ModalText type="title">{children}</ModalText>

      <ModalText type="label">롤링페이퍼 링크</ModalText>
      <div className={styles.shareInputWrapper}>
        <ModalInput type="text" name="title" value={fullPaperUrl} readOnly isAddIcon />
        <button
          type="button"
          className={styles.shareIconButton}
          onClick={handleClipboardCopyClick}
          disabled={!paperUrl}
        >
          <ClipboardIcon />
        </button>
      </div>
      <div className={styles.buttons}>
        {!!paperUrl && (
          <ModalButton type="button" onClick={handleShareClick}>
            <span>공유하기</span>
            <ShareIcon2 />
          </ModalButton>
        )}
        {
          <ModalButton type="button" onClick={handleImageDownloadClick}>
            <span>이미지로 저장하기</span>
            <DownloadIcon />
          </ModalButton>
        }
      </div>
      <Popup isActive={isPopupActive} content={popupContent} />
    </>
  )
}

export default ShareRollItem
