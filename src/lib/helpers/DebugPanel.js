class DebugPanel {
  constructor(analytics) {
    this.analytics = analytics;
    this.createPanel();
  }

  createPanel() {
    const panel = document.createElement('div');
    panel.style.cssText = `
      position: fixed;
      bottom: 0;
      right: 0;
      width: 300px;
      height: 400px;
      background: white;
      border: 1px solid #ccc;
      box-shadow: -2px -2px 10px rgba(0,0,0,0.1);
      z-index: 9999;
      display: none;
    `;
    
    const header = document.createElement('div');
    header.innerHTML = '<h3>Analytics Storage Debug</h3>';
    header.style.padding = '10px';
    header.style.borderBottom = '1px solid #ccc';
    
    const content = document.createElement('div');
    content.style.padding = '10px';
    content.style.height = 'calc(100% - 100px)';
    content.style.overflow = 'auto';
    
    const refreshButton = document.createElement('button');
    refreshButton.textContent = 'Refresh';
    refreshButton.onclick = () => this.updateContent(content);
    
    panel.appendChild(header);
    header.appendChild(refreshButton);
    panel.appendChild(content);
    
    document.body.appendChild(panel);
    
    // Add keyboard shortcut (Ctrl/Cmd + Shift + A)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        if (panel.style.display === 'block') {
          this.updateContent(content);
        }
      }
    });
  }
  
  updateContent(container) {
    const data = this.analytics.getAll();
    container.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
  }
}

module.exports = DebugPanel;