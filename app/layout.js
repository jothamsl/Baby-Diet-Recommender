import "./globals.css"

export const metadata = {
  title: "AI-Powered Diet Recommender for Babies",
  description: "Personalized meal plans using WHO growth standards",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
