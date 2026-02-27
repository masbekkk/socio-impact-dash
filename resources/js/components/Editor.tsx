import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import React, { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';

// Editor is an uncontrolled component
const Editor = forwardRef(({ readOnly, defaultValue, onTextChange, onSelectionChange }: any, ref: any) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);

    useLayoutEffect(() => {
        onTextChangeRef.current = onTextChange;
        onSelectionChangeRef.current = onSelectionChange;
    });

    useEffect(() => {
        ref.current?.enable(!readOnly);
    }, [ref, readOnly]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const editorContainer = container.appendChild(
            container.ownerDocument.createElement('div')
        );
        const quill = new Quill(editorContainer, {
            theme: 'snow',
        });

        ref.current = quill;

        if (defaultValue) {
            quill.setContents(quill.clipboard.convert({ html: defaultValue }));
        }

        quill.on(Quill.events.TEXT_CHANGE, () => {
            onTextChangeRef.current?.(quill.root.innerHTML);
        });

        quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
            onSelectionChangeRef.current?.(...args);
        });

        return () => {
            ref.current = null;
            container.innerHTML = '';
        };
    }, [ref]);

    return (
        <>
            <style>
                {`
                .quill-container .ql-container {
                    height: calc(100% - 42px);
                    min-height: 200px;
                }
                .quill-container .ql-editor {
                    min-height: 200px;
                }
                `}
            </style>
            <div ref={containerRef} className="quill-container h-full w-full"></div>
        </>
    );
});

Editor.displayName = 'Editor';

export default Editor;
