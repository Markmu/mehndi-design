// 获取特定类别的图片
export async function getCategoryImages(category: string) {
  try {
    const response = await fetch(`/api/images?category=${category}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('获取图片失败');
    }
    
    return await response.json();
  } catch (error) {
    console.error('获取图片错误:', error);
    return [];
  }
}

// 获取所有类别的图片计数
export async function getCategoriesWithCount() {
  try {
    const response = await fetch('/api/images/categories', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('获取类别计数失败');
    }
    
    return await response.json();
  } catch (error) {
    console.error('获取类别计数错误:', error);
    return [];
  }
}