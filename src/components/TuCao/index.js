import React from 'react'
import './index.css'

export default function TuCao() {
  if (!process.env.REACT_APP_TUCAO_ID) {
    return null
  }

  return (
    <a className="tucao"  target="_blank" href={`https://support.qq.com/products/${process.env.REACT_APP_TUCAO_ID}`}>
      反馈 留言
    </a>
  )
}