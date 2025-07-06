import { useEffect } from 'react'

export const HomePage = () => {
  useEffect(() => {
    document.body.style.backgroundColor = 'white'
  }, [])
  return (
    <div>
      <h1>5PR05</h1>
    </div>
  )
}
