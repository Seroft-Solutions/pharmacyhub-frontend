/**
 * Simple User Agent Parser utility to replace the ua-parser-js library
 * This provides a basic implementation that can be used until the ua-parser-js package is installed
 */

export class UAParser {
  private userAgent: string;

  constructor(userAgent?: string) {
    this.userAgent = userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : '');
  }

  getBrowser() {
    // Basic browser detection
    const ua = this.userAgent.toLowerCase();
    
    let browser = {
      name: 'Unknown',
      version: ''
    };

    if (ua.includes('firefox')) {
      browser.name = 'Firefox';
    } else if (ua.includes('edg')) {
      browser.name = 'Edge';
    } else if (ua.includes('chrome')) {
      browser.name = 'Chrome';
    } else if (ua.includes('safari') && !ua.includes('chrome')) {
      browser.name = 'Safari';
    } else if (ua.includes('opera') || ua.includes('opr')) {
      browser.name = 'Opera';
    } else if (ua.includes('msie') || ua.includes('trident')) {
      browser.name = 'Internet Explorer';
    }

    // Basic version extraction - can be improved
    const match = 
      ua.match(new RegExp(`${browser.name.toLowerCase()}\\/(\\d+(\\.\\d+)*)`)) || 
      ua.match(/version\/([\d.]+)/i) ||
      ['', ''];
    
    browser.version = match[1] || '';
    
    return browser;
  }

  getOS() {
    const ua = this.userAgent.toLowerCase();
    
    let os = {
      name: 'Unknown',
      version: ''
    };

    if (ua.includes('win')) {
      os.name = 'Windows';
      if (ua.includes('windows nt 10')) {
        os.version = '10';
      } else if (ua.includes('windows nt 6.3')) {
        os.version = '8.1';
      } else if (ua.includes('windows nt 6.2')) {
        os.version = '8';
      } else if (ua.includes('windows nt 6.1')) {
        os.version = '7';
      }
    } else if (ua.includes('mac')) {
      os.name = 'macOS';
    } else if (ua.includes('android')) {
      os.name = 'Android';
    } else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) {
      os.name = 'iOS';
    } else if (ua.includes('linux')) {
      os.name = 'Linux';
    }

    return os;
  }

  getDevice() {
    const ua = this.userAgent.toLowerCase();
    
    let device: {
      vendor: string;
      model: string;
      type: string;
    } = {
      vendor: '',
      model: '',
      type: 'desktop'
    };

    if (ua.includes('mobile')) {
      device.type = 'mobile';
    } else if (ua.includes('tablet') || ua.includes('ipad')) {
      device.type = 'tablet';
    }

    if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) {
      device.vendor = 'Apple';
    } else if (ua.includes('samsung')) {
      device.vendor = 'Samsung';
    } else if (ua.includes('huawei')) {
      device.vendor = 'Huawei';
    } else if (ua.includes('xiaomi')) {
      device.vendor = 'Xiaomi';
    } else if (ua.includes('pixel')) {
      device.vendor = 'Google';
    }

    return device;
  }
}

export default UAParser;