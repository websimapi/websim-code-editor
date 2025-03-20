// Class to handle the file browser functionality
class FileBrowser {
    constructor(editor) {
        this.editor = editor;
        this.fileList = document.querySelector('.file-list');
        this.fileItems = document.querySelectorAll('.file-item');
        this.addFileButton = document.querySelector('.add-file-button');
        
        this.initialize();
        this.loadProjectFiles();
    }
    
    initialize() {
        // Add event listeners to file items
        this.fileItems.forEach(item => {
            item.addEventListener('click', () => this.selectFile(item));
        });
        
        // Add file button event
        this.addFileButton.addEventListener('click', () => this.addNewFile());
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
    
    async loadProjectFiles() {
        try {
            // Get all the assets available in the project
            const response = await fetch('/assets');
            const files = await response.json();
            
            // Clear existing file list
            this.fileList.innerHTML = '';
            
            // Add each file to the file list
            files.forEach(file => {
                this.createFileItem(file);
            });
            
            // Update fileItems collection
            this.fileItems = document.querySelectorAll('.file-item');
            
            // Add event listeners to the new file items
            this.fileItems.forEach(item => {
                item.addEventListener('click', () => this.selectFile(item));
            });
            
            // Select the first file by default
            if (this.fileItems.length > 0) {
                this.selectFile(this.fileItems[0]);
            }
        } catch (error) {
            console.error('Error loading project files:', error);
        }
    }
    
    createFileItem(fileName) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        
        // Determine icon based on file extension
        const extension = fileName.split('.').pop();
        let iconClass = 'fas fa-file-code';
        
        if (extension === 'html' || extension === 'htm') {
            iconClass = 'fas fa-file-code';
        } else if (extension === 'css') {
            iconClass = 'fas fa-file-code';
        } else if (extension === 'js') {
            iconClass = 'fas fa-file-code';
        } else if (extension === 'md') {
            iconClass = 'fas fa-file-alt';
        }
        
        fileItem.innerHTML = `<i class="${iconClass}"></i><span>${fileName}</span>`;
        this.fileList.appendChild(fileItem);
    }
}