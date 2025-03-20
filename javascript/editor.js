// Class to handle the editor functionality
class Editor {
    constructor() {
        this.activeTab = null;
        this.tabs = document.querySelectorAll('.tab');
        this.codeArea = document.querySelector('.code-area');
        this.lineNumbers = document.querySelector('.line-numbers');
        this.statusBar = document.querySelector('.status-bar');
        this.tabsContainer = document.querySelector('.editor-tabs');
        
        this.fileContents = {};
        
        this.initialize();
    }
    
    initialize() {
        // Set the first tab as active by default
        if (this.tabs.length > 0) {
            this.setActiveTab(this.tabs[0]);
        }
        
        // Add event listeners to tabs
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => this.setActiveTab(tab));
        });
        
        // Setup code area events
        this.setupCodeAreaEvents();
        
        // Initial line numbers
        this.updateLineNumbers();
    }
    
    async loadFileContent(fileName) {
        try {
            const response = await fetch(fileName);
            const content = await response.text();
            this.fileContents[fileName] = content;
            return content;
        } catch (error) {
            console.error(`Error loading ${fileName}:`, error);
            return '';
        }
    }
    
    async createTab(fileName) {
        // Check if tab already exists
        let existingTab = null;
        this.tabs.forEach(tab => {
            if (tab.textContent === fileName) {
                existingTab = tab;
            }
        });
        
        if (existingTab) {
            this.setActiveTab(existingTab);
            return;
        }
        
        // Create new tab
        const newTab = document.createElement('div');
        newTab.className = 'tab';
        newTab.textContent = fileName;
        
        // Add event listener to the new tab
        newTab.addEventListener('click', () => this.setActiveTab(newTab));
        
        // Add to tabs container
        this.tabsContainer.appendChild(newTab);
        
        // Update tabs collection
        this.tabs = document.querySelectorAll('.tab');
        
        // Load file content if not already loaded
        if (!this.fileContents[fileName]) {
            await this.loadFileContent(fileName);
        }
        
        // Set as active tab
        this.setActiveTab(newTab);
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
        if (this.fileContents[fileName]) {
            this.codeArea.innerHTML = this.fileContents[fileName];
        } else {
            this.loadFileContent(fileName).then(content => {
                this.codeArea.innerHTML = content;
                this.updateLineNumbers();
            });
        }
        
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
}