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
    
    // Add event listener for the documentation toggle button
    document.getElementById('toggle-docs').addEventListener('click', () => {
        const activeFileEl = document.querySelector('.file-item.active span');
        if (activeFileEl) {
            const activeFile = activeFileEl.textContent;
            markdownViewer.showMarkdownForFile(activeFile);
        } else {
            markdownViewer.content.innerHTML = '<p>Please select a file to view its documentation.</p>';
            markdownViewer.toggleMarkdownViewer(true);
        }
    });
});