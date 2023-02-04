export interface Links {
  self: string
  git: string
  html: string
}

export interface SingleFile {
  name: string
  path: string
  sha: string
  size: number
  url: string
  html_url: string
  git_url: string
  download_url: string
  type: string
  encoding: string
  content: string
  _links: Links
}

export interface Links {
  git: string
  self: string
  html: string
}

export interface CreateFileResponse {
  content: Content
  commit: Commit
}

export interface Commit {
  sha: string
  node_id: string
  url: string
  html_url: string
  author: Author
  committer: Author
  message: string
  tree: Tree
  parents: Parent[]
  verification: Verification
}

export interface Author {
  date: string
  name: string
  email: string
}

export interface Parent {
  url: string
  html_url: string
  sha: string
}

export interface Tree {
  url: string
  sha: string
}

export interface Verification {
  verified: boolean
  reason: string
  signature: null
  payload: null
}

export interface Content {
  name: string
  path: string
  sha: string
  size: number
  url: string
  html_url: string
  git_url: string
  download_url: string
  type: string
  _links: Links
}

export interface Links {
  self: string
  git: string
  html: string
}
