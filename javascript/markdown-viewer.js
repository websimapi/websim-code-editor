// Class to handle the markdown viewer functionality
class MarkdownViewer {
    constructor() {
        this.createMarkdownViewer();
        this.markdownContents = {};
        this.loadMarkdownContents();
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
    
    async loadMarkdownContents() {
        try {
            const response = await fetch('/assets');
            const files = await response.json();
            
            // Filter for markdown files
            const mdFiles = files.filter(file => file.endsWith('.md'));
            
            for (const file of mdFiles) {
                try {
                    const response = await fetch(file);
                    const text = await response.text();
                    this.markdownContents[file] = this.formatMarkdown(text);
                    
                    // Create mapping from source file to documentation
                    const baseName = file.split('/').pop().replace('.md', '');
                    const possibleExtensions = ['.js', '.css', '.html'];
                    
                    possibleExtensions.forEach(ext => {
                        const sourceFile = baseName + ext;
                        this.markdownContents[sourceFile] = this.markdownContents[file];
                    });
                } catch (error) {
                    console.error(`Error loading ${file}:`, error);
                }
            }
        } catch (error) {
            console.error('Error loading markdown files:', error);
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