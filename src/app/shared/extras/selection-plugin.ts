import { Plugin } from "prosemirror-state";
import { Decoration, DecorationSet, EditorView } from "prosemirror-view";

export function selectionPlugin() {
     return new Plugin({
    props: {
      decorations(state) {

        const view = (this as any).view as EditorView;
        // If the editor has focus, do nothing. Let the browser handle it.
        if (view && view.hasFocus()) {
          return DecorationSet.empty;
        }

        const { from, to } = state.selection;

        // If no text is selected, do nothing.
        if (from === to) {
          return DecorationSet.empty;
        }

        // Create an inline decoration with our custom CSS class.
        return DecorationSet.create(state.doc, [
          Decoration.inline(from, to, { class: 'fake-selection' }),
        ]);
      },
    },
  });
}