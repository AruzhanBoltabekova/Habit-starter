import React from "react";

const Heading = (props: {
  title: string | null,
  subtitle?: string
}) => (
  <header>
    {props.title && <h1>{props.title}</h1>}
    {props.subtitle && <h2>{props.subtitle}</h2>}
  </header>
)

const Nav = (props: {
children: React.ReactNode
}) => (
  <nav>
    {props.children}
  </nav>
)

export default function Layout({ children, NavEl, heading }: React.PropsWithChildren<{
  NavEl?: React.ReactNode,
  heading?: {
    title: string | null,
    subtitle?: string
  }
}>) {
  return (
    <div>
      {heading && <Heading {...heading} />}
      {NavEl && <Nav>{NavEl}</Nav>}
      <main>
        {children}
      </main>
    </div>
  );
}