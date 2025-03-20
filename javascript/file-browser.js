// Class to handle the file browser functionality
class FileBrowser {
    constructor(editor) {
        this.editor = editor;
        this.fileList = document.querySelector('.file-list');
        this.fileItems = document.querySelectorAll('.file-item');
        this.addFileButton = document.querySelector('.add-file-button');
        
        this.initialize();
    }
    
    initialize() {
        // Add event listeners to file items
        this.fileItems.forEach(item => {
            item.addEventListener('click', () => this.selectFile(item));
        });
        
        // Add file button event
        this.addFileButton.addEventListener('click', () => this.addNewFile());
        
        // Add missing project files
        this.addMissingProjectFiles();
    }
    
    selectFile(fileItem) {
        // Clear active state from all items
        this.fileItems.forEach(item => item.classList.remove('active'));
        
        // Set the clicked item as active
        fileItem.classList.add('active');
        
        // Get the file name and activate the corresponding tab
        const fileName = fileItem.querySelector('span').textContent;
        const tabs = document.querySelectorAll('.tab');
        
        // Find and click the corresponding tab
        tabs.forEach(tab => {
            if (tab.textContent === fileName) {
                tab.click();
            }
        });
    }
    
    addNewFile() {
        const fileName = prompt('Enter file name:');
        if (!fileName) return;
        
        // Create a new file item
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        
        // Determine icon based on file extension
        const extension = fileName.split('.').pop();
        let iconClass = 'fas fa-file-code';
        
        fileItem.innerHTML = `<i class="${iconClass}"></i><span>${fileName}</span>`;
        
        // Add event listener to the new file item
        fileItem.addEventListener('click', () => this.selectFile(fileItem));
        
        // Add to file list
        this.fileList.appendChild(fileItem);
        this.fileItems = document.querySelectorAll('.file-item');
        
        // Create a new tab
        const tabsContainer = document.querySelector('.editor-tabs');
        const newTab = document.createElement('div');
        newTab.className = 'tab';
        newTab.textContent = fileName;
        
        // Add event listener to the new tab
        newTab.addEventListener('click', () => this.editor.setActiveTab(newTab));
        
        // Add to tabs container
        tabsContainer.appendChild(newTab);
        
        // Initialize the content for this file
        this.editor.fileContents[fileName] = '';
        
        // Select the new file
        this.selectFile(fileItem);
    }
    
    addMissingProjectFiles() {
        const missingFiles = [
            'editor.js', 'file-browser.js', 'main.js', 'markdown-viewer.js', 'ui-events.js',
            'header.css', 'main.css', 'markdown-viewer.css', 'reset.css', 'sidebar.css', 'editor.css'
        ];
        
        missingFiles.forEach(file => {
            // Create a new file item if it doesn't already exist
            const fileName = file;
            if (!this.fileExists(fileName)) {
                this.createFileItem(fileName);
                
                // Initialize empty content for files
                this.editor.fileContents[fileName] = '';
            }
        });
    }
    
    fileExists(fileName) {
        let exists = false;
        this.fileItems.forEach(item => {
            if (item.querySelector('span').textContent === fileName) {
                exists = true;
            }
        });
        return exists;
    }
    
    createFileItem(fileName) {
        // Skip .md files - they should not be shown in the file browser
        if (fileName.endsWith('.md')) {
            return null;
        }
        
        // Create a new file item
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        
        // Determine icon based on file extension
        const extension = fileName.split('.').pop();
        let iconClass = 'fas fa-file-code';
        
        if (extension === 'css') {
            iconClass = 'fas fa-file-code';
        } else if (extension === 'js') {
            iconClass = 'fas fa-file-code';
        }
        
        fileItem.innerHTML = `<i class="${iconClass}"></i><span>${fileName}</span>`;
        
        // Add event listener to the new file item
        fileItem.addEventListener('click', () => this.selectFile(fileItem));
        
        // Add to file list
        this.fileList.appendChild(fileItem);
        this.fileItems = document.querySelectorAll('.file-item');
        
        // Create a new tab
        const tabsContainer = document.querySelector('.editor-tabs');
        const newTab = document.createElement('div');
        newTab.className = 'tab';
        newTab.textContent = fileName;
        
        // Add event listener to the new tab
        newTab.addEventListener('click', () => this.editor.setActiveTab(newTab));
        
        // Add to tabs container
        tabsContainer.appendChild(newTab);
        
        return fileItem;
    }
}