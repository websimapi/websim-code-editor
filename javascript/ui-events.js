// Function to setup UI events
function setupUIEvents(editor, fileBrowser, markdownViewer) {
    // Run code button
    const runButton = document.querySelector('.control-button[title="Run Code"]');
    runButton.addEventListener('click', () => {
        alert('Code execution would happen here!');
    });
    
    // Save button
    const saveButton = document.querySelector('.control-button[title="Save"]');
    saveButton.addEventListener('click', () => {
        const fileName = editor.activeTab.textContent;
        editor.fileContents[fileName] = editor.codeArea.innerHTML;
        
        // Show confirmation
        const statusItem = document.querySelector('.status-item:first-child');
        statusItem.textContent = `Saved ${fileName}`;
        
        setTimeout(() => {
            statusItem.textContent = 'Ready';
        }, 2000);
    });
    
    // Settings button
    const settingsButton = document.querySelector('.control-button[title="Settings"]');
    settingsButton.addEventListener('click', () => {
        alert('Settings would open here!');
    });
    
    // Add right-click context menu for files to view documentation
    const fileItems = document.querySelectorAll('.file-item');
    fileItems.forEach(item => {
        item.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const fileName = item.querySelector('span').textContent;
            markdownViewer.showMarkdownForFile(fileName);
        });
        
        // Also add document icon that appears on hover
        const docIcon = document.createElement('i');
        docIcon.className = 'fas fa-book doc-icon';
        docIcon.style.marginLeft = '5px';
        docIcon.style.opacity = '1'; 
        docIcon.title = 'View Documentation';
        
        docIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            const fileName = item.querySelector('span').textContent;
            markdownViewer.showMarkdownForFile(fileName);
        });
        
        item.appendChild(docIcon);
        
        item.addEventListener('mouseenter', () => {
            docIcon.style.opacity = '1';
        });
        
        item.addEventListener('mouseleave', () => {
            docIcon.style.opacity = '1'; 
        });
    });
}