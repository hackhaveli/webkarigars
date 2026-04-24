export const metadata = {
  title: 'WebKarigars - Premium Templates',
  description: 'Access all your premium templates in one place.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: 'sans-serif', backgroundColor: '#000', color: '#fff' }}>
        {children}
      </body>
    </html>
  )
}
