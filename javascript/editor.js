// Class to handle the editor functionality
class Editor {
    constructor() {
        this.activeTab = null;
        this.tabs = document.querySelectorAll('.tab');
        this.codeArea = document.querySelector('.code-area');
        this.lineNumbers = document.querySelector('.line-numbers');
        this.statusBar = document.querySelector('.status-bar');
        
        this.fileContents = {
            'index.html': this.codeArea.innerHTML,
            'main.js': '// JavaScript code goes here\n\nconst app = {\n    init() {\n        console.log("Application initialized");\n    }\n};\n\napp.init();',
            'styles.css': '/* CSS styles */\n\nbody {\n    font-family: Arial, sans-serif;\n    margin: 0;\n    padding: 20px;\n}\n\n.container {\n    max-width: 1200px;\n    margin: 0 auto;\n}'
        };
        
        this.initialize();
    }
    
    initialize() {
        // Set the first tab as active by default
        this.setActiveTab(this.tabs[0]);
        
        // Add event listeners to tabs
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => this.setActiveTab(tab));
        });
        
        // Setup code area events
        this.setupCodeAreaEvents();
        
        // Initial line numbers
        this.updateLineNumbers();
        
        // Load initial file content
        this.loadFileContent('index.html');
    }
    
    setActiveTab(tab) {
        // Save current content
        if (this.activeTab) {
            const fileName = this.activeTab.textContent;
            this.fileContents[fileName] = this.codeArea.innerHTML;
            this.activeTab.classList.remove('active');
        }
        
        // Set new active tab
        tab.classList.add('active');
        this.activeTab = tab;
        
        // Load content for the active tab
        const fileName = tab.textContent;
        this.loadFileContent(fileName);
        
        // Update status bar
        this.updateStatusBar(fileName);
        
        // Update line numbers
        this.updateLineNumbers();
    }
    
    updateStatusBar(fileName) {
        const fileType = fileName.split('.').pop().toUpperCase();
        this.statusBar.querySelector('.status-item:nth-child(3)').textContent = fileType;
    }
    
    updateLineNumbers() {
        const lines = this.codeArea.innerHTML.split('\n').length;
        let numbersHTML = '';
        
        for (let i = 1; i <= lines; i++) {
            numbersHTML += `<div>${i}</div>`;
        }
        
        this.lineNumbers.innerHTML = numbersHTML;
    }
    
    setupCodeAreaEvents() {
        this.codeArea.addEventListener('input', () => {
            this.updateLineNumbers();
            this.updateCursorPosition();
        });
        
        this.codeArea.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                document.execCommand('insertHTML', false, '    ');
            }
        });
        
        this.codeArea.addEventListener('click', () => {
            this.updateCursorPosition();
        });
    }
    
    updateCursorPosition() {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const contents = range.startContainer.textContent.substring(0, range.startOffset);
            
            const lines = this.codeArea.innerHTML.split('\n');
            let lineCount = 0;
            let charCount = 0;
            
            for (let i = 0; i < lines.length; i++) {
                if (charCount + lines[i].length >= contents.length) {
                    lineCount = i + 1;
                    const charsInLine = contents.length - charCount;
                    this.statusBar.querySelector('.status-item:nth-child(2)').textContent = `Line: ${lineCount}, Column: ${charsInLine}`;
                    break;
                }
                charCount += lines[i].length + 1; // +1 for the newline
            }
        }
    }

    loadFileContent(fileName) {
        if (this.fileContents[fileName]) {
            this.codeArea.innerHTML = this.fileContents[fileName];
        } else {
            // Initialize with placeholder content while loading
            this.codeArea.innerHTML = `// Loading ${fileName}...`;
            
            // Determine correct path based on file extension
            let filePath = fileName;
            if (fileName.endsWith('.js')) {
                filePath = 'javascript/' + fileName;
            } else if (fileName.endsWith('.css')) {
                filePath = 'css/' + fileName;
            } else if (fileName === 'index.html') {
                filePath = fileName;
            }
            
            // Fetch the content from the correct path
            fetch(filePath)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to load ${filePath}`);
                    }
                    return response.text();
                })
                .then(content => {
                    // Escape HTML tags for display
                    const escapedContent = content
                        .replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;');
                    this.fileContents[fileName] = escapedContent;
                    this.codeArea.innerHTML = escapedContent;
                    this.updateLineNumbers();
                })
                .catch(error => {
                    console.error(`Error loading ${fileName}:`, error);
                    this.codeArea.innerHTML = `// Error: File ${fileName} could not be loaded`;
                });
        }
    }
}