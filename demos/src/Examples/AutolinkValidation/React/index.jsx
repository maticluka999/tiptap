import './styles.scss'

import Link from '@tiptap/extension-link'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React from 'react'

export default () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        validate: link => /^https?:\/\//.test(link),
      }),
    ],
    content: `
      <p>Hey! Try to type in url with and without a http/s protocol. - Links without a protocol should not get auto linked</p>
    `,
    editorProps: {
      attributes: {
        spellcheck: 'false',
      },
    },
  })

  const setCustomLink = React.useCallback(() => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetCustomLink()
        .run()

      return
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setCustomLink({ href: url })
      .run()
  }, [editor])

  if (!editor) {
    return null
  }

  return (
    <div>
      <button
        onClick={setCustomLink}
        className={editor.isActive('link') ? 'is-active' : ''}
        data-testid="setCustomLink"
      >
        setCustomLink
      </button>
      <button
        onClick={() => editor.chain().focus().unsetCustomLink().run()}
        disabled={!editor.isActive('link')}
        data-testid="unsetCustomLink"
      >
        unsetCustomLink
      </button>
      <EditorContent editor={editor} />
    </div>
  )
}
