// utils/versionManager.js

/**
 * 从 manifest.json 动态获取版本号
 * @returns {string} 当前版本号
 */
function getVersionFromManifest() {
  try {
    // #ifdef APP-PLUS
    // APP 端：使用 5+ API 获取 manifest.json 中的 versionName
    // @ts-ignore
    if (typeof plus !== 'undefined' && plus.runtime && plus.runtime.version) {
      // @ts-ignore
      const version = plus.runtime.version;
      if (version) {
        return version;
      }
    }
    // 如果 5+ API 不可用，尝试从 systemInfo 获取
    // #endif
    
    // 统一获取 systemInfo（所有平台都支持）
    const systemInfo = uni.getSystemInfoSync();

    // #ifdef APP-PLUS
    // APP 端：优先使用 appWgtVersion，其次 appVersion
    return systemInfo.appWgtVersion || systemInfo.appVersion || '4.2.9';
    // #endif
    
    // #ifdef MP-WEIXIN || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO || MP-QQ
    // 小程序端：使用 appVersion（小程序版本号）
    return systemInfo.appVersion || '4.2.9';
    // #endif
    
    // #ifdef H5
    // H5 端：使用 appVersion
    return systemInfo.appVersion || '4.2.9';
    // #endif
    
    // 兜底方案（如果以上条件都不满足）
    return '4.2.9';
  } catch (error) {
    console.error('获取版本号失败:', error);
    // 兜底方案：返回默认版本号（与 manifest.json 中的 versionName 保持一致）
    return '4.2.9';
  }
}

/**
 * 获取当前版本号（从 manifest.json 动态读取）
 * @returns {string} 当前版本号
 */
export function getCurrentVersion() {
  const version = getVersionFromManifest();
  // console.log('当前使用版本号（来自 manifest.json）:', version);
  return version;
}

/**
 * 设置新的版本号（已废弃，版本号现在从 manifest.json 动态读取）
 * @param {string} newVersion 新版本号
 * @deprecated 版本号现在从 manifest.json 动态读取，此方法不再生效
 */
export function setVersion(newVersion) {
  // console.warn('setVersion 已废弃，版本号现在从 manifest.json 动态读取');
}

/**
 * 获取版本号（不再自增，直接返回 manifest.json 中的版本号）
 * @param {string} rule 递增规则（已废弃，不再使用）
 * @returns {string} manifest.json 中的版本号
 */
export function incrementVersion(rule = 'default') {
  // 【修改】不再自增，直接返回 manifest.json 中的版本号
  const version = getVersionFromManifest();
  // console.log('获取版本号（来自 manifest.json，不再自增）:', version);
  return version;
}

/**
 * 重置版本号（已废弃，版本号现在从 manifest.json 动态读取）
 * @deprecated 版本号现在从 manifest.json 动态读取，此方法不再生效
 */
export function resetVersion() {
  console.warn('resetVersion 已废弃，版本号现在从 manifest.json 动态读取');
  return getVersionFromManifest();
}