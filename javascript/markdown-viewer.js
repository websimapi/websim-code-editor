// Class to handle the markdown viewer functionality
class MarkdownViewer {
    constructor() {
        this.createMarkdownViewer();
        this.markdownContents = {};
        this.fileMapping = {};
        this.loadConfig().then(() => {
            this.loadMarkdownContents();
        });
    }
    
    createMarkdownViewer() {
        // Create the markdown viewer container
        const markdownViewer = document.createElement('div');
        markdownViewer.className = 'markdown-viewer';
        markdownViewer.style.display = 'none'; // Initially hidden
        
        // Create header with toggle button
        const header = document.createElement('div');
        header.className = 'markdown-header';
        
        const title = document.createElement('h3');
        title.textContent = 'Documentation';
        
        const closeButton = document.createElement('button');
        closeButton.className = 'close-markdown-button';
        closeButton.innerHTML = '<i class="fas fa-times"></i>';
        closeButton.addEventListener('click', () => this.toggleMarkdownViewer(false));
        
        header.appendChild(title);
        header.appendChild(closeButton);
        
        // Create content area
        const content = document.createElement('div');
        content.className = 'markdown-content';
        
        markdownViewer.appendChild(header);
        markdownViewer.appendChild(content);
        
        // Add to main content
        document.querySelector('.main-content').appendChild(markdownViewer);
        
        this.viewer = markdownViewer;
        this.content = content;
    }
    
    async loadConfig() {
        try {
            const response = await fetch('config.json');
            const config = await response.json();
            this.fileMapping = config.fileMapping;
        } catch (error) {
            console.error("Error loading config:", error);
            // Fallback to default mapping
            this.fileMapping = {
                "index.html": "index.md",
                "editor.js": "javascript/editor.md",
                "file-browser.js": "javascript/file-browser.md"
                // Add more fallback mappings if needed
            };
        }
    }
    
    async loadMarkdownContents() {
        // Get all the markdown file paths from the mapping
        const mdFiles = Object.values(this.fileMapping);
        
        for (const file of mdFiles) {
            try {
                const response = await fetch(file);
                const text = await response.text();
                this.markdownContents[file] = this.formatMarkdown(text);
                
                // Find the source file for this markdown
                for (const [sourceFile, mdFile] of Object.entries(this.fileMapping)) {
                    if (mdFile === file) {
                        this.markdownContents[sourceFile] = this.markdownContents[file];
                    }
                }
            } catch (error) {
                console.error(`Error loading ${file}:`, error);
            }
        }
    }
    
    formatMarkdown(text) {
        // Very simple markdown formatter - in a real app you'd use a library
        let formatted = text
            // Headers
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            // Lists
            .replace(/^\- (.*$)/gm, '<li>$1</li>')
            .replace(/<\/li>\n<li>/g, '</li><li>')
            .replace(/<\/li>\n*$/, '</li></ul>')
            .replace(/^\<li\>/, '<ul><li>');
        
        return formatted;
    }
    
    showMarkdownForFile(fileName) {
        if (this.markdownContents[fileName]) {
            this.content.innerHTML = this.markdownContents[fileName];
            this.toggleMarkdownViewer(true);
        } else if (this.fileMapping[fileName] && this.markdownContents[this.fileMapping[fileName]]) {
            // Try to find using the mapping
            this.content.innerHTML = this.markdownContents[this.fileMapping[fileName]];
            this.toggleMarkdownViewer(true);
        } else {
            this.content.innerHTML = '<p>No documentation available for this file.</p>';
            this.toggleMarkdownViewer(true);
        }
    }
    
    toggleMarkdownViewer(show) {
        this.viewer.style.display = show ? 'flex' : 'none';
        
        // Adjust editor container width
        const editorContainer = document.querySelector('.editor-container');
        if (show) {
            editorContainer.style.width = 'calc(100% - 300px)';
        } else {
            editorContainer.style.width = '100%';
        }
    }
}