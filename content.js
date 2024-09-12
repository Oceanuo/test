function formatChatGPTAnswer() {
  const answerElements = document.querySelectorAll('.markdown.prose.w-full');
  
  answerElements.forEach(element => {
    // 检查是否存在<output>标签
    if ((element.innerHTML.includes('<output>') && element.innerHTML.includes('</output>')) || 
        (element.innerHTML.includes('&lt;output&gt;') && element.innerHTML.includes('&lt;/output&gt;'))) {
      // 创建一个新的元素来存储修改后的内容
      const newElement = document.createElement('div');
      newElement.innerHTML = element.innerHTML;
      
      // 使用更严格的正则表达式来移除<解答>和<反思>标签及其内容
      newElement.innerHTML = newElement.innerHTML.replace(/(?:<p>)?\s*&lt;解答&gt;[\s\S]*?&lt;\/解答&gt;\s*(?:<\/p>)?/g, '');
      newElement.innerHTML = newElement.innerHTML.replace(/(?:<p>)?\s*&lt;反思&gt;[\s\S]*?&lt;\/反思&gt;\s*(?:<\/p>)?/g, '');
      newElement.innerHTML = newElement.innerHTML.replace(/(?:<p>)?\s*&lt;思考&gt;[\s\S]*?&lt;\/思考&gt;\s*(?:<\/p>)?/g, '');
      
      // 保留<output>标签内的内容，但移除标签本身
      newElement.innerHTML = newElement.innerHTML.replace(/(?:<p>)?\s*&lt;output&gt;([\s\S]*?)&lt;\/output&gt;\s*(?:<\/p>)?/g, '$1');
      
      // 移除可能残留的空段落和多余的空白
      newElement.innerHTML = newElement.innerHTML.replace(/<p>\s*<\/p>/g, '').trim();
      
      // 只有当内容发生变化时才更新原始元素
      if (newElement.innerHTML !== element.innerHTML) {
        element.innerHTML = newElement.innerHTML;
      }
    }
  });
}

function observeChanges() {
  const targetNode = document.body;
  const config = { childList: true, subtree: true };

  const callback = function(mutationsList, observer) {
    for(let mutation of mutationsList) {
      if (mutation.type === 'childList') {
        setTimeout(formatChatGPTAnswer, 200); // 添加短暂延迟
      }
    }
  };

  const observer = new MutationObserver(callback);
  observer.observe(targetNode, config);
}

// 等待页面加载完成后再运行
window.addEventListener('load', () => {
  setTimeout(() => {
    formatChatGPTAnswer();
    observeChanges();
    console.log('ChatGPT Answer Formatter 插件已加载并运行');
  }, 1000); // 添加1秒延迟以确保页面完全加载
});