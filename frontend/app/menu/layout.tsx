import Link from 'next/link'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <header>
        <p>ffj</p>
      </header>
      {children}
    </>
  )
}