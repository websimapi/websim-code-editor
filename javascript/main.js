// Main JavaScript for the code editor functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the editor
    const editor = new Editor();
    
    // Setup markdown viewer
    const markdownViewer = new MarkdownViewer();
    
    // Setup file browser functionality (after editor and markdown viewer)
    const fileBrowser = new FileBrowser(editor);
    
    // Initialize UI components
    setupUIEvents(editor, fileBrowser, markdownViewer);
    
    // For demo purposes, mock the fetch for /assets endpoint
    // In a real implementation, this would be handled by the server
    const originalFetch = window.fetch;
    window.fetch = async (url) => {
        if (url === '/assets') {
            return {
                json: async () => [
                    'index.html', 'main.js', 'styles.css', 
                    'javascript/editor.js', 'javascript/file-browser.js', 'javascript/markdown-viewer.js',
                    'javascript/ui-events.js', 'javascript/main.js',
                    'css/editor.css', 'css/reset.css', 'css/main.css', 'css/header.css', 'css/sidebar.css', 'css/markdown-viewer.css',
                    'javascript/editor.md', 'javascript/file-browser.md', 'javascript/markdown-viewer.md',
                    'javascript/ui-events.md', 'javascript/main.md', 
                    'css/editor.md', 'css/reset.md', 'css/main.md', 'css/header.md', 'css/sidebar.md', 'css/markdown-viewer.md',
                    'index.md'
                ]
            };
        }
        // For all other URLs, use the actual fetch
        return originalFetch(url);
    };
});