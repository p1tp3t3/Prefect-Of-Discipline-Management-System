import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import { useEffect } from "react"
import "./rich-text-editor.css"
import { Bold, Italic, Strikethrough, Heading, List, ListOrdered, Quote, RotateCcw, RotateCw } from "lucide-react"

const RichTextEditor = ({ label, val = "", change, error, req = false, placeholder = "", minHeight = "20rem" }) => {
    const editor = useEditor({
        extensions: [StarterKit, Placeholder.configure({ placeholder })],
        content: val,
        onUpdate: ({ editor }) => change?.(editor.getHTML()),
        editorProps: {
            attributes: {
                class: "rte-content text-[13px] focus:outline-none",
            },
        },
    })

    // keep the editor in sync when the value is reset from outside (e.g. after submit)
    useEffect(() => {
        if (editor && val === "" && editor.getHTML() !== "<p></p>") {
            editor.commands.setContent("")
        }
    }, [val, editor])

    if (!editor) return null

    return (
        <div className="w-full flex flex-col gap-1">
            {label && (
                <label className="text-[0.85em] font-medium text-gray-700">
                    {label} {req && <span className="text-[#d12323]">*</span>}
                </label>
            )}
            <div className={`w-full border rounded-md overflow-hidden ${error ? "border-[#d12323]" : "border-gray-300 focus-within:border-blue-700"}`}>
                <Toolbar editor={editor} />
                <div className="p-3 cursor-text" style={{ minHeight }} onClick={() => editor.chain().focus().run()}>
                    <EditorContent editor={editor} />
                </div>
            </div>
            {error && <div className="text-[#d12323] text-[13px] font-[600]">{error}</div>}
        </div>
    )
}

const ToolbarBtn = ({ onClick, active, disabled, children, title }) => (
    <button
        type="button"
        title={title}
        disabled={disabled}
        onClick={onClick}
        className={`w-8 h-8 grid place-items-center rounded transition-colors ${
            active ? "bg-blue-700 text-white" : "text-gray-700 hover:bg-gray-200"
        } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
    >
        {children}
    </button>
)

const Toolbar = ({ editor }) => (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
        <ToolbarBtn title="Bold" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>
            <Bold size="0.85em" />
        </ToolbarBtn>
        <ToolbarBtn title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}>
            <Italic size="0.85em" />
        </ToolbarBtn>
        <ToolbarBtn title="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")}>
            <Strikethrough size="0.85em" />
        </ToolbarBtn>
        <div className="w-[1px] h-5 bg-gray-300 mx-1"></div>
        <ToolbarBtn title="Heading" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}>
            <Heading size="0.85em" />
        </ToolbarBtn>
        <ToolbarBtn title="Bullet List" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>
            <List size="0.85em" />
        </ToolbarBtn>
        <ToolbarBtn title="Numbered List" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}>
            <ListOrdered size="0.85em" />
        </ToolbarBtn>
        <ToolbarBtn title="Quote" onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")}>
            <Quote size="0.85em" />
        </ToolbarBtn>
        <div className="w-[1px] h-5 bg-gray-300 mx-1"></div>
        <ToolbarBtn title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
            <RotateCcw size="0.85em" />
        </ToolbarBtn>
        <ToolbarBtn title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
            <RotateCw size="0.85em" />
        </ToolbarBtn>
    </div>
)

export default RichTextEditor
