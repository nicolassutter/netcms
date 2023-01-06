export function getFrontMatter(content: string) {
  // If it starts with dashes and only dashes
  const hasFrontMatter = /^-+\n/.test(content)

  // matches frontmatter content (in named group)
  const reg = /^(?<dashes>-{3,})\n(?<content>(?:\s|.)*?)\n\k<dashes>/m

  const frontmatter = hasFrontMatter
    ? reg.exec(content)?.groups?.content ?? ''
    : ''

  return frontmatter
}
