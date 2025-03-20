// Main JavaScript for the code editor functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the editor
    const editor = new Editor();
    
    // Setup file browser functionality
    const fileBrowser = new FileBrowser(editor);
    
    // Setup markdown viewer
    const markdownViewer = new MarkdownViewer();
    
    // Initialize UI components
    setupUIEvents(editor, fileBrowser, markdownViewer);
});