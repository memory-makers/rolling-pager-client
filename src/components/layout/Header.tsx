import { useEffect, useMemo, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import classNames from 'classnames'

import { getIdToNicknameAPI, getNicknameAPI, getPaperIdAPI } from '@/api/user'
import { useTheme } from '@/store/theme'
import { LOAD_NAME, useName } from '@/store/nickname'
import { LOAD_URL_NAME, useUrlName } from '@/store/urlNickname'
import MakeNickname from '@/pages/Nickname/MakeNickname'
import EditNickname from '@/pages/Nickname/EditNickname'
import tokenStore from '@/api/tokenStore'

type HeaderType = 'only-button' | 'title-button' | 'only-title'

interface HeaderProps {
  children?: React.ReactNode
  text: string
  type: HeaderType
}
// 공통으로 사용하는 헤더입니다.
const Header = ({ children, text, type }: HeaderProps) => {
  const { state, dispatch } = useTheme()
  const titleVisible = type === 'only-title' || type === 'title-button'
  const buttonVisible = type === 'only-button' || type === 'title-button'

  const token = tokenStore.getAccessToken()
  const { rollingPaperId } = useParams()
  const { pathname } = useLocation()
  const [isMypage, setIsMypage] = useState(false)

  const { nameState, nameDispatch } = useName()
  const { urlNameState, urlNameDispatch } = useUrlName()
  const [isInitModalOpen, setIsInitModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const handleClickEditModal = () => {
    if (!token || !isMypage) return
    setIsEditModalOpen((prev) => !prev)
  }

  const getNickname = async () => {
    const nickname = await getNicknameAPI()
    if (!nickname) setIsInitModalOpen((prev) => !prev)
    else nameDispatch({ type: LOAD_NAME, payload: nickname })
  }

  const getPaperIdNickname = async () => {
    if (!rollingPaperId) return
    const paperId = await getPaperIdAPI(rollingPaperId)
    if (!paperId) return
    const urlNickname = await getIdToNicknameAPI(paperId)
    return urlNameDispatch({
      type: LOAD_URL_NAME,
      payload: { paperUrl: rollingPaperId, paperId, hostName: urlNickname }
    })
  }

  const name = useMemo(() => {
    if (!isMypage) return urlNameState.hostName
    else return nameState
  }, [nameState, urlNameState.hostName])

  useEffect(() => {
    if (pathname.includes('mypage')) {
      getNickname()
      setIsMypage(true)
    }
    if (pathname.includes('rollingpaper')) {
      getPaperIdNickname()
      setIsMypage(false)
    }
  }, [])

  return (
    <header className={classNames('header', state.theme, type)}>
      {titleVisible && (
        <div>
          <button type="button" onClick={handleClickEditModal}>
            <span className="header_name">{name}</span>
            {name && <span>님의</span>}
          </button>
          <br />
          <span>{text}</span>
        </div>
      )}
      {buttonVisible && children}
      {isInitModalOpen && <MakeNickname setIsModalOpen={setIsInitModalOpen} />}
      {isEditModalOpen && <EditNickname setIsModalOpen={setIsEditModalOpen} />}
    </header>
  )
}

export default Header
