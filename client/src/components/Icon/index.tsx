import React, { useState, useEffect } from 'react'
export interface IconPropsT {
  src: string
  size: number
  fill?: string
  style?: React.CSSProperties
}
export const Icon = ({ src, size, style = {}, fill = 'white' }: IconPropsT) => {
  const [loading, setLoading] = useState(true)
  const [svg, setSvg] = useState('')

  useEffect(() => {
    if (src) {
      fetch(src)
        .then((res) => res.text())
        .then((text) => setSvg(text))
        .then(() => setLoading(false))
    }
  }, [src])

  return !loading ? (
    <div
      style={{ ...style, height: size, width: size, fill }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  ) : (
    <div />
  )
}
