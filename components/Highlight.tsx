import { Mark, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    customHighlight: {
      setCustomHighlight: () => ReturnType;
      unsetCustomHighlight: () => ReturnType;
      removeAllCustomHighlights: () => ReturnType;
    };
  }
}

export const CustomHighlight = Mark.create({
  name: "customHighlight",

  addOptions() {
    return {
      HTMLAttributes: {
        class: "custom-highlight",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span",
        class: this.options.HTMLAttributes.class,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },

  addCommands() {
    return {
      setCustomHighlight:
        () =>
        ({ commands }) => {
          return commands.setMark(this.name);
        },
      unsetCustomHighlight:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
      removeAllCustomHighlights:
        () =>
        ({ tr, state }) => {
          const { doc } = state;
          let hasChanged = false;

          doc.descendants((node, pos) => {
            if (node.marks.find((mark) => mark.type.name === this.name)) {
              tr.removeMark(pos, pos + node.nodeSize, this.type);
              hasChanged = true;
            }
          });

          return hasChanged;
        },
    };
  },
});
